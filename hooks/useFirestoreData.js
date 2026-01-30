// ═══════════════════════════════════════════════════════════════
// FILE: src/hooks/useFirestoreData.js
// PURPOSE: Centralized Firestore data hooks for NOA
// BATCH: 4A/4B - Foundation hooks (imports demo data from demoData.js)
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

// Import demo data from separate file
import {
  DEMO_EMAIL,
  isDemoMode,
  DEMO_FAMILY,
  DEMO_SCHOLARS,
  DEMO_BILLING,
  getDemoTopicProgress,
  getDemoSessions,
  getDemoWeeklyStats,
  getDemoConfidence
} from '@/lib/demoData';

// Re-export for convenience
export { DEMO_EMAIL, isDemoMode };

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
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

const convertTimestamps = (data) => {
  if (!data) return data;
  
  const result = { ...data };
  
  // Convert Firestore Timestamps to JS Dates
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
 * @param {string} userEmail - User's email address
 * @returns {boolean}
 */
export function useIsDemoMode(userEmail) {
  return useMemo(() => isDemoMode(userEmail), [userEmail]);
}

/**
 * Get family data for the current user
 * @param {string} familyId - Family document ID
 * @param {string} userEmail - User's email (for demo detection)
 * @returns {{ family, loading, error }}
 */
export function useFamilyData(familyId, userEmail) {
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isDemo = isDemoMode(userEmail);
  
  useEffect(() => {
    if (isDemo) {
      setFamily(DEMO_FAMILY);
      setLoading(false);
      return;
    }
    
    if (!familyId) {
      setLoading(false);
      return;
    }
    
    const fetchFamily = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'families', familyId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setFamily(convertTimestamps({ id: docSnap.id, ...docSnap.data() }));
        } else {
          setError(new Error('Family not found'));
        }
      } catch (err) {
        console.error('Error fetching family:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFamily();
  }, [familyId, isDemo]);
  
  return { family, loading, error };
}

/**
 * Get billing data for the family
 * @param {string} familyId - Family document ID
 * @param {string} userEmail - User's email (for demo detection)
 * @returns {{ billing, loading, error }}
 */
export function useFamilyBilling(familyId, userEmail) {
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isDemo = isDemoMode(userEmail);
  
  useEffect(() => {
    if (isDemo) {
      setBilling(DEMO_BILLING);
      setLoading(false);
      return;
    }
    
    if (!familyId) {
      setLoading(false);
      return;
    }
    
    const fetchBilling = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'families', familyId, 'billing', 'public');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setBilling(convertTimestamps(docSnap.data()));
        } else {
          // Default to free plan if no billing document
          setBilling({
            plan: 'FREE',
            status: 'ACTIVE',
            includedScholars: 1,
            maxScholars: 1,
            features: {
              numeracy: true,
              reading: true,
              writing: false,
              conventions: true,
              unlimitedSessions: false,
              fullInsights: false,
              writingFeedback: false,
              extensionContent: false
            }
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

/**
 * Get all scholars for a family
 * @param {string} familyId - Family document ID
 * @param {string} userEmail - User's email (for demo detection)
 * @returns {{ scholars, loading, error }}
 */
export function useScholars(familyId, userEmail) {
  const [scholars, setScholars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isDemo = isDemoMode(userEmail);
  
  useEffect(() => {
    if (isDemo) {
      setScholars(DEMO_SCHOLARS);
      setLoading(false);
      return;
    }
    
    if (!familyId) {
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
 * Get a single scholar's data
 * @param {string} familyId - Family document ID
 * @param {string} scholarId - Scholar document ID
 * @param {string} userEmail - User's email (for demo detection)
 * @returns {{ scholar, loading, error }}
 */
export function useScholar(familyId, scholarId, userEmail) {
  const [scholar, setScholar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isDemo = isDemoMode(userEmail);
  
  useEffect(() => {
    if (isDemo) {
      const demoScholar = DEMO_SCHOLARS.find(s => s.id === scholarId) || DEMO_SCHOLARS[0];
      setScholar(demoScholar);
      setLoading(false);
      return;
    }
    
    if (!familyId || !scholarId) {
      setLoading(false);
      return;
    }
    
    const fetchScholar = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'families', familyId, 'scholars', scholarId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setScholar(convertTimestamps({ id: docSnap.id, ...docSnap.data() }));
        } else {
          setError(new Error('Scholar not found'));
        }
      } catch (err) {
        console.error('Error fetching scholar:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchScholar();
  }, [familyId, scholarId, isDemo]);
  
  return { scholar, loading, error };
}

/**
 * Get topic progress for a scholar
 * @param {string} familyId - Family document ID
 * @param {string} scholarId - Scholar document ID
 * @param {string} userEmail - User's email (for demo detection)
 * @returns {{ topicProgress, loading, error }}
 */
export function useScholarTopicProgress(familyId, scholarId, userEmail) {
  const [topicProgress, setTopicProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isDemo = isDemoMode(userEmail);
  
  useEffect(() => {
    if (isDemo) {
      setTopicProgress(getDemoTopicProgress(scholarId));
      setLoading(false);
      return;
    }
    
    if (!familyId || !scholarId) {
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
 * Get recent sessions for a scholar
 * @param {string} familyId - Family document ID
 * @param {string} scholarId - Scholar document ID
 * @param {string} userEmail - User's email (for demo detection)
 * @param {number} limitCount - Number of sessions to fetch (default 10)
 * @returns {{ sessions, loading, error }}
 */
export function useScholarSessions(familyId, scholarId, userEmail, limitCount = 10) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isDemo = isDemoMode(userEmail);
  
  useEffect(() => {
    if (isDemo) {
      setSessions(getDemoSessions(scholarId, limitCount));
      setLoading(false);
      return;
    }
    
    if (!familyId || !scholarId) {
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
 * @param {string} familyId - Family document ID
 * @param {string} scholarId - Scholar document ID
 * @param {string} userEmail - User's email (for demo detection)
 * @param {number} weeksCount - Number of weeks to fetch (default 8)
 * @returns {{ weeklyStats, loading, error }}
 */
export function useScholarWeeklyStats(familyId, scholarId, userEmail, weeksCount = 8) {
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isDemo = isDemoMode(userEmail);
  
  useEffect(() => {
    if (isDemo) {
      setWeeklyStats(getDemoWeeklyStats(scholarId));
      setLoading(false);
      return;
    }
    
    if (!familyId || !scholarId) {
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
          .reverse(); // Chronological order
        
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
 * Get confidence tracking for a scholar
 * @param {string} familyId - Family document ID
 * @param {string} scholarId - Scholar document ID
 * @param {string} userEmail - User's email (for demo detection)
 * @returns {{ confidenceData, loading, error }}
 */
export function useScholarConfidence(familyId, scholarId, userEmail) {
  const [confidenceData, setConfidenceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isDemo = isDemoMode(userEmail);
  
  useEffect(() => {
    if (isDemo) {
      setConfidenceData(getDemoConfidence(scholarId));
      setLoading(false);
      return;
    }
    
    if (!familyId || !scholarId) {
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
        
        setConfidenceData(confList);
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
 * Combined hook for dashboard data (reduces number of separate queries)
 * @param {string} familyId - Family document ID
 * @param {string} scholarId - Currently selected scholar ID
 * @param {string} userEmail - User's email (for demo detection)
 * @returns {{ scholars, selectedScholar, topicProgress, recentSessions, weeklyStats, loading, error }}
 */
export function useDashboardData(familyId, scholarId, userEmail) {
  const { scholars, loading: loadingScholars, error: scholarsError } = useScholars(familyId, userEmail);
  const { topicProgress, loading: loadingProgress, error: progressError } = useScholarTopicProgress(familyId, scholarId, userEmail);
  const { sessions: recentSessions, loading: loadingSessions, error: sessionsError } = useScholarSessions(familyId, scholarId, userEmail, 5);
  const { weeklyStats, loading: loadingStats, error: statsError } = useScholarWeeklyStats(familyId, scholarId, userEmail);
  
  const selectedScholar = useMemo(() => {
    return scholars.find(s => s.id === scholarId) || scholars[0] || null;
  }, [scholars, scholarId]);
  
  const loading = loadingScholars || loadingProgress || loadingSessions || loadingStats;
  const error = scholarsError || progressError || sessionsError || statsError;
  
  return {
    scholars,
    selectedScholar,
    topicProgress,
    recentSessions,
    weeklyStats,
    loading,
    error
  };
}

// ═══════════════════════════════════════════════════════════════
// REAL-TIME LISTENERS (Optional - for live updates)
// ═══════════════════════════════════════════════════════════════

/**
 * Subscribe to real-time scholar updates
 * @param {string} familyId - Family document ID
 * @param {string} scholarId - Scholar document ID
 * @param {function} onUpdate - Callback when data changes
 * @returns {function} Unsubscribe function
 */
export function subscribeToScholar(familyId, scholarId, onUpdate) {
  if (!familyId || !scholarId) return () => {};
  
  const docRef = doc(db, 'families', familyId, 'scholars', scholarId);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      onUpdate(convertTimestamps({ id: docSnap.id, ...docSnap.data() }));
    }
  }, (error) => {
    console.error('Scholar subscription error:', error);
  });
}

/**
 * Subscribe to real-time session updates
 * @param {string} familyId - Family document ID
 * @param {string} scholarId - Scholar document ID
 * @param {function} onUpdate - Callback when data changes
 * @param {number} limitCount - Number of sessions to watch
 * @returns {function} Unsubscribe function
 */
export function subscribeToSessions(familyId, scholarId, onUpdate, limitCount = 5) {
  if (!familyId || !scholarId) return () => {};
  
  const sessionsRef = collection(db, 'families', familyId, 'sessions');
  const q = query(
    sessionsRef,
    where('scholarId', '==', scholarId),
    orderBy('startedAt', 'desc'),
    limit(limitCount)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const sessions = querySnapshot.docs.map(doc => 
      convertTimestamps({ id: doc.id, ...doc.data() })
    );
    onUpdate(sessions);
  }, (error) => {
    console.error('Sessions subscription error:', error);
  });
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export { db };

export default {
  DEMO_EMAIL,
  isDemoMode,
  useIsDemoMode,
  useFamilyData,
  useFamilyBilling,
  useScholars,
  useScholar,
  useScholarTopicProgress,
  useScholarSessions,
  useScholarWeeklyStats,
  useScholarConfidence,
  useDashboardData,
  subscribeToScholar,
  subscribeToSessions
};
