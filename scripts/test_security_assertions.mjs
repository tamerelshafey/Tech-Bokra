// Automated Security Rules Test Harness
// Simulates Firestore Security Rules logic for all 5 roles across all collections

const SUPER_ADMIN_EMAIL = 'tam.elshafey@gmail.com';

// Mock DB for Relational exists() and get() lookups
const mockFirestoreDB = {
  'admins/super_owner': { email: 'tam.elshafey@gmail.com', role: 'super_admin' },
  'admins/reg_admin_789': { email: 'ops@tech-bokra.com', role: 'admin' },
  'admins/editor_999': { email: 'editor@tech-bokra.com', role: 'editor' }, // non-admin role
  'settings/general': { heroTitle: 'Tech Bokra' },
  'settings/internal_audit': { log: 'internal admin data' },
  'inquiries/inq_existing': {
    clientName: 'Ahmed Omar',
    phone: '01012345678',
    status: 'new',
    createdAt: '2026-10-20T10:00:00.000Z',
    source: 'contact_form',
  },
};

function isValidId(id) {
  return typeof id === 'string' && id.length <= 128 && /^[a-zA-Z0-9_\-]+$/.test(id);
}

function isSignedIn(auth) {
  return auth !== null && typeof auth === 'object';
}

function isSuperAdmin(auth) {
  return (
    isSignedIn(auth) &&
    auth.token?.email === SUPER_ADMIN_EMAIL &&
    auth.token?.email_verified === true
  );
}

function isRegularAdmin(auth) {
  if (!isSignedIn(auth) || auth.token?.email_verified !== true) return false;
  const adminDoc = mockFirestoreDB[`admins/${auth.uid}`];
  if (!adminDoc) return false;
  return (
    ['super_admin', 'admin'].includes(adminDoc.role) &&
    adminDoc.email === auth.token?.email
  );
}

function isAdmin(auth) {
  return isSuperAdmin(auth) || isRegularAdmin(auth);
}

function isValidNewInquiry(data) {
  if (!data || typeof data !== 'object') return false;
  const required = ['clientName', 'phone', 'status', 'createdAt', 'source'];
  const allowed = [
    'clientName', 'phone', 'email', 'facilityType', 
    'selectedSystems', 'notes', 'source', 'status', 'createdAt'
  ];

  const keys = Object.keys(data);
  const hasAll = required.every((k) => keys.includes(k));
  const hasOnly = keys.every((k) => allowed.includes(k));

  if (!hasAll || !hasOnly) return false;

  if (typeof data.clientName !== 'string' || data.clientName.length < 2 || data.clientName.length > 100) return false;
  if (typeof data.phone !== 'string' || data.phone.length < 6 || data.phone.length > 32) return false;
  if (data.status !== 'new') return false;
  if (!['contact_form', 'estimator', 'custom_quote'].includes(data.source)) return false;
  if (typeof data.createdAt !== 'string' || data.createdAt.length > 64) return false;

  if ('email' in data && (typeof data.email !== 'string' || data.email.length > 100)) return false;
  if ('facilityType' in data && (typeof data.facilityType !== 'string' || data.facilityType.length > 60)) return false;
  if ('notes' in data && (typeof data.notes !== 'string' || data.notes.length > 2000)) return false;
  if ('selectedSystems' in data && (!Array.isArray(data.selectedSystems) || data.selectedSystems.length > 10)) return false;

  return true;
}

function isValidInquiryUpdate(incoming, existing) {
  const allowedKeys = ['status', 'updatedAt'];
  const incomingKeys = Object.keys(incoming);
  const diffKeys = incomingKeys.filter((k) => incoming[k] !== existing[k]);
  
  if (!diffKeys.every((k) => allowedKeys.includes(k))) return false;
  if (!['new', 'contacted', 'survey_scheduled', 'contracted', 'archived'].includes(incoming.status)) return false;
  if ('updatedAt' in incoming && (typeof incoming.updatedAt !== 'string' || incoming.updatedAt.length > 64)) return false;

  return true;
}

