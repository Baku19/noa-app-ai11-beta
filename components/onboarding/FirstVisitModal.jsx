import React, { useState, useEffect } from 'react';
import { LIMITATIONS, CHILD_PROTECTION } from '../../lib/copy.js';

/**
 * Manages the state for the one-time first visit modal flow.
 * Uses localStorage to ensure it's only shown once.
 * @returns {{step: number, nextStep: () => void}}
 */
export const useFirstVisit = () => {
  // 0=checking, 1=limitations, 2=protection, 3=done
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      const isComplete = localStorage.getItem('noa_first_visit_complete');
      if (isComplete === 'true') {
        setStep(3); // Done
      } else {
        setStep(1); // Start flow
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
      setStep(1); // Proceed with flow if localStorage is unavailable
    }
  }, []);

  const nextStep = () => {
    const newStep = step + 1;
    if (newStep === 3) {
      try {
        localStorage.setItem('noa_first_visit_complete', 'true');
      } catch (error) {
        console.error("Could not write to localStorage:", error);
      }
    }
    setStep(newStep);
  };

  return { step, nextStep };
};

/**
 * Renders the two-step onboarding modal flow for first-time users.
 */
const FirstVisitFlow = ({ step, nextStep }) => {
  if (step === 0 || step === 3) {
    return null;
  }

  const ModalWrapper = ({ children }) => (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl mx-4">
        {children}
      </div>
    </div>
  );

  if (step === 1) {
    return (
      <ModalWrapper>
        <h2 className="text-lg font-semibold text-slate-800 mb-2">{LIMITATIONS.TITLE}</h2>
        <p className="text-sm text-slate-600 mb-4">{LIMITATIONS.INTRO}</p>
        
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">{LIMITATIONS.CANNOT_TITLE}</h3>
          <ul className="space-y-2.5">
            {LIMITATIONS.ITEMS.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span className="text-sm text-slate-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={nextStep}
          className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-colors"
        >
          {LIMITATIONS.CTA}
        </button>
      </ModalWrapper>
    );
  }
  
  if (step === 2) {
    return (
      <ModalWrapper>
        <h2 className="text-lg font-semibold text-slate-800 mb-2">{CHILD_PROTECTION.TITLE}</h2>
        <p className="text-sm text-slate-600 mb-6">{CHILD_PROTECTION.MESSAGE}</p>
        <button
          onClick={nextStep}
          className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-colors"
        >
          {CHILD_PROTECTION.CTA}
        </button>
      </ModalWrapper>
    );
  }

  return null;
};

export default FirstVisitFlow;
