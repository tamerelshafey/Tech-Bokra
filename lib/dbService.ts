import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  deleteField,
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType, User } from '@/lib/firebase';
import { EditableConfig, defaultEditableConfig, MediaVaultItem } from '@/lib/siteConfig';

export interface FirestoreInquiry {
  id: string;
  clientName: string;
  phone: string;
  email?: string;
  facilityType?: string;
  selectedSystems?: string[];
  notes?: string;
  source: 'contact_form' | 'estimator' | 'custom_quote';
  status: 'new' | 'contacted' | 'survey_scheduled' | 'contracted' | 'archived';
  createdAt: string;
  updatedAt?: string;
}

const SETTINGS_DOC_PATH = 'settings/general';
const ADMIN_VAULT_DOC_PATH = 'settings/admin_vault';
const INQUIRIES_COLLECTION_PATH = 'inquiries';

/**
 * Save Site Settings to Firestore (Requires Admin login)
 * Explicitly separates public presentation config (settings/general)
 * from internal administrative vault and audit info (settings/admin_vault).
 * Guaranteed resilience: Failure to save vault does NOT block general settings,
 * and media is NEVER deleted if saving vault fails.
 */
export async function saveSiteSettingsToCloud(
  config: EditableConfig, 
  user?: User | null
): Promise<{ generalSaved: boolean; vaultSaved: boolean }> {
  const settingsDocRef = doc(db, 'settings', 'general');
  const adminVaultDocRef = doc(db, 'settings', 'admin_vault');

  const { mediaVault, ...publicConfig } = config;

  let vaultSaved = false;
  let generalSaved = false;

  // Step 1: Save admin vault FIRST, so mediaVault is secured before general settings
  if (Array.isArray(mediaVault) && mediaVault.length > 0) {
    try {
      await setDoc(adminVaultDocRef, {
        mediaVault,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email || auth?.currentUser?.email || 'admin@tech-bokra.com',
      });
      vaultSaved = true;
    } catch (vaultError) {
      console.warn('Failed to save settings/admin_vault:', vaultError);
      // Resilience: Do NOT abort general settings save
    }
  } else if (Array.isArray(mediaVault) && mediaVault.length === 0) {
    // PROTECTIVE GUARD: If mediaVault is passed as empty array, check if cloud already has items
    // to prevent accidental wipe caused by failed or uninitialized vault load
    try {
      const currentVaultSnap = await getDoc(adminVaultDocRef);
      if (currentVaultSnap.exists() && Array.isArray(currentVaultSnap.data()?.mediaVault) && currentVaultSnap.data()?.mediaVault.length > 0) {
        console.warn('Protective guard: preserving existing cloud admin_vault; avoided wiping with empty uninitialized array.');
        vaultSaved = true; // existing vault is kept intact
      } else {
        await setDoc(adminVaultDocRef, {
          mediaVault: [],
          updatedAt: new Date().toISOString(),
          updatedBy: user?.email || auth?.currentUser?.email || 'admin@tech-bokra.com',
        });
        vaultSaved = true;
      }
    } catch (err) {
      console.warn('Vault safety check notice:', err);
    }
  }

  // Step 2: Save public general settings
  try {
    const generalPayload: Record<string, any> = {
      ...publicConfig,
      updatedAt: new Date().toISOString(),
    };

    // If vault was successfully written, safely purge legacy fields from settings/general
    if (vaultSaved) {
      generalPayload.mediaVault = deleteField();
      generalPayload.updatedBy = deleteField();
    }

    await setDoc(settingsDocRef, generalPayload, { merge: true });
    generalSaved = true;
  } catch (generalError) {
    handleFirestoreError(generalError, OperationType.WRITE, SETTINGS_DOC_PATH);
  }

  return { generalSaved, vaultSaved };
}

/**
 * Safe Migration: Extracts mediaVault & updatedBy from settings/general,
 * backs them up to settings/admin_vault, verifies the backup,
 * and only then removes the legacy fields from settings/general using deleteField().
 * Never deletes any data without confirmed persistence.
 */
