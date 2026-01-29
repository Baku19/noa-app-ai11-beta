import React, { useState } from 'react';
import { Logo, PrimaryButton } from '../../components/auth/shared.jsx';
import { Check, X } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext.jsx';

const plans = [
  {
    id: 'free',
    name: 'Free',
    priceMonthly: 0,
    priceAnnual: 0,
    description: 'Get started and see how Noa works.',
    badge: null,
    features: [
      { text: '1 Scholar', included: true },
      { text: 'Numeracy only', included: true },
      { text: 'Limited sessions', included: true },
      { text: 'Writing/Reading/Grammar', included: false },
    ],
  },
  {
    id: 'single',
    name: 'Single',
    priceMonthly: 19,
    priceAnnual: 190,
    save: 38,
    description: 'Full access to all features for one child.',
    badge: null,
    features: [
      { text: '1 Scholar', included: true },
      { text: 'All 4 domains', included: true },
      { text: 'Unlimited sessions', included: true },
      { text: 'AI writing feedback', included: true },
    ],
  },
  {
    id: 'family',
    name: 'Family',
    priceMonthly: 29,
    priceAnnual: 290,
    save: 58,
    description: 'The best value for multiple children.',
    badge: 'Popular',
    features: [
      { text: '2 Scholars included', included: true },
      { text: 'All 4 domains', included: true },
      { text: 'Unlimited sessions', included: true },
      { text: 'Family dashboard', included: true },
    ],
  },
];

const MembershipPage = ({ onNavigate }) => {
  const [selectedPlan, setSelectedPlan] = useState('family');
  const [isAnnual, setIsAnnual] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { updateFamilyPlan, isDemo } = useAuth();

  const getSelectedPlanDetails = () => {
    return plans.find(p => p.id === selectedPlan) || {};
  };

  const handleContinue = async () => {
    setIsLoading(true);
    
    if (!isDemo) {
      await updateFamilyPlan(selectedPlan, isAnnual ? 'annual' : 'monthly');
    }
    
    setIsLoading(false);
    onNavigate('profile_select');
  };

  const handleClaimOffer = async () => {
    setIsLoading(true);
    
    if (!isDemo) {
      // Claim offer = Family plan with trial
      await updateFamilyPlan('family', 'annual');
    }
    
    setIsLoading(false);
    onNavigate('profile_select');
  };

  const PlanCard = ({ plan }) => {
    const isSelected = selectedPlan === plan.id;
    return (
      <div 
        className={`relative bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all flex flex-col ${isSelected ? 'border-indigo-500 shadow-lg shadow-indigo-500/10' : 'border-slate-200 hover:border-slate-300'}`}
        onClick={() => setSelectedPlan(plan.id)}
      >
        {plan.badge && (
           <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold rounded-full">
            {plan.badge}
          </div>
        )}

        <h3 className="font-bold text-lg text-slate-800 text-center">{plan.name}</h3>

        <div className="text-center my-4">
          <span className="text-3xl font-bold text-slate-800">
            ${isAnnual ? plan.priceAnnual : plan.priceMonthly}
          </span>
          <span className="text-slate-500 text-sm">
            {plan.id === 'free' ? '' : isAnnual ? '/year' : '/month'}
          </span>
          {plan.id !== 'free' && isAnnual && (
            <p className="text-xs font-semibold text-emerald-600 bg-emerald-100 inline-block px-2 py-0.5 rounded-full mt-1">Save ${plan.save}</p>
          )}
        </div>
        
        <p className="text-sm text-slate-500 text-center h-10 mb-4">{plan.description}</p>
        
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-3">
              {feature.included ? (
                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              ) : (
                <X className="w-5 h-5 text-slate-300 flex-shrink-0" />
              )}
              <span className="text-sm text-slate-600">{feature.text}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-4">
            <div className={`w-5 h-5 rounded-full border-2 mx-auto flex items-center justify-center ${isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'}`}>
                {isSelected && <Check className="w-3 h-3 text-white" />}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <header className="p-6">
        <Logo />
      </header>
      <main className="px-6 py-8 max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Choose your plan</h1>
          <p className="text-slate-500 mb-6">Select the best option for your family</p>
        </div>
        
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${!isAnnual ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${isAnnual ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
            >
              Annual
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">2 months free</span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 mb-8 text-white text-center">
            <h3 className="text-xl font-bold">🚀 NAPLAN Blitz Launch Offer</h3>
            <p className="text-indigo-100 my-2">Try the full Family Plan FREE for 30 days. No credit card required.</p>
            <button 
              onClick={handleClaimOffer}
              disabled={isLoading}
              className="inline-block px-6 py-2 bg-white text-indigo-600 font-semibold rounded-xl mt-2 hover:bg-indigo-50 transition-colors text-sm disabled:opacity-50"
            >
              {isLoading ? 'Please wait...' : 'Claim Offer'}
            </button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
            {plans.map(plan => <PlanCard key={plan.id} plan={plan} />)}
        </div>

        <div className="max-w-md mx-auto">
            <PrimaryButton size="large" onClick={handleContinue} disabled={isLoading}>
              {isLoading ? 'Saving...' : `Continue with ${getSelectedPlanDetails().name} Plan`}
            </PrimaryButton>
        </div>
        
        <p className="text-center text-sm text-slate-500 mt-4">
            Cancel anytime • Plan changes apply next billing cycle
        </p>

      </main>
    </div>
  );
};

export default MembershipPage;