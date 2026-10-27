import { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const BOOTSTRAP_ADMIN_EMAIL = 'tam.elshafey@gmail.com';
const ADMIN_ROSTER_STORAGE_KEY = 'tech_bokra_admin_team_v1';

export type AdminRole = 'super_admin' | 'admin' | 'editor';

export interface AdminAccount {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  status: 'active' | 'inactive';
  phone?: string;
  department?: string;
  createdAt: string;
  lastActive?: string;
}

export interface AdminVerificationResult {
  isAdmin: boolean;
  isVerified: boolean;
  email: string | null;
  role: 'super_admin' | 'admin' | 'editor' | 'none';
  name?: string;
  reason?: string;
}

export const DEFAULT_ADMIN_ROSTER: AdminAccount[] = [
  {
    id: 'primary-super-admin',
    email: BOOTSTRAP_ADMIN_EMAIL,
    name: 'تامر الشافعي (المالك والمؤسس)',
    role: 'super_admin',
    status: 'active',
    department: 'الإدارة التنفيذية والهندسية العليا',
    createdAt: '2026-01-01T00:00:00Z',
  },
];

/**
 * Loads the authorized admin team from Firestore settings/admin_roster
 * with localStorage fallback.
 */
export async function getAdminRoster(): Promise<AdminAccount[]> {
  try {
    const rosterRef = doc(db, 'settings', 'admin_roster');
    const snap = await getDoc(rosterRef);
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data?.admins) && data.admins.length > 0) {
        // Guarantee bootstrap admin is present
        const hasBootstrap = data.admins.some(
          (a: AdminAccount) => (a.email || '').trim().toLowerCase() === BOOTSTRAP_ADMIN_EMAIL
        );
        const merged = hasBootstrap ? data.admins : [...DEFAULT_ADMIN_ROSTER, ...data.admins];
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(ADMIN_ROSTER_STORAGE_KEY, JSON.stringify(merged));
          } catch {}
        }
        return merged;
      }
    }
  } catch (err) {
    console.warn('Could not read admin_roster from Firestore, checking localStorage:', err);
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(ADMIN_ROSTER_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
  }

  return DEFAULT_ADMIN_ROSTER;
}

/**
 * Saves the admin roster to Firestore settings/admin_roster and local storage.
 */
