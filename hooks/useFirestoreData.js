// ═══════════════════════════════════════════════════════════════
// FILE: hooks/useFirestoreData.js
// PURPOSE: Firestore data hooks for real users (demo uses lib/demoData.js)
// BATCH: 4C - Fixed imports to match lib/demoData.js exports
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot 
} from 'firebase/firestore';

// Import from existing lib/demoData.js
import {
  DEMO_ACCOUNTS,
  DEMO_FAMILY,
  DEMO_SCHOLARS,
  DEMO_SUBSCRIPTION,
  getDemoStatsForScholar,
  getDemoSessionsForScholar,
  getDemoTopicsForScholar,
  getDemoConfidenceForScholar,
  isDemoAccount
} from '../lib/demoData.js';

// ═══════════════════════════════════════════════════════════════
// FIREBASE CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const firebaseConfig = {
  apiKey: "AIzaSyBz1h0MShKRQGLPrQTCR-e_p4ugCVSxLUE",
  authDomain: "noa-app-ai7.firebaseapp.com",
  projectId: "noa-app-ai7",
  storageBucket: "noa-app-ai7.firebasestorage.app",
  messagingSenderId: "988587466937",
  appId: "1:988587466937:web:d4e5c4a8b9f2a1c3d4e5f6"
};

// Initialize Firebase (only once)
let db;
try {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
} catch (e) {
  console.warn('Firebase init error (may already be initialized):', e.message);
}

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

const convertTimestamps = (data) => {
  if (!data) return data;
  const result = { ...data };
  Object.keys(result).forEach(key => {
    if (result[key]?.toDate) {
      result[key] = result[key].toDate();
    } else if (result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])) {
      result[key] = convertTimestamps(result[key]);
    }
  });
  return result;
};

// ═══════════════════════════════════════════════════════════════
// DATA HOOKS
// ═══════════════════════════════════════════════════════════════

/**
 * Check if current user is in demo mode
 */
export function useIsDemoMode(userEmail) {
  return useMemo(() => isDemoAccount(userEmail), [userEmail]);
}

/**
 * Get all scholars for a family
 */
