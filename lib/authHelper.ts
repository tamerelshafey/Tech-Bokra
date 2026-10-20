import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const BOOTSTRAP_ADMIN_EMAIL = 'tam.elshafey@gmail.com';

export interface AdminVerificationResult {
  isAdmin: boolean;
  isVerified: boolean;
  email: string | null;
  role: 'super_admin' | 'admin' | 'none';
  reason?: string;
}

/**
 * Authoritatively verify whether a Firebase user has administrative privileges.
 * Enforces email verification and checks against bootstrap admin and Firestore /admins/{uid}.
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
    };
  }

  // Check 2: Firestore RBAC document /admins/{uid}
  try {
    const adminDocRef = doc(db, 'admins', user.uid);
    const snap = await getDoc(adminDocRef);
    if (snap.exists()) {
      const data = snap.data();
      const docEmail = (data?.email || '').trim().toLowerCase();
      const docRole = data?.role;

      // Verify that document email matches authenticated user email
      if (docEmail && docEmail !== userEmail) {
        return {
          isAdmin: false,
          isVerified,
          email: userEmail,
          role: 'none',
          reason: 'Administrator record email mismatch.',
        };
      }

      // Check role validity
      if (docRole !== 'super_admin' && docRole !== 'admin') {
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
      };
    }
  } catch (err) {
    console.warn('Admins RBAC check note:', err);
  }

  return {
    isAdmin: false,
    isVerified,
    email: userEmail,
    role: 'none',
    reason: 'This account does not have administrator privileges.',
  };
}
