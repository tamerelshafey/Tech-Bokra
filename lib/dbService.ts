import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType, User } from '@/lib/firebase';
import { EditableConfig, defaultEditableConfig } from '@/lib/siteConfig';

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
const INQUIRIES_COLLECTION_PATH = 'inquiries';

/**
 * Save Site Settings to Firestore (Requires Admin login)
 */
export async function saveSiteSettingsToCloud(config: EditableConfig, user?: User | null): Promise<void> {
  const settingsDocRef = doc(db, 'settings', 'general');
  try {
    await setDoc(settingsDocRef, {
      ...config,
      updatedAt: new Date().toISOString(),
      updatedBy: user?.email || auth?.currentUser?.email || 'admin@tech-bokra.com',
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, SETTINGS_DOC_PATH);
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
        const data = docSnap.data();
        
        // Defensive check: if cloud doc has old/stale services (< 6 items), preserve new 6 services
        const resolvedServicesList = (Array.isArray(data.servicesList) && data.servicesList.length >= 6)
          ? data.servicesList
          : defaultEditableConfig.servicesList;

        // Defensive check: if cloud doc has old hero sub, preserve new hero sub
        const resolvedHeroSubAr = (data.heroSubAr && data.heroSubAr.includes('UTP'))
          ? data.heroSubAr
          : defaultEditableConfig.heroSubAr;

        onUpdate({
          ...defaultEditableConfig,
          ...data,
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