export async function migrateSettingsAndVaultSafely(user?: User | null): Promise<{
  success: boolean;
  migrated: boolean;
  itemCount: number;
  message: string;
}> {
  const settingsDocRef = doc(db, 'settings', 'general');
  const adminVaultDocRef = doc(db, 'settings', 'admin_vault');

  try {
    const generalSnap = await getDoc(settingsDocRef);
    if (!generalSnap.exists()) {
      return { success: true, migrated: false, itemCount: 0, message: 'settings/general document does not exist yet.' };
    }

    const generalData = generalSnap.data() as Record<string, any>;
    const legacyMediaVault = generalData.mediaVault;
    const legacyUpdatedBy = generalData.updatedBy;

    const hasLegacyData = Array.isArray(legacyMediaVault) || legacyUpdatedBy !== undefined;
    if (!hasLegacyData) {
      return { success: true, migrated: false, itemCount: 0, message: 'settings/general is already clean; no legacy fields found.' };
    }

    // Step 1: Read existing admin_vault and perform a union merge by item ID
    // Guarantees zero data loss if mediaVault exists in one or both documents
    const existingVaultSnap = await getDoc(adminVaultDocRef);
    const vaultMap = new Map<string, MediaVaultItem>();

    // 1a. Seed with legacy items from general settings
    if (Array.isArray(legacyMediaVault)) {
      legacyMediaVault.forEach((item) => {
        if (item && item.id) {
          vaultMap.set(item.id, item);
        }
      });
    }

    // 1b. Layer with items in admin_vault (newer overrides older if matching id)
    if (existingVaultSnap.exists() && Array.isArray(existingVaultSnap.data()?.mediaVault)) {
      existingVaultSnap.data()?.mediaVault.forEach((item: MediaVaultItem) => {
        if (item && item.id) {
          vaultMap.set(item.id, item);
        }
      });
    }

    const targetVaultItems: MediaVaultItem[] = Array.from(vaultMap.values());

    // Step 2: Securely persist to settings/admin_vault FIRST
    await setDoc(adminVaultDocRef, {
      mediaVault: targetVaultItems,
      updatedAt: new Date().toISOString(),
      updatedBy: user?.email || legacyUpdatedBy || 'admin@tech-bokra.com',
    });

    // Step 3: Strictly VERIFY that settings/admin_vault was persisted successfully
    // Does NOT just count items; verifies exact ID matching and non-empty URLs
    const verifySnap = await getDoc(adminVaultDocRef);
    if (!verifySnap.exists()) {
      throw new Error('Verification failed: settings/admin_vault was not created. Aborting deletion.');
    }
    const persistedItems = verifySnap.data()?.mediaVault;
    if (!Array.isArray(persistedItems) || persistedItems.length !== targetVaultItems.length) {
      throw new Error('Verification failed: mediaVault array length mismatch in admin_vault. Aborting deletion.');
    }
    const persistedIdMap = new Map(persistedItems.map((p) => [p.id, p]));
    const allItemsVerified = targetVaultItems.every((target) => {
      const persisted = persistedIdMap.get(target.id);
      return persisted && persisted.url;
    });
    if (!allItemsVerified) {
      throw new Error('Verification failed: asset ID or payload integrity mismatch in admin_vault. Aborting deletion.');
    }

    // Step 4: ONLY AFTER verified persistence, safely delete legacy fields from settings/general
    await updateDoc(settingsDocRef, {
      mediaVault: deleteField(),
      updatedBy: deleteField(),
    });

    return {
      success: true,
      migrated: true,
      itemCount: targetVaultItems.length,
      message: `Successfully migrated ${targetVaultItems.length} media vault assets to settings/admin_vault and purged legacy fields from settings/general.`,
    };
  } catch (error: any) {
    console.error('Migration failed:', error);
    return {
      success: false,
      migrated: false,
      itemCount: 0,
      message: error?.message || 'Migration aborted due to error.',
    };
  }
}

/**
 * Creates an authoritative JSON backup snapshot of both settings/general and settings/admin_vault.
 * Allows safe verification and one-click JSON export before running migration.
 */
