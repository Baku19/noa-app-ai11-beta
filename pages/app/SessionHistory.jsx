// ═══════════════════════════════════════════════════════════════
// FILE: pages/app/SessionHistory.jsx
// PURPOSE: View completed learning sessions from Firestore
// VERSION: 3.0 - Schema v7 compliant
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase.js';
import { useAuth } from '../../lib/AuthContext.jsx';
import { cn } from "../../lib/utils.js";
import { Calendar, Clock, CheckCircle2, BookOpen, Brain, Sparkles, HelpCircle, MessageSquare } from "lucide-react";

export default function SessionHistory() {
  const { scholars, family } = useAuth();
  const [selectedScholar, setSelectedScholar] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (scholars.length > 0 && !selectedScholar) setSelectedScholar(scholars[0]);
  }, [scholars, selectedScholar]);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!family?.id || !selectedScholar?.id) { setSessions([]); return; }
      setLoading(true);
      try {
        const sessionsRef = collection(db, 'families', family.id, 'sessions');
        const sessionsQuery = query(sessionsRef, where('scholarId', '==', selectedScholar.id), where('status', '==', 'COMPLETED'), orderBy('completedAt', 'desc'));
        const snapshot = await getDocs(sessionsQuery);
        const sessionsWithResults = await Promise.all(snapshot.docs.map(async (sessionDoc) => {
          const sessionData = { id: sessionDoc.id, ...sessionDoc.data() };
          try {
            const resultsRef = doc(db, 'families', family.id, 'sessions', sessionDoc.id, 'serverData', 'resultsPublic');
            const resultsSnap = await getDoc(resultsRef);
            if (resultsSnap.exists()) sessionData.results = resultsSnap.data();
          } catch (err) { console.log('No results for session:', sessionDoc.id); }
          return sessionData;
        }));
        setSessions(sessionsWithResults);
      } catch (err) { console.error('Error fetching session history:', err); setSessions([]); }
      finally { setLoading(false); }
    };
    fetchSessions();
  }, [family?.id, selectedScholar?.id]);

  const groupedSessions = sessions.reduce((acc, session) => {
    const dateStr = session.completedAt?.toDate?.() ? session.completedAt.toDate().toLocaleDateString('en-AU', { weekday: 'long', month: 'long', day: 'numeric' }) : session.sessionDate || 'Unknown Date';
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(session);
    return acc;
  }, {});

  const totalMinutes = sessions.reduce((acc, s) => acc + (s.actualDurationMinutes || s.plannedDurationMinutes || 0), 0);
  const thisWeekCount = sessions.filter(s => {
    const completed = s.completedAt?.toDate?.() || new Date(s.sessionDate);
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    return completed >= weekAgo;
  }).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-800">Session History</h1>
            <p className="text-slate-500 mt-1">See what happened in each learning session</p>
          </div>
          <div className="flex items-center gap-2">
            {scholars.map(scholar => (
              <button key={scholar.id} onClick={() => setSelectedScholar(scholar)} className={cn("flex items-center gap-2 px-4 py-2 rounded-xl transition-all", selectedScholar?.id === scholar.id ? "bg-white shadow-md border-2 border-indigo-500" : "bg-white/50 border border-slate-200 hover:bg-white")}>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold", scholar.avatarColor || "bg-indigo-500")}>{scholar.name?.charAt(0) || '?'}</div>
                <span className="font-medium text-slate-700">{scholar.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-5"><p className="text-2xl font-semibold text-slate-800">{sessions.length}</p><p className="text-sm text-slate-500">Sessions Completed</p></div>
          <div className="bg-white rounded-xl border border-slate-200 p-5"><p className="text-2xl font-semibold text-indigo-600">{thisWeekCount}</p><p className="text-sm text-slate-500">This Week</p></div>
          <div className="bg-white rounded-xl border border-slate-200 p-5"><p className="text-2xl font-semibold text-slate-800">{Math.round(totalMinutes / 60)}h</p><p className="text-sm text-slate-500">Total Learning Time</p></div>
        </div>

        {loading ? (<div className="space-y-4">{[1, 2, 3].map(i => (<div key={i} className="h-40 rounded-2xl bg-slate-200 animate-pulse" />))}</div>
        ) : sessions.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedSessions).map(([date, dateSessions]) => (
              <div key={date}>
                <h3 className="text-sm font-medium text-slate-500 mb-4">{date}</h3>
                <div className="space-y-4">{dateSessions.map(session => (<SessionCard key={session.id} session={session} />))}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"><Calendar className="w-8 h-8 text-slate-400" /></div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No sessions yet</h3>
            <p className="text-slate-500 max-w-md mx-auto">Once {selectedScholar?.name || 'your child'} completes learning sessions, they'll appear here with detailed summaries.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SessionCard({ session }) {
  const [expanded, setExpanded] = useState(false);
  const domainConfig = { NUMERACY: { bg: 'bg-indigo-100', icon: '🔢', name: 'Numeracy' }, READING: { bg: 'bg-teal-100', icon: '📖', name: 'Reading' }, WRITING: { bg: 'bg-amber-100', icon: '✏️', name: 'Writing' }, CONVENTIONS: { bg: 'bg-rose-100', icon: '📝', name: 'Conventions' } };
  const config = domainConfig[session.domain] || { bg: 'bg-slate-100', icon: '📚', name: session.domain };
  const results = session.results || {};

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="p-6 cursor-pointer hover:bg-slate-50/50 transition-colors" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start gap-4">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl", config.bg)}>{config.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", config.bg)}>{config.name}</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" />{session.actualDurationMinutes || session.plannedDurationMinutes || '~20'} min</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{session.learningIntent || 'Practice Session'}</h3>
            {results.completionSummary?.body && (<p className="text-slate-600 mb-3">{results.completionSummary.body}</p>)}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              {results.totalItemsAttempted > 0 && (<span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{results.totalItemsAttempted} questions explored</span>)}
              {results.totalHintsUsed > 0 && (<span className="flex items-center gap-1"><HelpCircle className="w-4 h-4" />{results.totalHintsUsed} hints used</span>)}
            </div>
          </div>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-6">
          {results.completionSummary?.headline && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2"><MessageSquare className="w-4 h-4 text-slate-400" /><span className="text-sm font-medium text-slate-600">Session Summary</span></div>
              <p className="text-slate-700 leading-relaxed bg-white rounded-xl p-4 border border-slate-200"><strong>{results.completionSummary.headline}</strong>{results.completionSummary.body && (<> — {results.completionSummary.body}</>)}</p>
            </div>
          )}
          {session.targetSkillTags?.length > 0 && (
            <div className="mb-6">
              <span className="text-sm font-medium text-slate-600 mb-2 block">Skills Practiced</span>
              <div className="flex flex-wrap gap-2">{session.targetSkillTags.map((skill, i) => (<span key={i} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">{skill}</span>))}</div>
            </div>
          )}
          {(results.confidenceLevel || results.effortSignal) && (
            <div>
              <span className="text-sm font-medium text-slate-600 mb-3 block">Session Signals</span>
              <div className="grid grid-cols-2 gap-3">
                {results.confidenceLevel && (<SignalBadge icon={Brain} label="Confidence" value={results.confidenceLevel} />)}
                {results.effortSignal && (<SignalBadge icon={Sparkles} label="Effort" value={results.effortSignal} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SignalBadge({ icon: Icon, label, value }) {
  const valueConfig = { HIGH: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'High' }, MODERATE: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Moderate' }, BUILDING: { bg: 'bg-sky-50', text: 'text-sky-700', label: 'Building' }, PERSISTED: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Persisted' }, FOCUSED: { bg: 'bg-sky-50', text: 'text-sky-700', label: 'Focused' }, STRUGGLED: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Struggled' }, COASTED: { bg: 'bg-slate-50', text: 'text-slate-600', label: 'Coasted' } };
  const config = valueConfig[value] || { bg: 'bg-slate-50', text: 'text-slate-600', label: value };
  return (<div className={cn("rounded-xl p-3 text-center", config.bg)}><Icon className={cn("w-5 h-5 mx-auto mb-1", config.text)} /><p className="text-xs text-slate-500">{label}</p><p className={cn("text-sm font-medium", config.text)}>{config.label}</p></div>);
}
