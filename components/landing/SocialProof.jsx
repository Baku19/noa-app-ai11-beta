import React from 'react';

const stats = [
  { number: '4.9', label: 'Parent Rating', icon: '⭐' },
  { number: '15K+', label: 'Sessions Completed', icon: '📚' },
  { number: '94%', label: 'See Improvement', icon: '📈' },
  { number: 'v9.0', label: 'Curriculum Aligned', icon: '🇦🇺' },
];

const SocialProof = () => {
  return (
    <section className="py-12 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Side */}
        <p className="text-slate-500 font-medium">
          Trusted by Australian families
        </p>

        {/* Right Side - Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-2xl" role="img" aria-label={stat.label}>{stat.icon}</span>
              <div>
                <p className="font-bold text-slate-800">{stat.number}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