export async function createSettingsBackup(): Promise<{
  timestamp: string;
  general: Record<string, any> | null;
  adminVault: Record<string, any> | null;
}> {
  const generalSnap = await getDoc(doc(db, 'settings', 'general'));
  const vaultSnap = await getDoc(doc(db, 'settings', 'admin_vault'));
  
  const backup = {
    timestamp: new Date().toISOString(),
    general: generalSnap.exists() ? generalSnap.data() : null,
    adminVault: vaultSnap.exists() ? vaultSnap.data() : null,
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`tech_bokra_pre_migration_backup`, JSON.stringify(backup));
    } catch {
      // Ignore quota error
    }
  }

  return backup;
}

/**
 * Browser helper to download the backup snapshot as a downloadable .json file.
 */
export async function downloadSettingsBackupFile(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const backup = await createSettingsBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tech-bokra-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Backup download error:', err);
    return false;
  }
}

/**
 * Authoritative Restore: Restores settings and admin_vault from an exported JSON backup payload.
 * Validates payload structure before committing to Firestore.
 */
export async function restoreSettingsFromBackup(backupPayload: {
  timestamp?: string;
  general?: Record<string, any> | null;
  adminVault?: Record<string, any> | null;
}): Promise<{
  success: boolean;
  restoredGeneral: boolean;
  restoredVault: boolean;
  message: string;
}> {
  if (!backupPayload || typeof backupPayload !== 'object') {
    return { success: false, restoredGeneral: false, restoredVault: false, message: 'Invalid backup payload format.' };
  }

  let restoredGeneral = false;
  let restoredVault = false;

  try {
    // 1. Restore Admin Vault if present in backup
    if (backupPayload.adminVault && typeof backupPayload.adminVault === 'object') {
      const vaultDocRef = doc(db, 'settings', 'admin_vault');
      const vaultData = backupPayload.adminVault;
      await setDoc(vaultDocRef, {
        mediaVault: Array.isArray(vaultData.mediaVault) ? vaultData.mediaVault : [],
        updatedAt: new Date().toISOString(),
        updatedBy: vaultData.updatedBy || 'admin@tech-bokra.com',
      });
      restoredVault = true;
    }

    // 2. Restore General Settings (sanitizing out any mediaVault or updatedBy)
    if (backupPayload.general && typeof backupPayload.general === 'object') {
      const settingsDocRef = doc(db, 'settings', 'general');
      const { mediaVault, updatedBy, ...safeGeneral } = backupPayload.general;
      await setDoc(settingsDocRef, {
        ...safeGeneral,
        mediaVault: deleteField(),
        updatedBy: deleteField(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      restoredGeneral = true;
    }

    return {
      success: true,
      restoredGeneral,
      restoredVault,
      message: 'Backup restored successfully to Firestore.',
    };
  } catch (error: any) {
    console.error('Restore failed:', error);
    return {
      success: false,
      restoredGeneral,
      restoredVault,
      message: error?.message || 'Restore failed due to an error.',
    };
  }
}

/**
 * Load Admin Vault (mediaVault & internal audit) - Authorized Admin only
 */
export async function loadAdminVault(): Promise<{ mediaVault: MediaVaultItem[]; updatedAt?: string; updatedBy?: string } | null> {
  try {
    const adminVaultRef = doc(db, 'settings', 'admin_vault');
    const snap = await getDoc(adminVaultRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        mediaVault: Array.isArray(data?.mediaVault) ? data.mediaVault : [],
        updatedAt: data?.updatedAt,
        updatedBy: data?.updatedBy,
      };
    }
    return null;
  } catch (error) {
    console.warn('Admin vault load notice:', error);
    return null;
  }
}

/**
 * Subscribe to Realtime Site Settings from Firestore
 */
export function subscribeSiteSettings(onUpdate: (config: EditableConfig) => void): () => void {
  const settingsDocRef = doc(db, 'settings', 'general');
  
  return onSnapshot(
    settingsDocRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const rawData = docSnap.data();
        
        // Explicitly exclude any internal/admin fields from public state
        const { mediaVault, updatedBy, ...safePublicData } = rawData as Record<string, any>;
        
        // Defensive check: if cloud doc has old/stale services (< 6 items), preserve new 6 services
        const resolvedServicesList = (Array.isArray(safePublicData.servicesList) && safePublicData.servicesList.length >= 6)
          ? safePublicData.servicesList
          : defaultEditableConfig.servicesList;

        // Defensive check: if cloud doc has old hero sub, preserve new hero sub
        const resolvedHeroSubAr = (safePublicData.heroSubAr && safePublicData.heroSubAr.includes('UTP'))
          ? safePublicData.heroSubAr
          : defaultEditableConfig.heroSubAr;

        onUpdate({
          ...defaultEditableConfig,
          ...safePublicData,
          servicesList: resolvedServicesList,
          heroSubAr: resolvedHeroSubAr,
        });
      }
    },
    (error) => {
      // Non-fatal fallback: local settings remain active if offline or permission denied
      console.warn('Settings subscription sync warning:', error.message);
    }
  );
}

