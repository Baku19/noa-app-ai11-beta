import React from 'react';

const steps = [
  {
    step: '01',
    icon: '👤',
    title: 'Add Your Child',
    description: 'Create a profile with their year level. They get their own login code to access sessions independently.',
  },
  {
    step: '02',
    icon: '🎯',
    title: 'Baseline Assessment',
    description: "Noa observes how your child approaches different skills over the first few sessions to build a personalised learning map.",
  },
  {
    step: '03',
    icon: '📈',
    title: 'Daily Practice',
    description: 'Just 20 minutes a day. Noa adapts each session to strengthen weaknesses while building on existing strengths.',
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            How Noa Works
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Get started in minutes. See progress in days.
          </p>
        </div>

        {/* Three Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((item) => (
            <div key={item.step} className="relative">
              <div className="text-6xl font-bold text-indigo-100 absolute -top-4 -left-2 z-0">
                {item.step}
              </div>
              <div className="relative z-10 bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all h-full">
                <p className="text-4xl mb-4" role="img" aria-label={item.title}>{item.icon}</p>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;