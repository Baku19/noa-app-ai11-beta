// ═══════════════════════════════════════════════════════════════
// FILE: pages/app/QuestionReview.jsx
// PURPOSE: Parents can see actual questions their child attempted
// PHILOSOPHY: Transparency builds trust
// ═══════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Filter,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  BookOpen,
  Calculator,
  PenLine,
  Search
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext.jsx';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// ═══════════════════════════════════════════════════════════════
// MOCK DATA (for demo mode)
// ═══════════════════════════════════════════════════════════════
const MOCK_QUESTIONS = [
  {
    id: 'q1',
    date: '2026-01-30',
    domain: 'NUM',
    skill: 'Adding fractions',
    text: 'What is 3/4 + 1/4?',
    type: 'MCQ',
    options: ['1/2', '1', '4/4', '3/4'],
    correctIndex: 1,
    childAnswer: 1,
    correct: true,
    hintUsed: false,
    explanation: 'When adding fractions with the same denominator, add the numerators: 3 + 1 = 4. So 3/4 + 1/4 = 4/4 = 1.'
  },
  {
    id: 'q2',
    date: '2026-01-30',
    domain: 'SPELL',
    skill: 'Common spelling patterns',
    text: 'Which word is spelled correctly?',
    type: 'MCQ',
    options: ['recieve', 'receive', 'receeve', 'receve'],
    correctIndex: 1,
    childAnswer: 0,
    correct: false,
    hintUsed: true,
    explanation: 'Remember the rule: "i before e, except after c". Since there\'s a c, the e comes before i: receive.'
  },
  {
    id: 'q3',
    date: '2026-01-30',
    domain: 'GRAM',
    skill: 'Adverbs',
    text: 'Read this sentence: "The dog ran quick to the park." What should "quick" be changed to?',
    type: 'MCQ',
    options: ['quickly', 'quicker', 'quickest', 'No change needed'],
    correctIndex: 0,
    childAnswer: 0,
    correct: true,
    hintUsed: false,
    explanation: 'Adverbs modify verbs. "Quickly" is the adverb form that describes how the dog ran.'
  },
  {
    id: 'q4',
    date: '2026-01-29',
    domain: 'NUM',
    skill: 'Multiplication',
    text: 'What is 12 × 8?',
    type: 'MCQ',
    options: ['86', '96', '98', '94'],
    correctIndex: 1,
    childAnswer: 2,
    correct: false,
    hintUsed: false,
    explanation: '12 × 8 = 96. A helpful trick: 12 × 8 = (10 × 8) + (2 × 8) = 80 + 16 = 96.'
  },
  {
    id: 'q5',
    date: '2026-01-29',
    domain: 'READ',
    skill: 'Main idea',
    text: 'What is the main idea of a paragraph usually found?',
    type: 'MCQ',
    options: ['In the last sentence', 'In the first sentence', 'In the middle', 'It\'s never stated'],
    correctIndex: 1,
    childAnswer: 1,
    correct: true,
    hintUsed: false,
    explanation: 'The main idea is usually stated in the topic sentence, which is typically the first sentence of a paragraph.'
  },
  {
    id: 'q6',
    date: '2026-01-28',
    domain: 'NUM',
    skill: 'Fractions',
    text: 'Which fraction is equivalent to 1/2?',
    type: 'MCQ',
    options: ['2/3', '3/6', '2/5', '4/6'],
    correctIndex: 1,
    childAnswer: 1,
    correct: true,
    hintUsed: false,
    explanation: '3/6 simplifies to 1/2 because both numerator and denominator can be divided by 3.'
  }
];

const DOMAIN_CONFIG = {
  NUM: { label: 'Numeracy', icon: Calculator, color: 'text-blue-600 bg-blue-50' },
  READ: { label: 'Reading', icon: BookOpen, color: 'text-emerald-600 bg-emerald-50' },
  WRITE: { label: 'Writing', icon: PenLine, color: 'text-purple-600 bg-purple-50' },
  GRAM: { label: 'Grammar', icon: PenLine, color: 'text-amber-600 bg-amber-50' },
  SPELL: { label: 'Spelling', icon: BookOpen, color: 'text-rose-600 bg-rose-50' }
};

