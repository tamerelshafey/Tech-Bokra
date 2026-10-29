/**
 * Firebase Security Rules Logic Unit Test Simulator
 * Validates security behavior against all 4 personas:
 *  1. Anonymous Visitor (auth: null)
 *  2. Normal User (authenticated, regular email)
 *  3. Unverified Admin (admin email, email_verified: false)
 *  4. Verified Admin (admin email, email_verified: true)
 */

interface MockAuth {
  uid?: string;
  email?: string;
  email_verified?: boolean;
}

interface MockResource {
  data?: Record<string, any>;
  size?: number;
  contentType?: string;
}

interface RequestContext {
  auth: MockAuth | null;
  resource?: MockResource;
}

const ADMIN_WHITELIST = ['tam.elshafey@gmail.com', 'admin@tech-bokra.com'];

// Rule: isVerifiedAdmin
function isVerifiedAdmin(ctx: RequestContext): boolean {
  return Boolean(
    ctx.auth &&
    ctx.auth.email_verified === true &&
    ctx.auth.email &&
    ADMIN_WHITELIST.includes(ctx.auth.email.toLowerCase())
  );
}

// Rule: settings/general
function canReadSettingsGeneral(): boolean {
  return true; // Public read
}

function canWriteSettingsGeneral(ctx: RequestContext): boolean {
  return isVerifiedAdmin(ctx);
}

// Rule: settings/admin_vault
function canReadAdminVault(ctx: RequestContext): boolean {
  return isVerifiedAdmin(ctx);
}

function canWriteAdminVault(ctx: RequestContext): boolean {
  return isVerifiedAdmin(ctx);
}

// Rule: inquiries/{inquiryId}
function canCreateInquiry(ctx: RequestContext, data: Record<string, any>): boolean {
  const keys = Object.keys(data);
  const required = ['clientName', 'phone', 'status', 'createdAt', 'source'];
  const hasAllRequired = required.every((k) => keys.includes(k));
  const allowed = [
    'id', 'clientName', 'phone', 'email', 'facilityType', 
    'selectedSystems', 'notes', 'source', 'status', 'createdAt'
  ];
  const hasOnlyAllowed = keys.every((k) => allowed.includes(k));

  if (!hasAllRequired || !hasOnlyAllowed) return false;
  if (typeof data.clientName !== 'string' || data.clientName.length < 2 || data.clientName.length > 100) return false;
  if (typeof data.phone !== 'string' || data.phone.length < 6 || data.phone.length > 32) return false;
  if (data.status !== 'new') return false;
  if (!['contact_form', 'estimator', 'custom_quote'].includes(data.source)) return false;
  if (typeof data.createdAt !== 'string' || data.createdAt.length > 64) return false;

  if (data.email && (typeof data.email !== 'string' || data.email.length > 100)) return false;
  if (data.notes && (typeof data.notes !== 'string' || data.notes.length > 2000)) return false;

  return true;
}

function canReadInquiries(ctx: RequestContext): boolean {
  return isVerifiedAdmin(ctx);
}

function canUpdateInquiries(ctx: RequestContext): boolean {
  return isVerifiedAdmin(ctx);
}

function canDeleteInquiries(ctx: RequestContext): boolean {
  return isVerifiedAdmin(ctx);
}

// Rule: Storage /uploads/{fileName}
function canReadStorageUpload(): boolean {
  return true;
}

function canWriteStorageUpload(ctx: RequestContext, file: { size: number; contentType: string }): boolean {
  if (!isVerifiedAdmin(ctx)) return false;
  if (!file || typeof file.size !== 'number' || file.size >= 5242880) return false;
  if (!file.contentType || !file.contentType.startsWith('image/')) return false;
  return true;
}

// ================= TEST SUITE =================
let passed = 0;
let total = 0;

function assert(description: string, condition: boolean) {
  total += 1;
  if (condition) {
    passed += 1;
    console.log(`  ✓ [PASS] ${description}`);
  } else {
    console.error(`  ✗ [FAIL] ${description}`);
  }
}

console.log('====================================================');
console.log('Firebase Security Rules Scenario Unit Tests');
console.log('====================================================\n');

// 1. Anonymous Visitor
console.log('--- SCENARIO 1: Anonymous Visitor (Unauthenticated) ---');
const anonCtx: RequestContext = { auth: null };
assert('Can read settings/general', canReadSettingsGeneral() === true);
assert('Cannot write to settings/general', canWriteSettingsGeneral(anonCtx) === false);
assert('Cannot read settings/admin_vault', canReadAdminVault(anonCtx) === false);
assert('Cannot write settings/admin_vault', canWriteAdminVault(anonCtx) === false);
assert('Cannot list or read customer inquiries', canReadInquiries(anonCtx) === false);
assert('Cannot update customer inquiries', canUpdateInquiries(anonCtx) === false);
assert('Cannot delete customer inquiries', canDeleteInquiries(anonCtx) === false);

