// ═══════════════════════════════════════════════════════════════
// FILE: components/session/QuestionCard.jsx
// PURPOSE: Display a single question - calm, focused, supportive
// ═══════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { Lightbulb, Check, ChevronRight } from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const QuestionCard = ({
  question,
  ageBand = 'middle',
  onSubmit,
  onHintRequest,
  isSubmitting = false,
  hint = null
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const handleOptionSelect = (optionIndex) => {
    if (!isSubmitting) {
      setSelectedOption(optionIndex);
    }
  };

  const handleSubmit = () => {
    if (selectedOption !== null && onSubmit) {
      onSubmit(selectedOption);
    }
  };

  const handleHint = () => {
    if (onHintRequest && !hint) {
      onHintRequest();
    }
    setShowHint(true);
  };

  // Age-appropriate sizing
  const textSize = ageBand === 'early' ? 'text-xl' : 'text-lg';
  const optionSize = ageBand === 'early' ? 'text-lg p-4' : 'text-base p-3';
  const buttonSize = ageBand === 'early' ? 'text-lg py-4 px-8' : 'text-base py-3 px-6';

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Question text */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
        <p className={cn("text-slate-800 font-medium leading-relaxed", textSize)}>
          {question?.text || 'Loading question...'}
        </p>
        
        {/* Question context/stimulus if present */}
        {question?.stimulus && (
          <div className="mt-4 p-4 bg-slate-50 rounded-xl text-slate-600 text-sm">
            {question.stimulus}
          </div>
        )}
      </div>

      {/* Options (for MCQ) */}
      {question?.type === 'MCQ' && question?.options && (
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              disabled={isSubmitting}
              className={cn(
                "w-full text-left rounded-xl border-2 transition-all",
                optionSize,
                selectedOption === index
                  ? "border-indigo-500 bg-indigo-50 text-indigo-900"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
            >
              <span className="flex items-center gap-3">
                <span className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  selectedOption === index
                    ? "bg-indigo-500 text-white"
                    : "bg-slate-100 text-slate-500"
                )}>
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Short answer input */}
      {question?.type === 'SHORT' && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Type your answer..."
            className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-lg"
            onChange={(e) => setSelectedOption(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      )}

      {/* Hint section */}
      <div className="mb-6">
        {!showHint ? (
          <button
            onClick={handleHint}
            className="flex items-center gap-2 text-slate-400 hover:text-amber-500 transition-colors text-sm"
          >
            <Lightbulb className="w-4 h-4" />
            Need a hint?
          </button>
        ) : (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 mt-0.5" />
              <p className="text-amber-800 text-sm">
                {hint || 'Think about what you already know about this topic...'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={selectedOption === null || isSubmitting}
        className={cn(
          "w-full rounded-xl font-semibold transition-all",
          buttonSize,
          selectedOption !== null && !isSubmitting
            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
            : "bg-slate-100 text-slate-400 cursor-not-allowed"
        )}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Checking...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Next
            <ChevronRight className="w-5 h-5" />
          </span>
        )}
      </button>
    </div>
  );
};

export default QuestionCard;
