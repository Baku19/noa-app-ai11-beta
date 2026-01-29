import React from 'react';
import { STRENGTH_LABELS } from '../../lib/copy.js';

const domains = [
  { domain: 'Numeracy', icon: '🔢', bgClass: 'bg-indigo-100', description: 'Number, algebra, measurement, geometry, statistics' },
  { domain: 'Reading', icon: '📖', bgClass: 'bg-emerald-100', description: 'Comprehension, inference, vocabulary in context' },
  { domain: 'Writing', icon: '✏️', bgClass: 'bg-amber-100', description: 'Narrative & persuasive with AI feedback' },
  { domain: 'Grammar', icon: '📝', bgClass: 'bg-rose-100', description: 'Punctuation, sentence structure, conventions' },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            Everything Your Child Needs
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Four NAPLAN domains. One intelligent platform.
          </p>
        </div>

        {/* Domain Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {domains.map((item) => (
            <div key={item.domain} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 ${item.bgClass}`}>
                <span role="img" aria-label={item.domain}>{item.icon}</span>
              </div>
              <h3 className="font-semibold text-slate-800 text-lg">{item.domain}</h3>
              <p className="text-sm text-slate-500">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Card 1 - AI Writing Feedback */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg flex flex-col">
            <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold rounded-full self-start">AI-Powered</span>
            <p className="text-sm text-slate-500 mt-2">Writing Feedback</p>
            <h3 className="text-2xl font-bold text-slate-800 my-4">See exactly how to improve</h3>
            <p className="text-slate-600 mb-6">Noa's AI provides constructive feedback on grammar, structure, and persuasiveness, turning good writing into great writing.</p>
            
            <div className="mt-auto bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                        <p className="font-semibold text-slate-500 mb-2">Original</p>
                        <p className="text-slate-700">The dog was big. It ran fast. It was brown.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-indigo-600 mb-2">Improved</p>
                        <p className="text-slate-800">The large, brown dog sprinted across the field with incredible speed.</p>
                    </div>
                </div>
            </div>
          </div>

          {/* Card 2 - Parent Dashboard */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg flex flex-col">
            <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold rounded-full self-start">Parent Portal</span>
            <p className="text-sm text-slate-500 mt-2">Full Visibility</p>
            <h3 className="text-2xl font-bold text-slate-800 my-4">Know exactly where they stand</h3>
            <p className="text-slate-600 mb-6">Your dashboard gives you a clear, jargon-free overview of your child's progress, strengths, and areas for focus.</p>

            <div className="mt-auto space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
                <p className="font-medium text-sm text-slate-800">Fractions</p>
                <p className="ml-auto text-xs text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">{STRENGTH_LABELS.strength}</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0"></div>
                <p className="font-medium text-sm text-slate-800">Inference</p>
                <p className="ml-auto text-xs text-sky-700 font-semibold bg-sky-100 px-2 py-0.5 rounded-full">{STRENGTH_LABELS.emerging_strength}</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"></div>
                <p className="font-medium text-sm text-slate-800">Word Problems</p>
                <p className="ml-auto text-xs text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">{STRENGTH_LABELS.focus_area}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;