const validInquiry = {
  clientName: 'شركة النيل للوجستيات',
  phone: '01012345678',
  source: 'contact_form',
  status: 'new',
  createdAt: new Date().toISOString(),
  notes: 'طلب معاينة شبكات وكاميرات',
};
assert('Can create a valid customer inquiry', canCreateInquiry(anonCtx, validInquiry) === true);

const invalidInquiryExtraKey = {
  ...validInquiry,
  hackerPayload: 'malicious_injection',
};
assert('Cannot create inquiry with unexpected fields', canCreateInquiry(anonCtx, invalidInquiryExtraKey) === false);

const invalidInquiryBadStatus = {
  ...validInquiry,
  status: 'contracted',
};
assert('Cannot forge initial status other than "new"', canCreateInquiry(anonCtx, invalidInquiryBadStatus) === false);

assert('Can read storage /uploads (public assets)', canReadStorageUpload() === true);
assert('Cannot upload files to storage', canWriteStorageUpload(anonCtx, { size: 1024, contentType: 'image/png' }) === false);

// 2. Normal Authenticated User (Regular Customer / Random Account)
console.log('\n--- SCENARIO 2: Regular Authenticated User ---');
const userCtx: RequestContext = {
  auth: { uid: 'user_regular_123', email: 'client@example.com', email_verified: true },
};
assert('Can read settings/general', canReadSettingsGeneral() === true);
assert('Cannot write to settings/general', canWriteSettingsGeneral(userCtx) === false);
assert('Cannot read settings/admin_vault', canReadAdminVault(userCtx) === false);
assert('Cannot write to settings/admin_vault', canWriteAdminVault(userCtx) === false);
assert('Cannot read inquiries collection', canReadInquiries(userCtx) === false);
assert('Cannot upload to storage', canWriteStorageUpload(userCtx, { size: 2048, contentType: 'image/jpeg' }) === false);

// 3. Unverified Admin Email (Admin email but email_verified == false)
console.log('\n--- SCENARIO 3: Admin Email without Verification ---');
const unverifiedAdminCtx: RequestContext = {
  auth: { uid: 'admin_unverified', email: 'tam.elshafey@gmail.com', email_verified: false },
};
assert('Cannot write to settings/general with unverified email', canWriteSettingsGeneral(unverifiedAdminCtx) === false);
assert('Cannot read settings/admin_vault with unverified email', canReadAdminVault(unverifiedAdminCtx) === false);
assert('Cannot write to settings/admin_vault with unverified email', canWriteAdminVault(unverifiedAdminCtx) === false);
assert('Cannot read inquiries collection with unverified email', canReadInquiries(unverifiedAdminCtx) === false);
assert('Cannot upload to storage with unverified email', canWriteStorageUpload(unverifiedAdminCtx, { size: 1024, contentType: 'image/png' }) === false);

// 4. Verified Admin
console.log('\n--- SCENARIO 4: Verified Administrator ---');
const verifiedAdminCtx: RequestContext = {
  auth: { uid: 'admin_super_1', email: 'tam.elshafey@gmail.com', email_verified: true },
};
assert('Can read settings/general', canReadSettingsGeneral() === true);
assert('Can write to settings/general', canWriteSettingsGeneral(verifiedAdminCtx) === true);
assert('Can read settings/admin_vault', canReadAdminVault(verifiedAdminCtx) === true);
assert('Can write to settings/admin_vault', canWriteAdminVault(verifiedAdminCtx) === true);
assert('Can read inquiries collection', canReadInquiries(verifiedAdminCtx) === true);
assert('Can update inquiry status', canUpdateInquiries(verifiedAdminCtx) === true);
assert('Can delete inquiry', canDeleteInquiries(verifiedAdminCtx) === true);
assert('Can upload valid image < 5MB (image/webp)', canWriteStorageUpload(verifiedAdminCtx, { size: 4000000, contentType: 'image/webp' }) === true);
assert('Cannot upload non-image file (.exe / text/html)', canWriteStorageUpload(verifiedAdminCtx, { size: 1024, contentType: 'application/x-msdownload' }) === false);
assert('Cannot upload image exceeding 5MB', canWriteStorageUpload(verifiedAdminCtx, { size: 6000000, contentType: 'image/png' }) === false);

console.log('\n====================================================');
console.log(`Results: ${passed} / ${total} tests passed successfully.`);
console.log('====================================================');

if (passed !== total) {
  process.exit(1);
}