export async function saveAdminRoster(admins: AdminAccount[]): Promise<boolean> {
  // Always enforce presence of primary bootstrap super admin
  const ensuredAdmins = admins.some((a) => a.email.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL)
    ? admins
    : [...DEFAULT_ADMIN_ROSTER, ...admins];

  const allowedEmails = ensuredAdmins
    .filter((a) => a.status === 'active')
    .map((a) => a.email.trim().toLowerCase());

  // Save to localStorage immediately
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ADMIN_ROSTER_STORAGE_KEY, JSON.stringify(ensuredAdmins));
    } catch {}
  }

  // Save to Firestore settings/admin_roster
  try {
    const rosterRef = doc(db, 'settings', 'admin_roster');
    await setDoc(rosterRef, {
      admins: ensuredAdmins,
      allowedEmails,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    // Also sync individual documents in /admins collection
    for (const admin of ensuredAdmins) {
      try {
        const safeId = admin.id || admin.email.replace(/[^a-zA-Z0-9_-]/g, '_');
        const adminDocRef = doc(db, 'admins', safeId);
        await setDoc(adminDocRef, {
          email: admin.email.trim().toLowerCase(),
          name: admin.name,
          role: admin.role,
          status: admin.status,
          department: admin.department || '',
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (docErr) {
        console.warn('Error saving individual admin doc:', docErr);
      }
    }

    return true;
  } catch (err) {
    console.warn('Failed to save admin roster to Firestore:', err);
    return false;
  }
}

/**
 * Authoritatively verify whether a Firebase user has administrative privileges.
 * Enforces email verification and checks against bootstrap admin, Firestore /admins/{uid},
 * /admins/{sanitizedEmail}, and /settings/admin_roster.
 */
export async function verifyAdminStatus(user: User | null): Promise<AdminVerificationResult> {
  if (!user || !user.email) {
    return {
      isAdmin: false,
      isVerified: false,
      email: null,
      role: 'none',
      reason: 'No authenticated user session found.',
    };
  }

  const userEmail = user.email.trim().toLowerCase();
  const isVerified = Boolean(user.emailVerified);

  // Check 1: Primary Bootstrapped Super Admin
  if (userEmail === BOOTSTRAP_ADMIN_EMAIL) {
    if (!isVerified) {
      return {
        isAdmin: false,
        isVerified: false,
        email: userEmail,
        role: 'super_admin',
        reason: 'Email is not verified. Please verify your email before accessing the portal.',
      };
    }
    return {
      isAdmin: true,
      isVerified: true,
      email: userEmail,
      role: 'super_admin',
      name: 'تامر الشافعي',
    };
  }

  // Check 2: Check Firestore /settings/admin_roster
  try {
    const rosterRef = doc(db, 'settings', 'admin_roster');
    const rosterSnap = await getDoc(rosterRef);
    if (rosterSnap.exists()) {
      const rosterData = rosterSnap.data();
      const list: AdminAccount[] = rosterData?.admins || [];
      const found = list.find((a) => (a.email || '').trim().toLowerCase() === userEmail);
      if (found) {
        if (found.status !== 'active') {
          return {
            isAdmin: false,
            isVerified,
            email: userEmail,
            role: 'none',
            reason: 'This administrator account has been deactivated by the Super Admin.',
          };
        }
        if (!isVerified) {
          return {
            isAdmin: false,
            isVerified: false,
            email: userEmail,
            role: found.role,
            reason: 'Email must be verified to activate administrator privileges.',
          };
        }
        return {
          isAdmin: true,
          isVerified: true,
          email: userEmail,
          role: found.role,
          name: found.name,
        };
      }
    }
  } catch (rosterErr) {
    console.warn('Roster check note:', rosterErr);
  }

  // Check 3: Check Firestore RBAC document /admins/{uid} or /admins/{sanitizedEmail}
  try {
    const adminDocRef = doc(db, 'admins', user.uid);
    let snap = await getDoc(adminDocRef);

    if (!snap.exists()) {
      const safeId = userEmail.replace(/[^a-zA-Z0-9_-]/g, '_');
      const emailDocRef = doc(db, 'admins', safeId);
      snap = await getDoc(emailDocRef);
    }

    if (snap.exists()) {
      const data = snap.data();
      const docEmail = (data?.email || '').trim().toLowerCase();
      const docRole = data?.role;

      if (docEmail && docEmail !== userEmail) {
        return {
          isAdmin: false,
          isVerified,
          email: userEmail,
          role: 'none',
          reason: 'Administrator record email mismatch.',
        };
      }

      if (data?.status === 'inactive') {
        return {
          isAdmin: false,
          isVerified,
          email: userEmail,
          role: 'none',
          reason: 'This account has been deactivated.',
        };
      }

      if (docRole !== 'super_admin' && docRole !== 'admin' && docRole !== 'editor') {
        return {
          isAdmin: false,
          isVerified,
          email: userEmail,
          role: 'none',
          reason: 'Account role is not authorized for administration.',
        };
      }

      if (!isVerified) {
        return {
          isAdmin: false,
          isVerified: false,
          email: userEmail,
          role: docRole,
          reason: 'Email must be verified to activate administrator privileges.',
        };
      }

      return {
        isAdmin: true,
        isVerified: true,
        email: userEmail,
        role: docRole,
        name: data?.name,
      };
    }
  } catch (err) {
    console.warn('Admins RBAC check note:', err);
  }

  // Check 4: Local Storage roster fallback
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(ADMIN_ROSTER_STORAGE_KEY);
      if (raw) {
        const list: AdminAccount[] = JSON.parse(raw);
        const found = list.find((a) => (a.email || '').trim().toLowerCase() === userEmail && a.status === 'active');
        if (found && isVerified) {
          return {
            isAdmin: true,
            isVerified: true,
            email: userEmail,
            role: found.role,
            name: found.name,
          };
        }
      }
    } catch {}
  }

  return {
    isAdmin: false,
    isVerified,
    email: userEmail,
    role: 'none',
    reason: 'This account does not have administrator privileges.',
  };
}