// Security Rules Evaluator
function evaluateRule(operation, collection, docId, auth, incomingData = null, existingData = null) {
  if (!isValidId(docId)) return false;

  if (collection === 'settings') {
    if (operation === 'get') {
      return docId === 'general' || (isAdmin(auth) && isValidId(docId));
    }
    if (operation === 'list') {
      return isAdmin(auth);
    }
    if (['create', 'update', 'delete'].includes(operation)) {
      return isAdmin(auth) && isValidId(docId);
    }
  }

  if (collection === 'inquiries') {
    if (operation === 'create') {
      return isValidId(docId) && isValidNewInquiry(incomingData);
    }
    if (['get', 'list'].includes(operation)) {
      return isAdmin(auth) && isValidId(docId);
    }
    if (operation === 'update') {
      return isAdmin(auth) && isValidId(docId) && isValidInquiryUpdate(incomingData, existingData);
    }
    if (operation === 'delete') {
      return isAdmin(auth) && isValidId(docId);
    }
  }

  if (collection === 'admins') {
    if (['get', 'list'].includes(operation)) {
      return isAdmin(auth) && isValidId(docId);
    }
    if (['create', 'update', 'delete'].includes(operation)) {
      return isSuperAdmin(auth) && isValidId(docId);
    }
  }

  return false;
}

