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

// Default image map for services
const DEFAULT_SERVICE_IMAGES: Record<string, string> = {
  'physical-security-systems': 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
  'networking-infrastructure': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
  'elv-systems': 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80',
  'software-digital-solutions': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
};

const DEFAULT_HERO_FALLBACK = 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80';

export interface ChangeRecord {
  fieldPath: string;
  action: string;
  beforePreview: string;
  afterPreview: string;
  bytesSaved: number;
}

function cleanValue(
  val: any, 
  fieldPath = '', 
  context?: { serviceId?: string; isServiceList?: boolean; isProjectList?: boolean }
): { cleaned: any; changed: boolean; reasons: string[]; changesTable: ChangeRecord[] } {
  let changed = false;
  const reasons: string[] = [];
  const changesTable: ChangeRecord[] = [];

  if (typeof val === 'string') {
    const originalBytes = Buffer.byteLength(val, 'utf8');

    // 1. Check for Base64 Data URLs
    if (val.startsWith('data:image/')) {
      let replacement = '';
      let actionLabel = 'Removed Base64 Image';

      if (context?.isServiceList && context.serviceId && DEFAULT_SERVICE_IMAGES[context.serviceId]) {
        replacement = DEFAULT_SERVICE_IMAGES[context.serviceId];
        actionLabel = `Replaced Base64 with Default Service Image (${context.serviceId})`;
      } else if (fieldPath.includes('servicesList')) {
        replacement = DEFAULT_SERVICE_IMAGES['physical-security-systems'];
        actionLabel = 'Replaced Base64 with Default Service Image';
      } else if (fieldPath.includes('heroCctv') || fieldPath.includes('heroAccess')) {
        replacement = DEFAULT_HERO_FALLBACK;
        actionLabel = 'Replaced Base64 Hero Image with Unsplash CDN URL';
      }

      const newBytes = Buffer.byteLength(replacement, 'utf8');
      const bytesSaved = Math.max(0, originalBytes - newBytes);

      reasons.push(`${actionLabel} at ${fieldPath} (saved ${(bytesSaved / 1024).toFixed(1)} KB)`);
      changesTable.push({
        fieldPath,
        action: actionLabel,
        beforePreview: `data:image/... (${(originalBytes / 1024).toFixed(1)} KB)`,
        afterPreview: replacement ? (replacement.length > 50 ? replacement.substring(0, 47) + '...' : replacement) : '"" (empty string)',
        bytesSaved,
      });

      return { cleaned: replacement, changed: true, reasons, changesTable };
    }

    // 2. Check for placeholder strings
    if (isPlaceholder(val)) {
      reasons.push(`Cleared placeholder "${val}" at ${fieldPath}`);
      changesTable.push({
        fieldPath,
        action: 'Cleared Placeholder',
        beforePreview: val,
        afterPreview: '""',
        bytesSaved: originalBytes,
      });
      return { cleaned: '', changed: true, reasons, changesTable };
    }

    return { cleaned: val, changed: false, reasons, changesTable };
  }

  if (Array.isArray(val)) {
    const isProjectList = fieldPath.toLowerCase().includes('project');
    const isServiceList = fieldPath.toLowerCase().includes('service');
    const newArr: any[] = [];

    for (let i = 0; i < val.length; i++) {
      const item = val[i];
      if (item && typeof item === 'object') {
        const itemId = String(item.id || '').toLowerCase();
        const itemSlug = String(item.slug || '').toLowerCase();

        // If it's a project list, drop legacy/blocked projects
        if (isProjectList && (BLOCKED_IDENTIFIERS.has(itemId) || BLOCKED_IDENTIFIERS.has(itemSlug))) {
          changed = true;
          const itemBytes = Buffer.byteLength(JSON.stringify(item), 'utf8');
          reasons.push(`Removed blocked project id="${item.id}" slug="${item.slug}" from ${fieldPath}`);
          changesTable.push({
            fieldPath: `${fieldPath}[${i}]`,
            action: 'Dropped Blocked Project',
            beforePreview: `Project: ${item.id || item.slug}`,
            afterPreview: '[REMOVED]',
            bytesSaved: itemBytes,
          });
          continue;
        }

        // Recursively clean item properties (e.g. nested image Base64 in services or projects)
        const cleanedObj: Record<string, any> = {};
        for (const [k, v] of Object.entries(item)) {
          const res = cleanValue(v, `${fieldPath}[${i}].${k}`, {
            serviceId: isServiceList ? itemId : undefined,
            isServiceList,
            isProjectList,
          });
          cleanedObj[k] = res.cleaned;
          if (res.changed) {
            changed = true;
            reasons.push(...res.reasons);
            changesTable.push(...res.changesTable);
          }
        }
        newArr.push(cleanedObj);
      } else {
        const res = cleanValue(item, `${fieldPath}[${i}]`, { isServiceList, isProjectList });
        newArr.push(res.cleaned);
        if (res.changed) {
          changed = true;
          reasons.push(...res.reasons);
          changesTable.push(...res.changesTable);
        }
      }
    }

    return { cleaned: newArr, changed, reasons, changesTable };
  }

  if (val !== null && typeof val === 'object') {
    const cleanedObj: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      const res = cleanValue(v, `${fieldPath}.${k}`);
      cleanedObj[k] = res.cleaned;
      if (res.changed) {
        changed = true;
        reasons.push(...res.reasons);
        changesTable.push(...res.changesTable);
      }
    }
    return { cleaned: cleanedObj, changed, reasons, changesTable };
  }

  return { cleaned: val, changed: false, reasons, changesTable };
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

  const allChangesTable: ChangeRecord[] = [];

  for (const [k, v] of Object.entries(rawData)) {
    const res = cleanValue(v, k);
    cleanedDoc[k] = res.cleaned;
    if (res.changed) {
      docChanged = true;
      allReasons.push(...res.reasons);
      allChangesTable.push(...res.changesTable);
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

  console.log(`\n[DRY-RUN CHANGES TABLE] (${allChangesTable.length} proposed field updates):`);
  console.log('Field Path'.padEnd(30) + 'Action'.padEnd(42) + 'Before'.padEnd(30) + 'After (Fallback/Clean)'.padEnd(45) + 'Savings');
  console.log('-'.repeat(160));
  for (const c of allChangesTable) {
    console.log(
      c.fieldPath.padEnd(30) +
      c.action.padEnd(42) +
      c.beforePreview.padEnd(30) +
      c.afterPreview.padEnd(45) +
      `${(c.bytesSaved / 1024).toFixed(1)} KB`
    );
  }

  if (isApply) {
    console.log(`\n[APPLYING] Writing cleaned document to Firestore...`);
    await setDoc(docRef, cleanedDoc);
    console.log(`[SUCCESS] Document ${collectionName}/${docId} updated in Firestore.`);
  } else {
    console.log(`\n[DRY-RUN] No changes written to Firestore. Use --apply to execute after reviewing.`);
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