/**
 * Submit a customer inquiry / survey lead to Firestore
 */
export async function submitInquiry(inquiryData: {
  clientName: string;
  phone: string;
  email?: string;
  facilityType?: string;
  selectedSystems?: string[];
  notes?: string;
  source: 'contact_form' | 'estimator' | 'custom_quote';
}): Promise<string> {
  const clientName = (inquiryData.clientName || '').trim().slice(0, 100);
  const phone = (inquiryData.phone || '').trim().slice(0, 32);

  if (clientName.length < 2) {
    throw new Error('Client name must be at least 2 characters.');
  }
  if (phone.length < 6) {
    throw new Error('Phone number must be at least 6 digits.');
  }

  const cleanId = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const inquiryRef = doc(db, INQUIRIES_COLLECTION_PATH, cleanId);

  const payload: Record<string, unknown> = {
    clientName,
    phone,
    source: inquiryData.source,
    status: 'new' as const,
    createdAt: new Date().toISOString(),
  };

  if (inquiryData.email && inquiryData.email.trim()) {
    payload.email = inquiryData.email.trim().slice(0, 100);
  }
  if (inquiryData.facilityType && inquiryData.facilityType.trim()) {
    payload.facilityType = inquiryData.facilityType.trim().slice(0, 60);
  }
  if (inquiryData.notes && inquiryData.notes.trim()) {
    payload.notes = inquiryData.notes.trim().slice(0, 2000);
  }
  if (Array.isArray(inquiryData.selectedSystems) && inquiryData.selectedSystems.length > 0) {
    payload.selectedSystems = inquiryData.selectedSystems.slice(0, 10);
  }

  try {
    await setDoc(inquiryRef, payload);
    return cleanId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `inquiries/${cleanId}`);
    return cleanId;
  }
}

/**
 * Subscribe to real-time customer leads (Admin only)
 * Defensively verifies that Firebase Auth has an active session before opening the listener.
 */
export function subscribeInquiries(
  onUpdate: (inquiries: FirestoreInquiry[]) => void,
  onError?: (err: Error) => void
): () => void {
  if (!auth.currentUser) {
    const unauthErr = new Error('Permission denied: User must be authenticated to subscribe to inquiries.');
    if (onError) {
      onError(unauthErr);
    } else {
      console.warn('subscribeInquiries: Blocked unauthenticated attempt to open listener.');
    }
    return () => {};
  }

  const inquiriesRef = collection(db, INQUIRIES_COLLECTION_PATH);

  return onSnapshot(
    inquiriesRef,
    (snapshot) => {
      const results: FirestoreInquiry[] = [];
      snapshot.forEach((docSnap) => {
        results.push({
          id: docSnap.id,
          ...(docSnap.data() as Omit<FirestoreInquiry, 'id'>),
        });
      });
      // Sort newest first
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(results);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        console.warn('Inquiries listener error:', error.message);
      }
    }
  );
}

/**
 * Update Inquiry Status (Admin only)
 */
export async function updateInquiryStatus(
  inquiryId: string, 
  status: FirestoreInquiry['status']
): Promise<void> {
  const ref = doc(db, INQUIRIES_COLLECTION_PATH, inquiryId);
  try {
    await updateDoc(ref, {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `inquiries/${inquiryId}`);
  }
}

/**
 * Delete Inquiry (Admin only)
 */
export async function deleteInquiry(inquiryId: string): Promise<void> {
  const ref = doc(db, INQUIRIES_COLLECTION_PATH, inquiryId);
  try {
    await deleteDoc(ref);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `inquiries/${inquiryId}`);
  }
}
