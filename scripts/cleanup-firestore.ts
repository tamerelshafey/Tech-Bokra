/**
 * scripts/cleanup-firestore.ts
 *
 * Firestore Sanitization Tool for Tech Bokra.
 * - DRY-RUN by default (no writes occur unless --apply is provided).
 * - When --apply is given, automatically creates a local JSON backup BEFORE writing.
 * - Purges Base64 data URLs from settings/general and settings/admin_vault.
 * - Purges legacy/blocked project entries ('alrehla', 'helio-property', 'widad-tech', etc.).
 * - Purges unconfirmed placeholder strings ('TO_CONFIRM', '[...').
 *
 * Usage:
 *   Dry-run (safe test):
 *     npx tsx scripts/cleanup-firestore.ts
 *
 *   Live apply (creates backup first, then writes):
 *     npx tsx scripts/cleanup-firestore.ts --apply
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';
import firebaseConfig from '../firebase-applet-config.json';

const BLOCKED_IDENTIFIERS = new Set([
  'alrehla',
  'alrehla-platform',
  'contracting-ops-platform',
  'helio-property',
  'widad-tech',
]);

function isPlaceholder(val: unknown): boolean {
  if (typeof val !== 'string') return false;
  const trimmed = val.trim();
  return (
    trimmed.includes('TO_CONFIRM') ||
    trimmed.startsWith('[') ||
    trimmed === 'undefined' ||
    trimmed === 'null'
  );
}

function cleanValue(val: any, fieldPath = ''): { cleaned: any; changed: boolean; reasons: string[] } {
  let changed = false;
  const reasons: string[] = [];

  if (typeof val === 'string') {
    // 1. Check for Base64 Data URLs
    if (val.startsWith('data:image/')) {
      reasons.push(`Purged Base64 image string at ${fieldPath} (${val.length} chars)`);
      return { cleaned: '', changed: true, reasons };
    }
    // 2. Check for placeholder strings
    if (isPlaceholder(val)) {
      reasons.push(`Cleared placeholder "${val}" at ${fieldPath}`);
      return { cleaned: '', changed: true, reasons };
    }
    return { cleaned: val, changed: false, reasons };
  }

  if (Array.isArray(val)) {
    const isProjectList = fieldPath.toLowerCase().includes('project');
    const newArr: any[] = [];

    for (let i = 0; i < val.length; i++) {
      const item = val[i];
      if (item && typeof item === 'object') {
        const itemId = String(item.id || '').toLowerCase();
        const itemSlug = String(item.slug || '').toLowerCase();

        // If it's a project list, drop legacy/blocked projects
        if (isProjectList && (BLOCKED_IDENTIFIERS.has(itemId) || BLOCKED_IDENTIFIERS.has(itemSlug))) {
          changed = true;
          reasons.push(`Removed blocked project id="${item.id}" slug="${item.slug}" from ${fieldPath}`);
          continue;
        }

        // Recursively clean item properties (e.g. nested image Base64)
        const cleanedObj: Record<string, any> = {};
        for (const [k, v] of Object.entries(item)) {
          const res = cleanValue(v, `${fieldPath}[${i}].${k}`);
          cleanedObj[k] = res.cleaned;
          if (res.changed) {
            changed = true;
            reasons.push(...res.reasons);
          }
        }
        newArr.push(cleanedObj);
      } else {
        const res = cleanValue(item, `${fieldPath}[${i}]`);
        newArr.push(res.cleaned);
        if (res.changed) {
          changed = true;
          reasons.push(...res.reasons);
        }
      }
    }

    return { cleaned: newArr, changed, reasons };
  }

  if (val !== null && typeof val === 'object') {
    const cleanedObj: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      const res = cleanValue(v, `${fieldPath}.${k}`);
      cleanedObj[k] = res.cleaned;
      if (res.changed) {
        changed = true;
        reasons.push(...res.reasons);
      }
    }
    return { cleaned: cleanedObj, changed, reasons };
  }

  return { cleaned: val, changed: false, reasons };
}

async function processDocument(
  dbInstance: ReturnType<typeof getFirestore>,
  collectionName: string,
  docId: string,
  isApply: boolean,
  backupData: Record<string, any>
) {
  const docRef = doc(dbInstance, collectionName, docId);
  console.log(`\n--- Inspecting: ${collectionName}/${docId} ---`);

  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    console.log(`Document ${collectionName}/${docId} does not exist. Skipping.`);
    return;
  }

  const rawData = snap.data();
  backupData[`${collectionName}/${docId}`] = JSON.parse(JSON.stringify(rawData));

  const allReasons: string[] = [];
  const cleanedDoc: Record<string, any> = {};
  let docChanged = false;

  for (const [k, v] of Object.entries(rawData)) {
    const res = cleanValue(v, k);
    cleanedDoc[k] = res.cleaned;
    if (res.changed) {
      docChanged = true;
      allReasons.push(...res.reasons);
    }
  }

  const beforeBytes = Buffer.byteLength(JSON.stringify(rawData), 'utf8');
  const afterBytes = Buffer.byteLength(JSON.stringify(cleanedDoc), 'utf8');

  console.log(`Size before: ${(beforeBytes / 1024).toFixed(2)} KB (${beforeBytes} bytes)`);
  console.log(`Size after:  ${(afterBytes / 1024).toFixed(2)} KB (${afterBytes} bytes)`);
  console.log(`Potential savings: ${((beforeBytes - afterBytes) / 1024).toFixed(2)} KB`);

  if (!docChanged) {
    console.log(`[STATUS] Document is already clean. Zero changes needed.`);
    return;
  }

  console.log(`[CHANGES IDENTIFIED] (${allReasons.length} modifications):`);
  allReasons.forEach((r, idx) => console.log(`  ${idx + 1}. ${r}`));

  if (isApply) {
    console.log(`[APPLYING] Writing cleaned document to Firestore...`);
    await setDoc(docRef, cleanedDoc);
    console.log(`[SUCCESS] Document ${collectionName}/${docId} updated in Firestore.`);
  } else {
    console.log(`[DRY-RUN] No changes written. Use --apply to execute.`);
  }
}

async function run() {
  const args = process.argv.slice(2);
  const isApply = args.includes('--apply');

  console.log('====================================================');
  console.log(` Tech Bokra - Firestore Sanitization Script`);
  console.log(` Mode: ${isApply ? 'LIVE APPLY (WILL WRITE)' : 'DRY-RUN (SIMULATION ONLY)'}`);
  console.log(` Target DB: ${firebaseConfig.firestoreDatabaseId}`);
  console.log('====================================================');

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

  const backupData: Record<string, any> = {};

  await processDocument(db, 'settings', 'general', isApply, backupData);
  await processDocument(db, 'settings', 'admin_vault', isApply, backupData);

  if (isApply) {
    const backupsDir = path.resolve(process.cwd(), 'backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupsDir, `firestore-backup-${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2), 'utf8');
    console.log(`\n[BACKUP SAVED] Backup persisted to: ${backupFile}`);
  }

  console.log('\n[SCRIPT FINISHED]');
}

run().catch((err) => {
  console.error('[ERROR in cleanup-firestore]:', err);
  process.exit(1);
});