// ═══════════════════════════════════════════════════════════════
// QUESTION ITEM COMPONENT
// ═══════════════════════════════════════════════════════════════
const QuestionItem = ({ question, expanded, onToggle }) => {
  const domain = DOMAIN_CONFIG[question.domain] || DOMAIN_CONFIG.NUM;
  const DomainIcon = domain.icon;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header - always visible */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-start gap-3 text-left hover:bg-slate-50 transition-colors"
      >
        {/* Status icon */}
        <div className="mt-1">
          {question.correct ? (
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-500" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-slate-800 font-medium line-clamp-2">{question.text}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", domain.color)}>
              <DomainIcon className="w-3 h-3" />
              {domain.label}
            </span>
            <span className="text-xs text-slate-400">{question.skill}</span>
            {question.hintUsed && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                <Lightbulb className="w-3 h-3" />
                Hint used
              </span>
            )}
          </div>
        </div>

        {/* Expand icon */}
        <div className="mt-1">
          {expanded ? (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-100">
          {/* Options */}
          {question.options && (
            <div className="mt-4 space-y-2">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-3 rounded-lg text-sm flex items-center gap-2",
                    index === question.correctIndex && "bg-emerald-50 border border-emerald-200",
                    index === question.childAnswer && index !== question.correctIndex && "bg-rose-50 border border-rose-200",
                    index !== question.correctIndex && index !== question.childAnswer && "bg-slate-50"
                  )}
                >
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                    index === question.correctIndex ? "bg-emerald-500 text-white" :
                    index === question.childAnswer ? "bg-rose-500 text-white" :
                    "bg-slate-200 text-slate-600"
                  )}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className={cn(
                    index === question.correctIndex ? "text-emerald-800" :
                    index === question.childAnswer && index !== question.correctIndex ? "text-rose-800" :
                    "text-slate-600"
                  )}>
                    {option}
                  </span>
                  {index === question.correctIndex && (
                    <span className="ml-auto text-xs text-emerald-600 font-medium">Correct answer</span>
                  )}
                  {index === question.childAnswer && index !== question.correctIndex && (
                    <span className="ml-auto text-xs text-rose-600 font-medium">Child's answer</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Explanation */}
          {question.explanation && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-1">Explanation</p>
              <p className="text-sm text-blue-700">{question.explanation}</p>
            </div>
          )}

          {/* Date */}
          <p className="mt-3 text-xs text-slate-400">Attempted on {question.date}</p>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const QuestionReview = ({ 
  selectedChild,
  setSelectedChild,
  childrenList = []
}) => {
  const { isDemo } = useAuth();
  
  const [filter, setFilter] = useState('all'); // all, correct, incorrect
  const [domainFilter, setDomainFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get questions (demo or real)
  const questions = isDemo ? MOCK_QUESTIONS : []; // TODO: Fetch from Firestore

  // Apply filters
  const filteredQuestions = questions.filter(q => {
    if (filter === 'correct' && !q.correct) return false;
    if (filter === 'incorrect' && q.correct) return false;
    if (domainFilter !== 'all' && q.domain !== domainFilter) return false;
    if (searchQuery && !q.text.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Stats
  const stats = {
    total: questions.length,
    correct: questions.filter(q => q.correct).length,
    incorrect: questions.filter(q => !q.correct).length,
    hintsUsed: questions.filter(q => q.hintUsed).length
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-800">Question Review</h1>
          <p className="text-slate-500 mt-1">See the actual questions and how your child answered</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 text-center border border-slate-200">
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
            <p className="text-xs text-slate-500">Total</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-slate-200">
            <p className="text-2xl font-bold text-emerald-600">{stats.correct}</p>
            <p className="text-xs text-slate-500">Correct</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-slate-200">
            <p className="text-2xl font-bold text-rose-600">{stats.incorrect}</p>
            <p className="text-xs text-slate-500">Incorrect</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-slate-200">
            <p className="text-2xl font-bold text-amber-600">{stats.hintsUsed}</p>
            <p className="text-xs text-slate-500">Hints</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 mb-6">
          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Status filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All answers</option>
              <option value="correct">Correct only</option>
              <option value="incorrect">Incorrect only</option>
            </select>

            {/* Domain filter */}
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All subjects</option>
              <option value="NUM">Numeracy</option>
              <option value="READ">Reading</option>
              <option value="WRITE">Writing</option>
              <option value="GRAM">Grammar</option>
              <option value="SPELL">Spelling</option>
            </select>
          </div>
        </div>

        {/* Question list */}
        <div className="space-y-3">
          {filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
              <p className="text-slate-500">No questions match your filters</p>
            </div>
          ) : (
            filteredQuestions.map(question => (
              <QuestionItem
                key={question.id}
                question={question}
                expanded={expandedId === question.id}
                onToggle={() => setExpandedId(expandedId === question.id ? null : question.id)}
              />
            ))
          )}
        </div>

        {/* Info note */}
        <div className="mt-6 p-4 bg-slate-100 rounded-xl">
          <p className="text-sm text-slate-600">
            <strong>Tip:</strong> Click on any question to see the full details, including what your child answered and the correct explanation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionReview;
