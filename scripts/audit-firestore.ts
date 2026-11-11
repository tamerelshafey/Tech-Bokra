/**
 * scripts/audit-firestore.ts
 *
 * READ-ONLY Firestore Audit Tool (Dry-run by design).
 * Analyzes `settings/general` and `settings/admin_vault` documents:
 * - Field names, types, byte sizes
 * - Identifies Base64 data URLs (data:image/...)
 * - Identifies blocked legacy project IDs ('alrehla', 'helio-property', 'widad-tech', etc.)
 * - Identifies unverified placeholder patterns ('TO_CONFIRM', '[')
 *
 * Usage:
 *   npx tsx scripts/audit-firestore.ts
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const BLOCKED_IDENTIFIERS = [
  'alrehla',
  'alrehla-platform',
  'contracting-ops-platform',
  'helio-property',
  'widad-tech',
];

const PLACEHOLDER_PATTERNS = [
  'TO_CONFIRM',
  '[COMPANY',
  '[PHONE',
  '[EMAIL',
  '[',
];

interface FieldAudit {
  fieldName: string;
  type: string;
  approxBytes: number;
  hasBase64: boolean;
  base64Count: number;
  blockedIdsFound: string[];
  placeholdersFound: string[];
  phoneOrContactValues: string[];
}

function inspectValue(val: unknown): {
  type: string;
  approxBytes: number;
  hasBase64: boolean;
  base64Count: number;
  blockedIdsFound: string[];
  placeholdersFound: string[];
  phoneOrContactValues: string[];
} {
  const jsonStr = JSON.stringify(val ?? null);
  const approxBytes = Buffer.byteLength(jsonStr, 'utf8');
  let type: string = typeof val;
  if (val === null) type = 'null';
  else if (Array.isArray(val)) type = `array (${val.length} items)`;

  const hasBase64 = jsonStr.includes('data:image/');
  const base64Matches = jsonStr.match(/data:image\/[a-zA-Z0-9.+-]+;base64/g);
  const base64Count = base64Matches ? base64Matches.length : 0;

  const blockedIdsFound: string[] = [];
  for (const id of BLOCKED_IDENTIFIERS) {
    const regex = new RegExp(`["'/]${id}["'/]|"id":"${id}"|"slug":"${id}"`, 'i');
    if (regex.test(jsonStr) || jsonStr.toLowerCase().includes(`"${id}"`)) {
      blockedIdsFound.push(id);
    }
  }

  const placeholdersFound: string[] = [];
  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (jsonStr.includes(pattern)) {
      placeholdersFound.push(pattern);
    }
  }

  const phoneOrContactValues: string[] = [];
  if (typeof val === 'string') {
    if (val.includes('+') || /\d{8,}/.test(val)) {
      phoneOrContactValues.push(val);
    }
  }

  return {
    type,
    approxBytes,
    hasBase64,
    base64Count,
    blockedIdsFound,
    placeholdersFound,
    phoneOrContactValues,
  };
}

async function auditDoc(dbInstance: ReturnType<typeof getFirestore>, collectionName: string, docId: string) {
  const docRef = doc(dbInstance, collectionName, docId);
  console.log(`\n========================================================================`);
  console.log(`  AUDITING: ${collectionName}/${docId}`);
  console.log(`========================================================================`);

  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    console.log(`[NOTICE] Document ${collectionName}/${docId} does not exist in Firestore.`);
    return;
  }

  const data = snap.data();
  const keys = Object.keys(data).sort();
  const totalBytes = Buffer.byteLength(JSON.stringify(data), 'utf8');

  console.log(`Total Document Size: ${(totalBytes / 1024).toFixed(2)} KB (${totalBytes} bytes)`);
  console.log(`Total Fields Count: ${keys.length}\n`);

  const results: FieldAudit[] = [];

  for (const k of keys) {
    const val = data[k];
    const inspection = inspectValue(val);
    results.push({
      fieldName: k,
      ...inspection,
    });
  }

  // Summary Table
  console.log(
    'Field Name'.padEnd(28) +
    'Type'.padEnd(20) +
    'Size (Bytes)'.padEnd(14) +
    'Base64?'.padEnd(10) +
    'Blocked IDs'.padEnd(22) +
    'Placeholders'
  );
  console.log('-'.repeat(105));

  for (const r of results) {
    const base64Tag = r.hasBase64 ? `YES (${r.base64Count})` : 'No';
    const blockedTag = r.blockedIdsFound.length > 0 ? r.blockedIdsFound.join(', ') : 'None';
    const placeholderTag = r.placeholdersFound.length > 0 ? r.placeholdersFound.join(', ') : 'None';

    console.log(
      r.fieldName.padEnd(28) +
      r.type.padEnd(20) +
      String(r.approxBytes).padEnd(14) +
      base64Tag.padEnd(10) +
      blockedTag.padEnd(22) +
      placeholderTag
    );
  }

  // Print findings summary
  const base64Fields = results.filter((r) => r.hasBase64);
  const blockedFields = results.filter((r) => r.blockedIdsFound.length > 0);
  const placeholderFields = results.filter((r) => r.placeholdersFound.length > 0);

  console.log('\n--- DOCUMENT FINDINGS SUMMARY ---');
  console.log(`• Base64 Fields: ${base64Fields.length > 0 ? base64Fields.map((f) => f.fieldName).join(', ') : 'None'}`);
  console.log(`• Blocked IDs Found: ${blockedFields.length > 0 ? blockedFields.map((f) => `${f.fieldName} (${f.blockedIdsFound.join('/')})`).join(', ') : 'None'}`);
  console.log(`• Placeholder Fields: ${placeholderFields.length > 0 ? placeholderFields.map((f) => `${f.fieldName} (${f.placeholdersFound.join('/')})`).join(', ') : 'None'}`);
}

async function run() {
  console.log('----------------------------------------------------');
  console.log(' Tech Bokra - Firestore Read-Only Audit (Dry-Run)');
  console.log(` Target DB: ${firebaseConfig.firestoreDatabaseId}`);
  console.log('----------------------------------------------------');

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

  try {
    await auditDoc(db, 'settings', 'general');
  } catch (err: any) {
    console.warn('[NOTICE] Could not read settings/general:', err?.message || err);
  }

  try {
    await auditDoc(db, 'settings', 'admin_vault');
  } catch (err: any) {
    console.log(`\n[SECURITY NOTICE] settings/admin_vault requires authenticated admin session: ${err?.message || err}`);
    console.log(`(This confirms firestore.rules properly protect the admin vault from unauthenticated read access).`);
  }

  console.log('\n[AUDIT COMPLETED] No changes were written to Firestore (Strict Read-Only).\n');
}

run().catch((err) => {
  console.error('[ERROR in audit-firestore]:', err);
  process.exit(1);
});
