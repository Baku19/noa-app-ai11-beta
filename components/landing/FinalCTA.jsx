import React from 'react';
import { ArrowRight } from 'lucide-react';

const FinalCTA = ({ onNavigate }) => {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Give your child the confidence they deserve
        </h2>
        <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
          Join thousands of Australian families using Noa to turn NAPLAN prep from stressful to successful.
        </p>
        <button 
          onClick={() => onNavigate('signup')}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-600 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          Start Free Trial
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-indigo-200 text-sm mt-6">
          30-day free trial • No credit card required • Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;