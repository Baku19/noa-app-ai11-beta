// ═══════════════════════════════════════════════════════════════
// FILE: pages/app/TopicStrengths.jsx
// PURPOSE: Topic progress view with real Firestore data
// VERSION: 3.0 - Schema v7 compliant
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase.js';
import { useAuth } from '../../lib/AuthContext.jsx';
const cn = (...classes) => classes.filter(Boolean).join(' ');
import { Search, TrendingUp } from 'lucide-react';

const domains = [
  { value: 'all', label: 'All Domains' },
  { value: 'NUMERACY', label: 'Numeracy' },
  { value: 'READING', label: 'Reading' },
  { value: 'WRITING', label: 'Writing' },
  { value: 'CONVENTIONS', label: 'Conventions' }
];

const strengthFilters = [
  { value: 'all', label: 'All States' },
  { value: 'STRENGTH', label: 'Strengths' },
  { value: 'EMERGING_STRENGTH', label: 'Getting Stronger' },
  { value: 'FOCUS_AREA', label: 'Working On' },
  { value: 'EMERGING_FOCUS', label: 'Keep Watching' }
];

export default function TopicStrengths() {
  const { scholars, family } = useAuth();
  const [selectedScholar, setSelectedScholar] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedStrength, setSelectedStrength] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [topicProgress, setTopicProgress] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (scholars.length > 0 && !selectedScholar) {
      setSelectedScholar(scholars[0]);
    }
  }, [scholars, selectedScholar]);

  useEffect(() => {
    const fetchTopicProgress = async () => {
      if (!family?.id || !selectedScholar?.id) {
        setTopicProgress([]);
        return;
      }
      setLoading(true);
      try {
        const progressRef = collection(db, 'families', family.id, 'scholars', selectedScholar.id, 'topicProgress');
        const snapshot = await getDocs(query(progressRef));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTopicProgress(data);
      } catch (err) {
        console.error('Error fetching topic progress:', err);
        setTopicProgress([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTopicProgress();
  }, [family?.id, selectedScholar?.id]);

  const filteredTopics = topicProgress.filter(topic => {
    const domainMatch = selectedDomain === 'all' || topic.domain === selectedDomain;
    const strengthMatch = selectedStrength === 'all' || topic.strengthState === selectedStrength;
    const searchMatch = !searchQuery || topic.topic?.toLowerCase().includes(searchQuery.toLowerCase()) || topic.skillTag?.toLowerCase().includes(searchQuery.toLowerCase());
    return domainMatch && strengthMatch && searchMatch;
  });

  const groupedTopics = filteredTopics.reduce((acc, topic) => {
    const domain = topic.domain || 'OTHER';
    if (!acc[domain]) acc[domain] = [];
    acc[domain].push(topic);
    return acc;
  }, {});

  const stats = {
    total: topicProgress.length,
    strengths: topicProgress.filter(t => t.strengthState === 'STRENGTH').length,
    gettingStronger: topicProgress.filter(t => t.strengthState === 'EMERGING_STRENGTH').length,
    workingOn: topicProgress.filter(t => t.strengthState === 'FOCUS_AREA').length,
    keepWatching: topicProgress.filter(t => t.strengthState === 'EMERGING_FOCUS').length
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-800">Topic Strengths</h1>
            <p className="text-slate-500 mt-1">Curriculum-aligned progress across all learning areas</p>
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

        <div className="flex flex-wrap gap-3 mb-6">
          <SummaryPill label="All Topics" count={stats.total} active />
          <SummaryPill label="Strengths" count={stats.strengths} color="emerald" />
          <SummaryPill label="Getting Stronger" count={stats.gettingStronger} color="sky" />
          <SummaryPill label="Working On" count={stats.workingOn} color="amber" />
          <SummaryPill label="Keep Watching" count={stats.keepWatching} color="slate" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search topics..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <select value={selectedDomain} onChange={(e) => setSelectedDomain(e.target.value)} className="px-4 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {domains.map(domain => (<option key={domain.value} value={domain.value}>{domain.label}</option>))}
          </select>
          <select value={selectedStrength} onChange={(e) => setSelectedStrength(e.target.value)} className="px-4 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {strengthFilters.map(filter => (<option key={filter.value} value={filter.value}>{filter.label}</option>))}
          </select>
        </div>

        {loading ? (
          <div className="space-y-6">{[1, 2, 3].map(i => (<div key={i}><div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-4" /><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">{[1, 2, 3].map(j => (<div key={j} className="h-20 rounded-xl bg-slate-200 animate-pulse" />))}</div></div>))}</div>
        ) : filteredTopics.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedTopics).map(([domain, topics]) => (
              <div key={domain}>
                <div className="flex items-center gap-3 mb-4">
                  <DomainIcon domain={domain} />
                  <h2 className="text-lg font-semibold text-slate-800">{formatDomainName(domain)}</h2>
                  <span className="text-sm text-slate-400">{topics.length} topics</span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">{topics.map(topic => (<TopicCard key={topic.id} topic={topic} />))}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-2xl border-2 border-dashed border-slate-200 text-center">
            <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{topicProgress.length === 0 ? "Building Your Learning Map" : "No topics match your filters"}</h3>
            <p className="text-slate-500 max-w-md mx-auto">{topicProgress.length === 0 ? `Once ${selectedScholar?.name || 'your child'} completes a few learning sessions, we'll show topic strengths here.` : "Try adjusting your filters to see more topics."}</p>
          </div>
        )}

        <div className="mt-12 p-6 bg-white rounded-2xl border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-2">About Topic Mapping</h3>
          <p className="text-sm text-slate-500 leading-relaxed">All topics are mapped to the Australian Curriculum v9.0 framework. Progress is tracked across four key categories to give you a clear picture of where your child is building confidence and where additional practice may help.</p>
        </div>
      </div>
    </div>
  );
}

function SummaryPill({ label, count, color, active }) {
  const colors = { emerald: 'bg-emerald-100 text-emerald-700', sky: 'bg-sky-100 text-sky-700', amber: 'bg-amber-100 text-amber-700', slate: 'bg-slate-100 text-slate-600' };
  return (<div className={cn("px-4 py-2 rounded-full text-sm font-medium", active ? "bg-slate-800 text-white" : colors[color] || "bg-slate-100 text-slate-600")}>{label}: {count}</div>);
}

function DomainIcon({ domain }) {
  const config = { NUMERACY: { bg: 'bg-indigo-100', icon: '🔢' }, READING: { bg: 'bg-teal-100', icon: '📖' }, WRITING: { bg: 'bg-amber-100', icon: '✏️' }, CONVENTIONS: { bg: 'bg-rose-100', icon: '📝' } };
  const c = config[domain] || { bg: 'bg-slate-100', icon: '📚' };
  return (<div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-lg", c.bg)}>{c.icon}</div>);
}

function formatDomainName(domain) {
  const names = { NUMERACY: 'Numeracy', READING: 'Reading', WRITING: 'Writing', CONVENTIONS: 'Conventions' };
  return names[domain] || domain;
}

function TopicCard({ topic }) {
  const stateConfig = {
    STRENGTH: { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', label: 'Strength' },
    EMERGING_STRENGTH: { bg: 'bg-sky-50', border: 'border-sky-200', badge: 'bg-sky-100 text-sky-700', label: 'Getting Stronger' },
    FOCUS_AREA: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', label: 'Working On' },
    EMERGING_FOCUS: { bg: 'bg-slate-50', border: 'border-slate-200', badge: 'bg-slate-100 text-slate-600', label: 'Keep Watching' }
  };
  const config = stateConfig[topic.strengthState] || stateConfig.EMERGING_FOCUS;
  return (
    <div className={cn("rounded-xl border p-4 transition-all hover:shadow-sm", config.bg, config.border)}>
      <div className="flex items-start justify-between mb-2">
        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", config.badge)}>{config.label}</span>
        {topic.trend && topic.trend !== 'STABLE' && (<span className="text-xs text-slate-500">{topic.trend === 'IMPROVING' ? '↑' : '→'}</span>)}
      </div>
      <h4 className="font-medium text-slate-800 mb-1">{topic.topic}</h4>
      <p className="text-xs text-slate-500">{topic.skillTag}</p>
      {topic.sessionsCount > 0 && (<p className="text-xs text-slate-400 mt-2">{topic.sessionsCount} sessions • {Math.round(topic.recentAccuracy * 100)}% recent</p>)}
    </div>
  );
}
