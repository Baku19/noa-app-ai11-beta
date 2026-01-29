import React from 'react';
import { Check, X } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    priceMonthly: '$0',
    priceAnnual: '$0',
    period: '/forever',
    description: 'Try Noa with Numeracy',
    cta: 'Get Started',
    popular: false,
    features: [
      { text: '1 Scholar', included: true },
      { text: 'Numeracy domain only', included: true },
      { text: 'Basic progress tracking', included: true },
      { text: 'Limited sessions', included: true },
    ],
    limitations: [
      { text: 'No Writing', included: false },
      { text: 'No Reading', included: false },
      { text: 'No Grammar', included: false },
    ],
  },
  {
    id: 'single',
    name: 'Single',
    priceMonthly: '$19',
    priceAnnual: '$190',
    period: '/month',
    periodAnnual: '/year',
    save: 'Save $38',
    description: 'Full access for one child',
    cta: 'Start Free Trial',
    popular: false,
    features: [
      { text: '1 Scholar', included: true },
      { text: 'All 4 domains', included: true },
      { text: 'Unlimited sessions', included: true },
      { text: 'Full progress insights', included: true },
      { text: 'AI writing feedback', included: true },
    ],
    limitations: [],
  },
  {
    id: 'family',
    name: 'Family',
    priceMonthly: '$29',
    priceAnnual: '$290',
    period: '/month',
    periodAnnual: '/year',
    save: 'Save $58',
    description: 'Best value for families',
    cta: 'Start Free Trial',
    popular: true,
    features: [
      { text: '2 Scholars included', included: true },
      { text: 'Add up to 3 more ($15/each)', included: true },
      { text: 'All 4 domains', included: true },
      { text: 'Unlimited sessions', included: true },
      { text: 'Full progress insights', included: true },
      { text: 'AI writing feedback', included: true },
      { text: 'Family dashboard', included: true },
    ],
    limitations: [],
  },
];

const Pricing = ({ isAnnual, setIsAnnual, onNavigate }) => {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-slate-500 mb-8">Start free. Upgrade when you're ready.</p>
          
          <div className="inline-flex bg-slate-100 rounded-xl p-1">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${!isAnnual ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${isAnnual ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
            >
              Annual
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">2 months free</span>
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-2xl">🚀</span>
              <h3 className="text-xl font-bold">NAPLAN Blitz Launch Offer</h3>
            </div>
            <p className="text-indigo-100 mb-4">Try the full Family Plan FREE for 30 days. Add up to 5 scholars. No credit card required.</p>
            <button 
              onClick={() => onNavigate('signup')}
              className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all"
            >
              Claim Free Trial
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl p-8 border-2 transition-all flex flex-col ${
                plan.popular 
                  ? 'border-indigo-500 shadow-xl shadow-indigo-500/10' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                <div className="mb-1">
                  <span className="text-4xl font-bold text-slate-800">
                    {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                  </span>
                  <span className="text-slate-500">
                    {plan.id === 'free' ? plan.period : (isAnnual ? plan.periodAnnual : plan.period)}
                  </span>
                </div>
                {plan.save && isAnnual && (
                  <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                    {plan.save}
                  </span>
                )}
                <p className="text-sm text-slate-500 mt-2">{plan.description}</p>
              </div>

              <div className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600">{feature.text}</span>
                  </div>
                ))}
                {plan.limitations.map((limit, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <X className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-400">{limit.text}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => onNavigate('signup')}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-slate-500 mt-8">
          All plans include a 30-day money-back guarantee. Cancel anytime.
        </p>
      </div>
    </section>
  );
};

export default Pricing;