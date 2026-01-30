// ═══════════════════════════════════════════════════════════════
// FILE: pages/app/Writing.jsx
// PURPOSE: Writing assignments view with Firestore data
// VERSION: 3.0 - Schema v7 compliant
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase.js';
import { useAuth } from '../../lib/AuthContext.jsx';
const cn = (...classes) => classes.filter(Boolean).join(' ');
import { PenLine, Calendar, FileText, Eye, CheckCircle2, Clock } from "lucide-react";

const genreColors = { NARRATIVE: 'bg-purple-100 text-purple-700', PERSUASIVE: 'bg-amber-100 text-amber-700', INFORMATIVE: 'bg-teal-100 text-teal-700', RECOUNT: 'bg-rose-100 text-rose-700' };
const genreLabels = { NARRATIVE: 'Narrative', PERSUASIVE: 'Persuasive', INFORMATIVE: 'Informative', RECOUNT: 'Recount' };

export default function Writing() {
  const { scholars, family } = useAuth();
  const [selectedScholar, setSelectedScholar] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (scholars.length > 0 && !selectedScholar) setSelectedScholar(scholars[0]);
  }, [scholars, selectedScholar]);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!family?.id || !selectedScholar?.id) { setAssignments([]); return; }
      setLoading(true);
      try {
        const assignmentsRef = collection(db, 'families', family.id, 'scholars', selectedScholar.id, 'writingAssignments');
        const snapshot = await getDocs(query(assignmentsRef, orderBy('submittedAt', 'desc')));
        setAssignments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) { console.error('Error fetching writing assignments:', err); setAssignments([]); }
      finally { setLoading(false); }
    };
    fetchAssignments();
  }, [family?.id, selectedScholar?.id]);

  const analyzedCount = assignments.filter(a => a.analysis).length;
  const pendingCount = assignments.filter(a => !a.analysis).length;
  const formatDate = (timestamp) => { if (!timestamp) return ''; const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp); return date.toLocaleDateString('en-AU', { month: 'short', day: 'numeric', year: 'numeric' }); };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-800">Writing Practice</h1>
            <p className="text-slate-500 mt-1">Review and improve writing with side-by-side feedback</p>
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
          <div className="bg-white rounded-xl border border-slate-200 p-4"><p className="text-2xl font-semibold text-slate-800">{assignments.length}</p><p className="text-sm text-slate-500">Total Pieces</p></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4"><p className="text-2xl font-semibold text-emerald-600">{analyzedCount}</p><p className="text-sm text-slate-500">Reviewed</p></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4"><p className="text-2xl font-semibold text-amber-600">{pendingCount}</p><p className="text-sm text-slate-500">Pending Review</p></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Writing Assignments</h2>
            {loading ? (<div className="space-y-3">{[1, 2, 3].map(i => (<div key={i} className="h-24 rounded-xl bg-slate-200 animate-pulse" />))}</div>
            ) : assignments.length > 0 ? (<div className="space-y-3">{assignments.map(assignment => (<AssignmentCard key={assignment.id} assignment={assignment} isSelected={selectedAssignment?.id === assignment.id} onClick={() => setSelectedAssignment(assignment)} formatDate={formatDate} />))}</div>
            ) : (<div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 text-center"><PenLine className="w-10 h-10 text-slate-300 mx-auto mb-3" /><p className="text-slate-500 text-sm">No writing assignments yet.</p><p className="text-slate-400 text-xs mt-2">Writing pieces will appear here after {selectedScholar?.name || 'your child'} completes writing sessions.</p></div>)}
          </div>

          <div className="lg:col-span-2">
            {selectedAssignment ? (<WritingDetail assignment={selectedAssignment} formatDate={formatDate} />
            ) : (<div className="h-full flex items-center justify-center bg-white rounded-2xl border border-slate-200 min-h-[400px]"><div className="text-center"><div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"><Eye className="w-8 h-8 text-slate-400" /></div><p className="text-slate-500">Select a writing assignment to review</p></div></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function AssignmentCard({ assignment, isSelected, onClick, formatDate }) {
  const hasAnalysis = !!assignment.analysis;
  return (
    <div onClick={onClick} className={cn("bg-white rounded-xl border p-4 cursor-pointer transition-all duration-200", isSelected ? "border-indigo-300 shadow-md ring-2 ring-indigo-100" : "border-slate-200 hover:border-slate-300")}>
      <div className="flex items-start justify-between mb-2">
        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", hasAnalysis ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>{hasAnalysis ? 'Reviewed' : 'Pending'}</span>
        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", genreColors[assignment.genre] || "bg-slate-100 text-slate-600")}>{genreLabels[assignment.genre] || assignment.genre}</span>
      </div>
      <h4 className="font-medium text-slate-800 mb-2 line-clamp-2">{assignment.promptText?.substring(0, 60) || 'Writing Assignment'}...</h4>
      <div className="flex items-center gap-3 text-xs text-slate-400">
        {assignment.submittedAt && (<span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(assignment.submittedAt)}</span>)}
        <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{assignment.wordCount || '—'} words</span>
      </div>
      {assignment.analysis?.improvements?.length > 0 && (<p className="text-xs text-indigo-600 mt-2">{assignment.analysis.improvements.length} improvements suggested</p>)}
    </div>
  );
}

function WritingDetail({ assignment, formatDate }) {
  const analysis = assignment.analysis;
  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Writing Submission</h2>
          <div className="flex items-center gap-3">
            <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", genreColors[assignment.genre] || "bg-slate-100 text-slate-600")}>{genreLabels[assignment.genre] || assignment.genre}</span>
            {assignment.submittedAt && (<span className="text-sm text-slate-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(assignment.submittedAt)}</span>)}
          </div>
        </div>
      </div>

      <div className="bg-slate-100 rounded-xl p-4 mb-6"><p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Writing Prompt</p><p className="text-slate-700">{assignment.promptText}</p></div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><PenLine className="w-4 h-4" />Original Writing</h3>
          <div className="prose prose-sm text-slate-700 whitespace-pre-wrap">{assignment.originalText}</div>
          <p className="text-xs text-slate-400 mt-4">{assignment.wordCount} words</p>
        </div>
        <div className={cn("rounded-xl border p-5", analysis ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200")}>
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><CheckCircle2 className={cn("w-4 h-4", analysis ? "text-emerald-600" : "text-slate-400")} />{analysis ? 'Improved Version' : 'Pending Analysis'}</h3>
          {analysis?.improvedText ? (<div className="prose prose-sm text-slate-700 whitespace-pre-wrap">{analysis.improvedText}</div>) : (<div className="text-center py-8"><Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" /><p className="text-slate-500 text-sm">Analysis in progress...</p></div>)}
        </div>
      </div>

      {analysis?.improvements?.length > 0 && (
        <div className="mt-6 bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Suggested Improvements</h3>
          <div className="space-y-4">
            {analysis.improvements.map((improvement, i) => (
              <div key={improvement.id || i} className="p-4 rounded-lg bg-slate-50">
                <div className="flex items-start gap-3"><span className="text-xs font-medium px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">{improvement.trait}</span></div>
                <div className="mt-2 grid md:grid-cols-2 gap-3 text-sm">
                  <div className="p-2 bg-red-50 rounded border border-red-100"><p className="text-xs text-red-600 mb-1">Original</p><p className="text-slate-700">{improvement.original}</p></div>
                  <div className="p-2 bg-emerald-50 rounded border border-emerald-100"><p className="text-xs text-emerald-600 mb-1">Improved</p><p className="text-slate-700">{improvement.improved}</p></div>
                </div>
                {improvement.why && (<p className="text-xs text-slate-500 mt-2"><strong>Why:</strong> {improvement.why}</p>)}
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis?.feedbackSummary && (
        <div className="mt-6 bg-indigo-50 rounded-xl border border-indigo-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-2">Overall Feedback</h3>
          <p className="text-slate-700">{analysis.feedbackSummary}</p>
          {analysis.strengths?.length > 0 && (<div className="mt-4"><p className="text-sm font-medium text-slate-600 mb-2">Strengths:</p><ul className="list-disc list-inside text-sm text-slate-600 space-y-1">{analysis.strengths.map((s, i) => (<li key={i}>{s}</li>))}</ul></div>)}
          {analysis.nextFocus && (<div className="mt-4"><p className="text-sm font-medium text-slate-600">Next Focus:</p><p className="text-sm text-slate-600">{analysis.nextFocus}</p></div>)}
        </div>
      )}
    </div>
  );
}
