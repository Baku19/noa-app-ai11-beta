// ═══════════════════════════════════════════════════════════════
// FILE: pages/app/LearningPlan.jsx
// PURPOSE: Learning plan with today's sessions from Firestore
// VERSION: 3.0 - Schema v7 compliant
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase.js';
import { useAuth } from '../../lib/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { cn } from "../../lib/utils.js";
import { Clock, Target, Lightbulb, Play, CheckCircle2, BookOpen } from "lucide-react";

export default function LearningPlan() {
  const { scholars, family } = useAuth();
  const [selectedScholar, setSelectedScholar] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [topicProgress, setTopicProgress] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (scholars.length > 0 && !selectedScholar) setSelectedScholar(scholars[0]);
  }, [scholars, selectedScholar]);

  useEffect(() => {
    const fetchData = async () => {
      if (!family?.id || !selectedScholar?.id) { setSessions([]); setTopicProgress([]); return; }
      setLoading(true);
      try {
        const sessionsRef = collection(db, 'families', family.id, 'sessions');
        const sessionsQuery = query(sessionsRef, where('scholarId', '==', selectedScholar.id), where('status', '==', 'PLANNED'), orderBy('sessionDate', 'asc'));
        const sessionsSnap = await getDocs(sessionsQuery);
        setSessions(sessionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        const progressRef = collection(db, 'families', family.id, 'scholars', selectedScholar.id, 'topicProgress');
        const progressSnap = await getDocs(query(progressRef));
        setTopicProgress(progressSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) { console.error('Error fetching learning plan:', err); setSessions([]); setTopicProgress([]); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [family?.id, selectedScholar?.id]);

  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => s.sessionDate === today);
  const upcomingSessions = sessions.filter(s => s.sessionDate !== today).slice(0, 3);
  const focusAreas = topicProgress.filter(t => t.strengthState === 'FOCUS_AREA' || t.strengthState === 'EMERGING_FOCUS').slice(0, 3);

  const formatDate = (dateStr) => { if (!dateStr) return ''; return new Date(dateStr).toLocaleDateString('en-AU', { weekday: 'long', month: 'long', day: 'numeric' }); };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-800">Learning Plan</h1>
            <p className="text-slate-500 mt-1">Personalised sessions for {selectedScholar?.name || 'your child'}</p>
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

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2"><Clock className="w-5 h-5" /><span className="font-medium">Daily Recommendation</span></div>
              <h2 className="text-2xl font-semibold mb-2">~20 minutes of learning</h2>
              <p className="text-indigo-100 text-sm">Short, focused sessions work best. We recommend completing 1-2 sessions per day.</p>
            </div>
            <div className="hidden sm:flex items-center gap-3"><div className="text-center"><p className="text-3xl font-bold">{sessions.length}</p><p className="text-xs text-indigo-100">Sessions Ready</p></div></div>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center"><Target className="w-5 h-5 text-amber-600" /></div>
            <div><h2 className="text-lg font-semibold text-slate-800">Today's Learning</h2><p className="text-sm text-slate-500">{formatDate(today)}</p></div>
          </div>
          {loading ? (<div className="grid md:grid-cols-2 gap-4"><div className="h-44 rounded-2xl bg-slate-200 animate-pulse" /><div className="h-44 rounded-2xl bg-slate-200 animate-pulse" /></div>
          ) : todaySessions.length > 0 ? (<div className="grid md:grid-cols-2 gap-4">{todaySessions.map((session, index) => (<TodaySessionCard key={session.id} session={session} isPrimary={index === 0} />))}</div>
          ) : sessions.length > 0 ? (<div className="bg-white rounded-2xl border border-slate-200 p-8 text-center"><CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" /><h3 className="font-semibold text-slate-800 mb-2">All done for today!</h3><p className="text-slate-500 text-sm">Great job! Check back tomorrow for new sessions.</p></div>
          ) : (<div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center"><BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" /><h3 className="font-semibold text-slate-800 mb-2">Sessions Coming Soon</h3><p className="text-slate-500 text-sm max-w-md mx-auto">Learning sessions will be automatically planned based on {selectedScholar?.name || "your child"}'s progress and learning needs.</p></div>)}
        </div>

        {focusAreas.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-10">
            <div className="flex items-center gap-2 mb-4"><Lightbulb className="w-5 h-5 text-amber-500" /><h3 className="font-semibold text-slate-800">Why These Sessions?</h3></div>
            <div className="space-y-3">{focusAreas.map(topic => (<div key={topic.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50"><div><p className="font-medium text-slate-800">{topic.topic}</p><p className="text-xs text-slate-500">{topic.skillTag}</p></div><span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", topic.strengthState === 'FOCUS_AREA' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600")}>Working On</span></div>))}</div>
            <p className="text-xs text-slate-400 mt-4">Sessions are tailored based on your child's progress and learning patterns.</p>
          </div>
        )}

        {upcomingSessions.length > 0 && (<div><h2 className="text-lg font-semibold text-slate-800 mb-4">Coming Up</h2><div className="grid md:grid-cols-3 gap-4">{upcomingSessions.map(session => (<SessionCard key={session.id} session={session} />))}</div></div>)}
      </div>
    </div>
  );
}

function TodaySessionCard({ session, isPrimary }) {
  const domainColors = { NUMERACY: 'from-indigo-500 to-indigo-600', READING: 'from-teal-500 to-teal-600', WRITING: 'from-amber-500 to-amber-600', CONVENTIONS: 'from-rose-500 to-rose-600' };
  const domainNames = { NUMERACY: 'Numeracy', READING: 'Reading', WRITING: 'Writing', CONVENTIONS: 'Conventions' };
  return (
    <div className={cn("rounded-2xl p-6 relative overflow-hidden", isPrimary ? `bg-gradient-to-br ${domainColors[session.domain] || 'from-slate-600 to-slate-700'} text-white` : "bg-white border border-slate-200")}>
      {isPrimary && <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />}
      <div className="relative">
        <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", isPrimary ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600")}>{domainNames[session.domain] || session.domain}</span>
        <h3 className={cn("text-xl font-semibold mt-4 mb-2", isPrimary ? "text-white" : "text-slate-800")}>{session.learningIntent || 'Practice Session'}</h3>
        {session.targetSkillTags?.length > 0 && (<div className="flex flex-wrap gap-2 mb-4">{session.targetSkillTags.slice(0, 2).map((skill, i) => (<span key={i} className={cn("text-xs px-2 py-1 rounded", isPrimary ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600")}>{skill}</span>))}</div>)}
        <div className={cn("flex items-center justify-between mt-4", isPrimary ? "text-white/80" : "text-slate-500")}>
          <div className="flex items-center gap-1.5 text-sm"><Clock className="w-4 h-4" /><span>{session.plannedDurationMinutes || 20} min</span></div>
          <Link to={`/session/${session.id}`}><button className={cn("flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors", isPrimary ? "bg-white text-slate-800 hover:bg-white/90" : "bg-indigo-600 text-white hover:bg-indigo-700")}><Play className="w-4 h-4" />Start</button></Link>
        </div>
      </div>
    </div>
  );
}

function SessionCard({ session }) {
  const domainNames = { NUMERACY: 'Numeracy', READING: 'Reading', WRITING: 'Writing', CONVENTIONS: 'Conventions' };
  const formatDate = (dateStr) => { if (!dateStr) return ''; return new Date(dateStr).toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' }); };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow">
      <span className="text-xs font-medium text-slate-500">{formatDate(session.sessionDate)}</span>
      <h4 className="font-medium text-slate-800 mt-2 mb-1">{session.learningIntent || domainNames[session.domain] || 'Practice'}</h4>
      <div className="flex items-center gap-2 text-xs text-slate-400"><Clock className="w-3 h-3" /><span>{session.plannedDurationMinutes || 20} min</span></div>
    </div>
  );
}
