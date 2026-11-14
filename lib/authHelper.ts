import { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const BOOTSTRAP_ADMIN_EMAIL = '';
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

export const DEFAULT_ADMIN_ROSTER: AdminAccount[] = [];

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
      reason: 'لا توجد جلسة مصادقة نشطة في المتصفح (يرجى تسجيل الدخول).',
    };
  }

  const userEmail = user.email.trim().toLowerCase();
  const isVerified = Boolean(user.emailVerified);

  if (!isVerified) {
    return {
      isAdmin: false,
      isVerified: false,
      email: userEmail,
      role: 'none',
      reason: `البريد الإلكتروني (${userEmail}) غير مُحقَّق (email_verified=false). يرجى تأكيد بريدك الإلكتروني أولاً.`,
    };
  }

  // Authoritative verification via server /api/admin/auth (establishes httpOnly tb_admin_session cookie)
  try {
    const idToken = await user.getIdToken(true);
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
      credentials: 'include',
    });

    if (res.ok) {
      const authData = await res.json().catch(() => ({}));
      return {
        isAdmin: true,
        isVerified: true,
        email: userEmail,
        role: authData?.user?.role || 'admin',
        name: user.displayName || userEmail.split('@')[0],
      };
    }

    const errData = await res.json().catch(() => ({}));
    return {
      isAdmin: false,
      isVerified,
      email: userEmail,
      role: 'none',
      reason:
        errData?.error ||
        `رفض الخادم التحقق من الصلاحيات للبريد (${userEmail}) — رمز الحالة HTTP ${res.status}.`,
    };
  } catch (netErr: any) {
    console.error('Server auth verification error:', netErr);
    return {
      isAdmin: false,
      isVerified,
      email: userEmail,
      role: 'none',
      reason: `تعذر الاتصال بخادم المصادقة (/api/admin/auth): ${netErr?.message || 'Network Error'}. تحقق من تشغيل الخادم واتصال الشبكة.`,
    };
  }
}