export function useScholars(familyId, userEmail) {
  const [scholars, setScholars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isDemo = isDemoAccount(userEmail);
  
  useEffect(() => {
    if (isDemo) {
      setScholars(DEMO_SCHOLARS);
      setLoading(false);
      return;
    }
    
    if (!familyId || !db) {
      setScholars([]);
      setLoading(false);
      return;
    }
    
    const fetchScholars = async () => {
      try {
        setLoading(true);
        const scholarsRef = collection(db, 'families', familyId, 'scholars');
        const q = query(scholarsRef, orderBy('name'));
        const querySnapshot = await getDocs(q);
        const scholarsList = querySnapshot.docs.map(doc => 
          convertTimestamps({ id: doc.id, ...doc.data() })
        );
        setScholars(scholarsList);
      } catch (err) {
        console.error('Error fetching scholars:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchScholars();
  }, [familyId, isDemo]);
  
  return { scholars, loading, error };
}

/**
 * Get recent sessions for a scholar
 */
export function useScholarSessions(familyId, scholarId, userEmail, limitCount = 10) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isDemo = isDemoAccount(userEmail);
  
  useEffect(() => {
    if (isDemo) {
      const demoSessions = getDemoSessionsForScholar(scholarId) || [];
      setSessions(demoSessions.slice(0, limitCount));
      setLoading(false);
      return;
    }
    
    if (!familyId || !scholarId || !db) {
      setSessions([]);
      setLoading(false);
      return;
    }
    
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const sessionsRef = collection(db, 'families', familyId, 'sessions');
        const q = query(
          sessionsRef,
          where('scholarId', '==', scholarId),
          orderBy('startedAt', 'desc'),
          limit(limitCount)
        );
        const querySnapshot = await getDocs(q);
        const sessionsList = querySnapshot.docs.map(doc => 
          convertTimestamps({ id: doc.id, ...doc.data() })
        );
        setSessions(sessionsList);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessions();
  }, [familyId, scholarId, isDemo, limitCount]);
  
  return { sessions, loading, error };
}

/**
 * Get weekly stats for a scholar
 */
export function useScholarWeeklyStats(familyId, scholarId, userEmail, weeksCount = 8) {
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isDemo = isDemoAccount(userEmail);
  
  useEffect(() => {
    if (isDemo) {
      // Build from demo stats
      const stats = getDemoStatsForScholar(scholarId);
      if (stats) {
        setWeeklyStats([
          { weekId: 'prev', ...stats.lastWeek },
          { weekId: 'current', ...stats.thisWeek }
        ]);
      } else {
        setWeeklyStats([]);
      }
      setLoading(false);
      return;
    }
    
    if (!familyId || !scholarId || !db) {
      setWeeklyStats([]);
      setLoading(false);
      return;
    }
    
    const fetchWeeklyStats = async () => {
      try {
        setLoading(true);
        const statsRef = collection(db, 'families', familyId, 'scholars', scholarId, 'weeklyStats');
        const q = query(statsRef, orderBy('weekId', 'desc'), limit(weeksCount));
        const querySnapshot = await getDocs(q);
        const statsList = querySnapshot.docs
          .map(doc => convertTimestamps({ id: doc.id, ...doc.data() }))
          .reverse();
        setWeeklyStats(statsList);
      } catch (err) {
        console.error('Error fetching weekly stats:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeeklyStats();
  }, [familyId, scholarId, isDemo, weeksCount]);
  
  return { weeklyStats, loading, error };
}

/**
 * Get topic progress for a scholar
 */
export function useScholarTopicProgress(familyId, scholarId, userEmail) {
  const [topicProgress, setTopicProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isDemo = isDemoAccount(userEmail);
  
  useEffect(() => {
    if (isDemo) {
      setTopicProgress(getDemoTopicsForScholar(scholarId) || []);
      setLoading(false);
      return;
    }
    
    if (!familyId || !scholarId || !db) {
      setTopicProgress([]);
      setLoading(false);
      return;
    }
    
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const progressRef = collection(db, 'families', familyId, 'scholars', scholarId, 'topicProgress');
        const querySnapshot = await getDocs(progressRef);
        const progressList = querySnapshot.docs.map(doc => 
          convertTimestamps({ id: doc.id, ...doc.data() })
        );
        setTopicProgress(progressList);
      } catch (err) {
        console.error('Error fetching topic progress:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProgress();
  }, [familyId, scholarId, isDemo]);
  
  return { topicProgress, loading, error };
}

/**
 * Get confidence data for a scholar
 */
export function useScholarConfidence(familyId, scholarId, userEmail) {
  const [confidenceData, setConfidenceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isDemo = isDemoAccount(userEmail);
  
  useEffect(() => {
    if (isDemo) {
      setConfidenceData(getDemoConfidenceForScholar(scholarId));
      setLoading(false);
      return;
    }
    
    if (!familyId || !scholarId || !db) {
      setConfidenceData(null);
      setLoading(false);
      return;
    }
    
    const fetchConfidence = async () => {
      try {
        setLoading(true);
        const confRef = collection(db, 'families', familyId, 'scholars', scholarId, 'confidenceTracking');
        const querySnapshot = await getDocs(confRef);
        const confList = querySnapshot.docs.map(doc => 
          convertTimestamps({ domain: doc.id, ...doc.data() })
        );
        setConfidenceData(confList.length > 0 ? confList : null);
      } catch (err) {
        console.error('Error fetching confidence:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConfidence();
  }, [familyId, scholarId, isDemo]);
  
  return { confidenceData, loading, error };
}

/**
 * Get family billing data
 */
export function useFamilyBilling(familyId, userEmail) {
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isDemo = isDemoAccount(userEmail);
  
  useEffect(() => {
    if (isDemo) {
      setBilling(DEMO_SUBSCRIPTION);
      setLoading(false);
      return;
    }
    
    if (!familyId || !db) {
      setBilling(null);
      setLoading(false);
      return;
    }
    
    const fetchBilling = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'families', familyId, 'billing', 'current');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBilling(convertTimestamps(docSnap.data()));
        } else {
          // Default free plan
          setBilling({
            plan: 'free',
            status: 'active',
            includedScholars: 1,
            maxScholars: 1
          });
        }
      } catch (err) {
        console.error('Error fetching billing:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBilling();
  }, [familyId, isDemo]);
  
  return { billing, loading, error };
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export { db, isDemoAccount };

export default {
  useIsDemoMode,
  useScholars,
  useScholarSessions,
  useScholarWeeklyStats,
  useScholarTopicProgress,
  useScholarConfidence,
  useFamilyBilling
};
