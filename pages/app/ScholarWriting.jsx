// ═══════════════════════════════════════════════════════════════
// FILE: pages/app/ScholarWriting.jsx
// PURPOSE: Scholar's writing practice experience
// PHILOSOPHY: "Writing is hard. Make it feel safe."
// ═══════════════════════════════════════════════════════════════
//
// Key principles:
// - One prompt at a time (no overwhelm)
// - Age-adaptive language and complexity
// - Encouragement over correction
// - Save progress automatically
// - Celebrate completion, not perfection
//
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { 
  PenLine, 
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { getAgeBand } from '../../lib/scholarCopy.js';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// ═══════════════════════════════════════════════════════════════
// AGE-ADAPTIVE COPY
// ═══════════════════════════════════════════════════════════════

const WRITING_COPY = {
  early: {
    pageTitle: "Writing",
    pageSubtitle: "Tell your story!",
    emptyTitle: "Ready to write something?",
    emptySubtitle: "Pick a prompt and let's write!",
    startButton: "Start writing!",
    promptLabel: "Today's writing prompt:",
    tipLabel: "Writing tip:",
    wordCountLabel: "words so far",
    submitButton: "I'm done!",
    saveMessage: "Saved! ✓",
    encouragement: [
      "Great start! Keep going! 🌟",
      "You're doing awesome!",
      "Nice words! What happens next?",
    ],
  },
  middle: {
    pageTitle: "Writing Practice",
    pageSubtitle: "Build your writing skills",
    emptyTitle: "Ready to write?",
    emptySubtitle: "Choose a prompt to get started.",
    startButton: "Start writing",
    promptLabel: "Your prompt:",
    tipLabel: "Tip:",
    wordCountLabel: "words",
    submitButton: "Submit",
    saveMessage: "Saved",
    encouragement: [
      "Good progress! Keep it up.",
      "You're building something good here.",
      "Nice work so far!",
    ],
  },
  transition: {
    pageTitle: "Writing",
    pageSubtitle: "Practice different writing styles",
    emptyTitle: "Ready to write?",
    emptySubtitle: "Select a prompt to begin.",
    startButton: "Begin",
    promptLabel: "Prompt:",
    tipLabel: "Tip:",
    wordCountLabel: "words",
    submitButton: "Submit",
    saveMessage: "Saved",
    encouragement: [
      "Solid progress.",
      "Looking good so far.",
    ],
  },
  senior: {
    pageTitle: "Writing",
    pageSubtitle: "Practice and refine",
    emptyTitle: "Start writing",
    emptySubtitle: "Choose your prompt.",
    startButton: "Start",
    promptLabel: "Prompt:",
    tipLabel: "Tip:",
    wordCountLabel: "words",
    submitButton: "Submit",
    saveMessage: "Saved",
    encouragement: [
      "Good progress.",
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
// WRITING PROMPTS (Sample)
// ═══════════════════════════════════════════════════════════════

const SAMPLE_PROMPTS = {
  early: [
    {
      id: 1,
      type: 'narrative',
      prompt: "Write about a magical adventure with your favourite animal.",
      tip: "Start with 'One sunny day...' and tell us what happened!",
      minWords: 50,
    },
    {
      id: 2,
      type: 'descriptive',
      prompt: "Describe your dream playground. What would it look like?",
      tip: "Use words that help us see, hear, and feel the playground!",
      minWords: 40,
    },
  ],
  middle: [
    {
      id: 1,
      type: 'narrative',
      prompt: "Write a story about discovering a hidden door in your school.",
      tip: "Think about: Who finds it? What's behind it? What happens next?",
      minWords: 100,
    },
    {
      id: 2,
      type: 'persuasive',
      prompt: "Should students have longer lunch breaks? Write your opinion.",
      tip: "Give at least two reasons to support your argument.",
      minWords: 80,
    },
  ],
  transition: [
    {
      id: 1,
      type: 'narrative',
      prompt: "Write a story that begins: 'The message arrived at midnight.'",
      tip: "Build tension slowly. Show, don't tell.",
      minWords: 150,
    },
    {
      id: 2,
      type: 'persuasive',
      prompt: "Should mobile phones be allowed in classrooms? Argue your position.",
      tip: "Address counter-arguments to strengthen your case.",
      minWords: 120,
    },
  ],
  senior: [
    {
      id: 1,
      type: 'narrative',
      prompt: "Write a story exploring the theme of identity. Begin however you choose.",
      tip: "Consider using symbolism or metaphor to convey deeper meaning.",
      minWords: 200,
    },
    {
      id: 2,
      type: 'persuasive',
      prompt: "Social media does more harm than good for teenagers. Discuss.",
      tip: "Structure: Introduction, body paragraphs with evidence, conclusion.",
      minWords: 180,
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// SIMPLE NOA AVATAR (Placeholder)
// ═══════════════════════════════════════════════════════════════

const NoaAvatar = ({ size = 48 }) => (
  <div 
    className="rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20"
    style={{ width: size, height: size }}
  >
    <span style={{ fontSize: size * 0.5 }}>🦊</span>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// EMPTY STATE
// ═══════════════════════════════════════════════════════════════

const WritingEmptyState = ({ copy, prompts, onSelectPrompt }) => (
  <div className="flex flex-col items-center justify-center text-center py-12 px-6">
    <NoaAvatar size={80} />
    <h3 className="mt-6 text-xl font-semibold text-slate-800">
      {copy.emptyTitle}
    </h3>
    <p className="text-slate-500 mt-2 mb-8">
      {copy.emptySubtitle}
    </p>

    {/* Prompt options */}
    <div className="w-full max-w-md space-y-3">
      {prompts.map(prompt => (
        <button
          key={prompt.id}
          onClick={() => onSelectPrompt(prompt)}
          className={cn(
            "w-full p-4 rounded-xl bg-white border border-slate-200 text-left",
            "hover:border-violet-300 hover:shadow-md transition-all",
            "group"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-violet-100 text-violet-700 capitalize">
              {prompt.type}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-violet-500 transition-colors" />
          </div>
          <p className="text-slate-700 line-clamp-2">{prompt.prompt}</p>
        </button>
      ))}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// WRITING INTERFACE
// ═══════════════════════════════════════════════════════════════

const WritingInterface = ({ prompt, copy, ageBand, onSubmit, onBack }) => {
  const [text, setText] = useState('');
  const [showTip, setShowTip] = useState(true);
  const [saved, setSaved] = useState(false);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const progress = Math.min(100, (wordCount / prompt.minWords) * 100);
  const canSubmit = wordCount >= prompt.minWords * 0.8; // 80% of minimum

  // Auto-save simulation
  React.useEffect(() => {
    if (text.length > 0) {
      const timer = setTimeout(() => setSaved(true), 1000);
      return () => clearTimeout(timer);
    }
    setSaved(false);
  }, [text]);

  // Random encouragement
  const encouragement = copy.encouragement[Math.floor(Math.random() * copy.encouragement.length)];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Prompt Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-violet-100 text-violet-700 capitalize">
            {prompt.type}
          </span>
          <button 
            onClick={onBack}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            ← Different prompt
          </button>
        </div>
        
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">
          {copy.promptLabel}
        </p>
        <p className="text-lg text-slate-800 font-medium">
          {prompt.prompt}
        </p>
      </div>

      {/* Tip (collapsible) */}
      {showTip && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100 mb-6">
          <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-amber-800">
              <span className="font-medium">{copy.tipLabel}</span> {prompt.tip}
            </p>
          </div>
          <button 
            onClick={() => setShowTip(false)}
            className="text-amber-400 hover:text-amber-600 text-sm"
          >
            Hide
          </button>
        </div>
      )}

      {/* Writing Area */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={ageBand === 'early' ? "Start writing here..." : "Begin writing..."}
          className={cn(
            "w-full min-h-[300px] p-4 rounded-xl border border-slate-200",
            "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent",
            "text-slate-700 leading-relaxed resize-none",
            ageBand === 'early' ? "text-lg" : "text-base"
          )}
        />

        {/* Progress bar */}
        <div className="mt-4 mb-2">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-300",
                progress >= 100 ? "bg-emerald-500" : "bg-violet-500"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">
              <span className="font-semibold text-slate-700">{wordCount}</span> {copy.wordCountLabel}
              {prompt.minWords && (
                <span className="text-slate-400"> / {prompt.minWords} min</span>
              )}
            </span>
            {saved && (
              <span className="text-sm text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                {copy.saveMessage}
              </span>
            )}
          </div>

          {/* Encouragement (if writing) */}
          {wordCount > 10 && wordCount < prompt.minWords && (
            <span className="text-sm text-violet-600">{encouragement}</span>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={() => onSubmit(text)}
          disabled={!canSubmit}
          className={cn(
            "px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2",
            canSubmit
              ? "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-500/30"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          )}
        >
          {copy.submitButton}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPLETION SCREEN
// ═══════════════════════════════════════════════════════════════

const CompletionScreen = ({ ageBand, onNewPrompt, onExit }) => {
  const messages = {
    early: { title: "You did it! 🎉", subtitle: "Great job finishing your writing!" },
    middle: { title: "Nice work!", subtitle: "Your writing has been saved." },
    transition: { title: "Done", subtitle: "Your writing has been submitted." },
    senior: { title: "Submitted", subtitle: "Your writing is saved." },
  };

  const msg = messages[ageBand];

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <NoaAvatar size={100} />
      <h2 className="mt-6 text-2xl font-bold text-slate-800">{msg.title}</h2>
      <p className="text-slate-500 mt-2">{msg.subtitle}</p>

      <div className="flex gap-4 mt-8">
        <button
          onClick={onNewPrompt}
          className="px-6 py-3 rounded-xl font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
        >
          Write another
        </button>
        <button
          onClick={onExit}
          className="px-6 py-3 rounded-xl font-medium bg-violet-600 text-white hover:bg-violet-700 transition-all"
        >
          Done for now
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const ScholarWriting = ({ 
  scholar = { name: 'Emma', yearLevel: 5 },
  onNavigateHome
}) => {
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const ageBand = getAgeBand(scholar.yearLevel);
  const copy = WRITING_COPY[ageBand];
  const prompts = SAMPLE_PROMPTS[ageBand];

  const handleSubmit = (text) => {
    // In production: save to database
    console.log('Submitted:', text);
    setIsComplete(true);
  };

  const handleNewPrompt = () => {
    setSelectedPrompt(null);
    setIsComplete(false);
  };

  const handleExit = () => {
    if (onNavigateHome) onNavigateHome();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className={cn(
            "font-bold text-slate-800",
            ageBand === 'early' ? "text-3xl" : "text-2xl"
          )}>
            {copy.pageTitle}
          </h1>
          <p className="text-slate-500 mt-1">{copy.pageSubtitle}</p>
        </div>

        {/* Content */}
        {isComplete ? (
          <CompletionScreen 
            ageBand={ageBand} 
            onNewPrompt={handleNewPrompt} 
            onExit={handleExit}
          />
        ) : selectedPrompt ? (
          <WritingInterface
            prompt={selectedPrompt}
            copy={copy}
            ageBand={ageBand}
            onSubmit={handleSubmit}
            onBack={() => setSelectedPrompt(null)}
          />
        ) : (
          <WritingEmptyState
            copy={copy}
            prompts={prompts}
            onSelectPrompt={setSelectedPrompt}
          />
        )}

      </div>
    </div>
  );
};

export default ScholarWriting;