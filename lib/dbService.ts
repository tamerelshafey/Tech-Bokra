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
  if (Array.isArray(mediaVault)) {
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

    // Step 1: Read existing admin_vault to check if already present
    const existingVaultSnap = await getDoc(adminVaultDocRef);
    let targetVaultItems: MediaVaultItem[] = [];

    if (existingVaultSnap.exists() && Array.isArray(existingVaultSnap.data()?.mediaVault) && existingVaultSnap.data()?.mediaVault.length > 0) {
      targetVaultItems = existingVaultSnap.data()?.mediaVault;
    } else if (Array.isArray(legacyMediaVault)) {
      targetVaultItems = legacyMediaVault;
    }

    // Step 2: Securely persist to settings/admin_vault FIRST
    await setDoc(adminVaultDocRef, {
      mediaVault: targetVaultItems,
      updatedAt: new Date().toISOString(),
      updatedBy: user?.email || legacyUpdatedBy || 'admin@tech-bokra.com',
    });

    // Step 3: Strictly VERIFY that settings/admin_vault was persisted successfully
    const verifySnap = await getDoc(adminVaultDocRef);
    if (!verifySnap.exists() || !Array.isArray(verifySnap.data()?.mediaVault)) {
      throw new Error('Verification failed: settings/admin_vault was not confirmed. Aborting deletion.');
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
