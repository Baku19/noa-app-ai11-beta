import React from 'react';
import { X, Check } from 'lucide-react';

const problems = [
  "Guessing what your child needs help with",
  "Generic worksheets that don't adapt",
  "No visibility into actual progress",
  "Stressful cramming before test day",
  "Expensive tutors with no flexibility",
];

const solutions = [
  "AI identifies strengths & focus areas automatically",
  "Sessions adapt to your child's level in real-time",
  "Clear dashboard shows exactly where they stand",
  "Steady progress through consistent practice",
  "Affordable plans for the whole family",
];

const ProblemSolution = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            NAPLAN doesn't have to be stressful
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Most parents feel lost when it comes to helping their kids prepare. Noa changes that.
          </p>
        </div>

        {/* Two Columns */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Column 1 - Problems */}
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="flex items-center justify-center w-12 h-12 bg-rose-500/20 rounded-xl mb-6">
              <X className="w-6 h-6 text-rose-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Without Noa</h3>
            <ul className="space-y-3">
              {problems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-rose-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 - Solutions */}
          <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl p-8 border border-indigo-500/30">
            <div className="flex items-center justify-center w-12 h-12 bg-emerald-500/20 rounded-xl mb-6">
              <Check className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4">With Noa</h3>
            <ul className="space-y-3">
              {solutions.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                  <span className="text-white">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
