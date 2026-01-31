// ═══════════════════════════════════════════════════════════════
// FILE: pages/app/ChildSession.jsx
// PURPOSE: The actual learning experience - calm, adaptive, supportive
// PHILOSOPHY: "Every question is an opportunity to feel capable"
// ═══════════════════════════════════════════════════════════════
import React, { useState, useEffect } from 'react';
import { X, Pause } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext.jsx';
import { getAgeBand } from '../../lib/scholarCopy.js';
import SessionProgress from '../../components/session/SessionProgress.jsx';
import QuestionCard from '../../components/session/QuestionCard.jsx';
import { getFunctions, httpsCallable } from 'firebase/functions';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// ═══════════════════════════════════════════════════════════════
// MOCK SESSION DATA (for demo mode)
// ═══════════════════════════════════════════════════════════════
const MOCK_QUESTIONS = [
  {
    id: 'q1',
    text: 'What is 3/4 + 1/4?',
    type: 'MCQ',
    options: ['1/2', '1', '4/4', '3/4'],
    correctIndex: 1,
    domain: 'NUM',
    skill: 'Adding fractions'
  },
  {
    id: 'q2', 
    text: 'Which word is spelled correctly?',
    type: 'MCQ',
    options: ['recieve', 'receive', 'receeve', 'receve'],
    correctIndex: 1,
    domain: 'SPELL',
    skill: 'Common spelling patterns'
  },
  {
    id: 'q3',
    text: 'Read this sentence: "The dog ran quick to the park." What should "quick" be changed to?',
    type: 'MCQ',
    options: ['quickly', 'quicker', 'quickest', 'No change needed'],
    correctIndex: 0,
    domain: 'GRAM',
    skill: 'Adverbs'
  },
  {
    id: 'q4',
    text: 'What is 12 × 8?',
    type: 'MCQ',
    options: ['86', '96', '98', '94'],
    correctIndex: 1,
    domain: 'NUM',
    skill: 'Multiplication'
  },
  {
    id: 'q5',
    text: 'What is the main idea of a paragraph usually found?',
    type: 'MCQ',
    options: ['In the last sentence', 'In the first sentence', 'In the middle', 'It\'s never stated'],
    correctIndex: 1,
    domain: 'READ',
    skill: 'Main idea'
  }
];

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const ChildSession = ({ 
  scholar,
  sessionPlan = null,
  onComplete,
  onExit
}) => {
  const { isDemo } = useAuth();
  
  // Session state
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentHint, setCurrentHint] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const ageBand = getAgeBand(scholar?.yearLevel || 5);
  const currentQuestion = questions[currentIndex];

  // ═══════════════════════════════════════════════════════════════
  // LOAD SESSION
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      
      if (isDemo) {
        // Demo mode: use mock questions
        setQuestions(MOCK_QUESTIONS);
        setSessionId('demo-session-' + Date.now());
        setIsLoading(false);
        return;
      }

      try {
        // Production: fetch from session plan or create new session
        if (sessionPlan?.questions) {
          setQuestions(sessionPlan.questions);
          setSessionId(sessionPlan.sessionId);
        } else {
          // Call createSessionPlan function if needed
          const functions = getFunctions();
          const createSession = httpsCallable(functions, 'createSessionPlan');
          const result = await createSession({ 
            scholarId: scholar?.id,
            familyId: scholar?.familyId 
          });
          
          if (result.data?.questions) {
            setQuestions(result.data.questions);
            setSessionId(result.data.sessionId);
          }
        }
      } catch (error) {
        console.error('Error loading session:', error);
        // Fallback to mock for now
        setQuestions(MOCK_QUESTIONS);
        setSessionId('fallback-session-' + Date.now());
      }
      
      setIsLoading(false);
    };

    loadSession();
  }, [isDemo, sessionPlan, scholar]);

  // ═══════════════════════════════════════════════════════════════
  // HANDLE ANSWER SUBMISSION
  // ═══════════════════════════════════════════════════════════════
  const handleSubmit = async (selectedOption) => {
    setIsSubmitting(true);
    
    const response = {
      questionId: currentQuestion.id,
      selected: selectedOption,
      correct: selectedOption === currentQuestion.correctIndex,
      timestamp: Date.now(),
      hintUsed: currentHint !== null
    };

    // Store response
    const newResponses = [...responses, response];
    setResponses(newResponses);

    if (!isDemo) {
      try {
        // Submit to backend
        const functions = getFunctions();
        const submitResponse = httpsCallable(functions, 'submitResponse');
        await submitResponse({
          sessionId,
          questionId: currentQuestion.id,
          response: selectedOption,
          scholarId: scholar?.id
        });
      } catch (error) {
        console.error('Error submitting response:', error);
      }
    }

    // Brief pause for feedback
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIsSubmitting(false);
    setCurrentHint(null);

    // Move to next question or complete
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Session complete
      handleSessionComplete(newResponses);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // HANDLE HINT REQUEST
  // ═══════════════════════════════════════════════════════════════
  const handleHintRequest = async () => {
    if (isDemo) {
      // Demo mode: generic hints
      const hints = [
        "Think about what you already know about this topic.",
        "Try breaking the problem into smaller steps.",
        "Read the question again carefully.",
        "Look for key words in the question.",
        "Trust your first instinct!"
      ];
      setCurrentHint(hints[currentIndex % hints.length]);
      return;
    }

    try {
      const functions = getFunctions();
      const getHint = httpsCallable(functions, 'getAIHint');
      const result = await getHint({
        sessionId,
        questionId: currentQuestion.id,
        scholarId: scholar?.id
      });
      
      setCurrentHint(result.data?.hint || "Think step by step...");
    } catch (error) {
      console.error('Error getting hint:', error);
      setCurrentHint("Think about what you already know...");
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // HANDLE SESSION COMPLETE
  // ═══════════════════════════════════════════════════════════════
  const handleSessionComplete = async (finalResponses) => {
    const correct = finalResponses.filter(r => r.correct).length;
    const total = finalResponses.length;
    const hintsUsed = finalResponses.filter(r => r.hintUsed).length;

    const sessionResult = {
      sessionId,
      scholarName: scholar?.name || 'Scholar',
      yearLevel: scholar?.yearLevel || 5,
      duration: Math.round((Date.now() - parseInt(sessionId?.split('-')[2] || Date.now())) / 60000) || 10,
      questionsAttempted: total,
      questionsCorrect: correct,
      hintsUsed,
      focusAreas: [...new Set(questions.map(q => q.skill))].slice(0, 3),
      effortSignal: hintsUsed === 0 ? 'focused' : correct >= total * 0.7 ? 'persisted' : 'tried_hard',
      bonusAvailable: true,
      bonusUsed: false
    };

    if (!isDemo) {
      try {
        const functions = getFunctions();
        const finalise = httpsCallable(functions, 'finaliseSessionAI');
        await finalise({
          sessionId,
          scholarId: scholar?.id,
          responses: finalResponses
        });
      } catch (error) {
        console.error('Error finalising session:', error);
      }
    }

    if (onComplete) {
      onComplete(sessionResult);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // HANDLE EXIT
  // ═══════════════════════════════════════════════════════════════
  const handleExit = () => {
    if (responses.length > 0) {
      setShowExitConfirm(true);
    } else if (onExit) {
      onExit();
    }
  };

  const confirmExit = () => {
    if (onExit) onExit();
  };

  // ═══════════════════════════════════════════════════════════════
  // LOADING STATE
  // ═══════════════════════════════════════════════════════════════
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Getting your questions ready...</p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-slate-100 px-4 py-3 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={handleExit}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <SessionProgress 
            current={currentIndex + 1} 
            total={questions.length}
            ageBand={ageBand}
          />
          
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 py-8">
        <QuestionCard
          question={currentQuestion}
          ageBand={ageBand}
          onSubmit={handleSubmit}
          onHintRequest={handleHintRequest}
          isSubmitting={isSubmitting}
          hint={currentHint}
        />
      </div>

      {/* Exit confirmation modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Leave session?
            </h3>
            <p className="text-slate-500 mb-6">
              Your progress won't be saved if you leave now.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
              >
                Keep going
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChildSession;
