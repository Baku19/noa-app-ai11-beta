// ═══════════════════════════════════════════════════════════════
// FILE: lib/AuthContext.jsx
// PURPOSE: Firebase Auth + Read-only client state (Beta hardened)
// VERSION: 4.1 – Beta Safe (no client writes)
// ═══════════════════════════════════════════════════════════════

import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

import { auth, db, functions } from '../config/firebase.js';
import {
  DEMO_ACCOUNTS,
  DEMO_FAMILY,
  DEMO_SCHOLARS
} from './demoData.js';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [family, setFamily] = useState(null);
  const [scholars, setScholars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  const isDemoAccount = (email) => email === DEMO_ACCOUNTS.parentEmail;

  // ─────────────────────────────────────────────
  // Demo loader (unchanged)
  // ─────────────────────────────────────────────
  const loadDemoData = () => {
    setIsDemo(true);
    setUserProfile({
      uid: 'demo-parent-001',
      email: DEMO_ACCOUNTS.parentEmail,
      displayName: 'Demo Parent',
      familyId: DEMO_FAMILY.id,
      role: 'PRIMARY_PARENT',
      firstVisitComplete: true
    });
    setFamily(DEMO_FAMILY);
    setScholars(DEMO_SCHOLARS);
  };

  // ─────────────────────────────────────────────
  // Load real user data (READ-ONLY)
  // ─────────────────────────────────────────────
  const loadUserData = async (firebaseUser) => {
    if (isDemoAccount(firebaseUser.email)) {
      loadDemoData();
      return;
    }

    setIsDemo(false);

    const userSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userSnap.exists()) return;

    const profile = userSnap.data();
    setUserProfile(profile);

    if (profile.familyId) {
      const familySnap = await getDoc(doc(db, 'families', profile.familyId));
      if (familySnap.exists()) setFamily(familySnap.data());

      const scholarsSnap = await getDocs(
        collection(db, 'families', profile.familyId, 'scholars')
      );
      setScholars(scholarsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
  };

  const refreshScholars = async () => {
    if (isDemo || !user || !userProfile?.familyId) return;
    try {
      const scholarsSnap = await getDocs(
        collection(db, 'families', userProfile.familyId, 'scholars')
      );
      setScholars(scholarsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error refreshing scholars:", error);
    }
  };

  // ─────────────────────────────────────────────
  // Auth state listener
  // ─────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await loadUserData(firebaseUser);
      } else {
        setUser(null);
        setUserProfile(null);
        setFamily(null);
        setScholars([]);
        setIsDemo(false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // ─────────────────────────────────────────────
  // EMAIL SIGNUP (SERVER-AUTHORITATIVE)
  // ─────────────────────────────────────────────
  const signup = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      const createFamily = httpsCallable(functions, 'createFamilyAndParent');
      await createFamily({
        parentProfile: {
          displayName: displayName || email.split('@')[0],
          email
        }
      });

      await result.user.getIdToken(true);
      await loadUserData(result.user);

      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // ─────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await loadUserData(result.user);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // ─────────────────────────────────────────────
  // GOOGLE SIGNUP / LOGIN (FIRST-TIME SAFE)
  // ─────────────────────────────────────────────
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const userSnap = await getDoc(doc(db, 'users', result.user.uid));
      if (!userSnap.exists()) {
        const createFamily = httpsCallable(functions, 'createFamilyAndParent');
        await createFamily({
          parentProfile: {
            displayName: result.user.displayName,
            email: result.user.email
          }
        });
        await result.user.getIdToken(true);
      }

      await loadUserData(result.user);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // ─────────────────────────────────────────────
  // LOGOUT
  // ─────────────────────────────────────────────
  const logout = async () => {
    await signOut(auth);
  };
  
  // ─────────────────────────────────────────────
  // UPDATE FAMILY PLAN
  // ─────────────────────────────────────────────
  const updateFamilyPlan = async (plan, billingCycle) => {
    if (isDemo || !user || !userProfile?.familyId) return { success: true };

    try {
      const updatePlanFunc = httpsCallable(functions, 'setFamilyPlan');
      await updatePlanFunc({ plan, billingCycle });

      // Refresh family data to reflect changes
      const familySnap = await getDoc(doc(db, 'families', userProfile.familyId));
      if (familySnap.exists()) {
        setFamily(familySnap.data());
      }
      return { success: true };
    } catch (error) {
      console.error("Error updating family plan:", error);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        family,
        scholars,
        loading,
        isDemo,
        signup,
        login,
        loginWithGoogle,
        logout,
        updateFamilyPlan,
        refreshScholars,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};