// Test Matrix Execution
const testCases = [
  // 1. Unauthenticated Visitor
  {
    name: 'Unauth: Public read settings/general',
    run: () => evaluateRule('get', 'settings', 'general', null),
    expected: true,
  },
  {
    name: 'Unauth: Deny reading internal settings',
    run: () => evaluateRule('get', 'settings', 'internal_audit', null),
    expected: false,
  },
  {
    name: 'Unauth: Deny listing settings',
    run: () => evaluateRule('list', 'settings', 'general', null),
    expected: false,
  },
  {
    name: 'Unauth: Deny writing settings',
    run: () => evaluateRule('update', 'settings', 'general', null, { heroTitle: 'Hacked' }),
    expected: false,
  },
  {
    name: 'Unauth: Allow valid new inquiry submission',
    run: () => evaluateRule('create', 'inquiries', 'inq_valid_1', null, {
      clientName: 'Khaled',
      phone: '01000000000',
      status: 'new',
      createdAt: '2026-10-20T14:00:00Z',
      source: 'contact_form',
    }),
    expected: true,
  },
  {
    name: 'Unauth: Reject inquiry with shadow/malicious field (role: admin)',
    run: () => evaluateRule('create', 'inquiries', 'inq_attack_1', null, {
      clientName: 'Attacker',
      phone: '01000000000',
      status: 'new',
      createdAt: '2026-10-20T14:00:00Z',
      source: 'contact_form',
      role: 'admin', // SHADOW FIELD
    }),
    expected: false,
  },
  {
    name: 'Unauth: Reject inquiry with illegal status (status: contracted)',
    run: () => evaluateRule('create', 'inquiries', 'inq_attack_2', null, {
      clientName: 'Attacker',
      phone: '01000000000',
      status: 'contracted', // Non-new status
      createdAt: '2026-10-20T14:00:00Z',
      source: 'contact_form',
    }),
    expected: false,
  },
  {
    name: 'Unauth: Deny getting inquiries (PII Shield)',
    run: () => evaluateRule('get', 'inquiries', 'inq_existing', null),
    expected: false,
  },
  {
    name: 'Unauth: Deny listing inquiries',
    run: () => evaluateRule('list', 'inquiries', 'inq_existing', null),
    expected: false,
  },
  {
    name: 'Unauth: Deny reading admins collection',
    run: () => evaluateRule('get', 'admins', 'super_owner', null),
    expected: false,
  },
  {
    name: 'Unauth: Deny writing to admins collection',
    run: () => evaluateRule('create', 'admins', 'hacker_uid', null, { role: 'admin' }),
    expected: false,
  },

  // 2. Authenticated Non-Admin User (Guest)
  {
    name: 'Guest: Deny reading internal settings',
    run: () => evaluateRule('get', 'settings', 'internal_audit', { uid: 'guest_1', token: { email: 'guest@mail.com', email_verified: true } }),
    expected: false,
  },
  {
    name: 'Guest: Deny reading customer inquiries',
    run: () => evaluateRule('get', 'inquiries', 'inq_existing', { uid: 'guest_1', token: { email: 'guest@mail.com', email_verified: true } }),
    expected: false,
  },
  {
    name: 'Guest: Deny self-escalation write into admins collection',
    run: () => evaluateRule('create', 'admins', 'guest_1', { uid: 'guest_1', token: { email: 'guest@mail.com', email_verified: true } }, { role: 'admin' }),
    expected: false,
  },

  // 3. Email Spoofing Attack (Claiming admin email without email_verified)
  {
    name: 'Spoof Attack: Deny access if tam.elshafey@gmail.com has email_verified == false',
    run: () => evaluateRule('get', 'inquiries', 'inq_existing', { uid: 'spoofer_99', token: { email: 'tam.elshafey@gmail.com', email_verified: false } }),
    expected: false,
  },
  {
    name: 'Spoof Attack: Deny settings modification with unverified email',
    run: () => evaluateRule('update', 'settings', 'general', { uid: 'spoofer_99', token: { email: 'tam.elshafey@gmail.com', email_verified: false } }, { heroTitle: 'Hack' }),
    expected: false,
  },

  // 4. Regular Verified Admin
  {
    name: 'Regular Admin: Allow get internal settings',
    run: () => evaluateRule('get', 'settings', 'internal_audit', { uid: 'reg_admin_789', token: { email: 'ops@tech-bokra.com', email_verified: true } }),
    expected: true,
  },
  {
    name: 'Regular Admin: Allow read customer inquiries',
    run: () => evaluateRule('get', 'inquiries', 'inq_existing', { uid: 'reg_admin_789', token: { email: 'ops@tech-bokra.com', email_verified: true } }),
    expected: true,
  },
  {
    name: 'Regular Admin: Allow updating inquiry status & updatedAt',
    run: () => evaluateRule(
      'update',
      'inquiries',
      'inq_existing',
      { uid: 'reg_admin_789', token: { email: 'ops@tech-bokra.com', email_verified: true } },
      { ...mockFirestoreDB['inquiries/inq_existing'], status: 'contacted', updatedAt: '2026-10-20T14:05:00Z' },
      mockFirestoreDB['inquiries/inq_existing']
    ),
    expected: true,
  },
  {
    name: 'Regular Admin: Reject updating non-allowed field (clientName change)',
    run: () => evaluateRule(
      'update',
      'inquiries',
      'inq_existing',
      { uid: 'reg_admin_789', token: { email: 'ops@tech-bokra.com', email_verified: true } },
      { ...mockFirestoreDB['inquiries/inq_existing'], clientName: 'Tampered Name' },
      mockFirestoreDB['inquiries/inq_existing']
    ),
    expected: false,
  },
  {
    name: 'Regular Admin: DENY creating new admin accounts (Privilege Escalation Protection)',
    run: () => evaluateRule(
      'create',
      'admins',
      'new_sub_admin',
      { uid: 'reg_admin_789', token: { email: 'ops@tech-bokra.com', email_verified: true } },
      { email: 'new_admin@tech-bokra.com', role: 'admin' }
    ),
    expected: false,
  },
  {
    name: 'Regular Admin: DENY modifying own role to super_admin',
    run: () => evaluateRule(
      'update',
      'admins',
      'reg_admin_789',
      { uid: 'reg_admin_789', token: { email: 'ops@tech-bokra.com', email_verified: true } },
      { role: 'super_admin' },
      mockFirestoreDB['admins/reg_admin_789']
    ),
    expected: false,
  },

  // 5. Super Admin (Owner)
  {
    name: 'Super Admin: Allow creating new admins',
    run: () => evaluateRule(
      'create',
      'admins',
      'new_employee_uid',
      { uid: 'super_owner', token: { email: 'tam.elshafey@gmail.com', email_verified: true } },
      { email: 'eng@tech-bokra.com', role: 'admin' }
    ),
    expected: true,
  },
  {
    name: 'Super Admin: Full management of settings and inquiries',
    run: () => evaluateRule(
      'update',
      'settings',
      'general',
      { uid: 'super_owner', token: { email: 'tam.elshafey@gmail.com', email_verified: true } },
      { phone: '01000000000' }
    ),
    expected: true,
  },
];

console.log('--- STARTING FIRESTORE SECURITY RULES RIGOROUS TEST MATRIX ---');
let passedCount = 0;
let failedCount = 0;

for (const test of testCases) {
  const result = test.run();
  if (result === test.expected) {
    passedCount++;
    console.log(`[PASS] ${test.name}`);
  } else {
    failedCount++;
    console.error(`[FAIL] ${test.name} - Expected: ${test.expected}, Got: ${result}`);
  }
}

console.log('-------------------------------------------------------------');
console.log(`Total: ${testCases.length} | Passed: ${passedCount} | Failed: ${failedCount}`);

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('ALL ASSERTIONS VERIFIED SUCCESSFULLY.');
  process.exit(0);
}
