import React from 'react';
import { Clock, Check, Info, Calendar, Timer, Lock, Crown, Brain } from 'lucide-react';
import ChildDropdown from '../../components/app/ChildDropdown.jsx';
import { WELCOME, SESSION, BASELINE } from '../../lib/copy.js';

// --- MOCK DATA ---
const MOCK_CHILDREN = [
  { id: '1', name: 'Emma', year_level: 5, avatar_color: 'bg-emerald-500', login_code: 'EMMA5K' },
  { id: '2', name: 'Oliver', year_level: 3, avatar_color: 'bg-sky-500', login_code: 'OLIV3R' },
];

const MOCK_WHY_TOPICS = [
    { topic: 'Word Problems', domain: 'Numeracy', reason: 'Needs Practice', color: 'bg-amber-100 text-amber-700' },
    { topic: 'Vocabulary in Context', domain: 'Reading', reason: 'Continue Practice', color: 'bg-slate-100 text-slate-600' },
    { topic: 'Descriptive Language', domain: 'Writing', reason: 'Introduce New Skill', color: 'bg-amber-100 text-amber-700' },
]

const MOCK_COMING_UP = [
    { 
        domain: 'Numeracy', 
        dotColor: 'bg-indigo-500', 
        title: 'Building confidence with fractions', 
        topics: ['Fractions', 'Mixed Numbers'], 
        duration: 20, 
        date: 'Jan 18' 
    },
    { 
        domain: 'Reading', 
        dotColor: 'bg-emerald-500', 
        title: 'Strengthening reading comprehension', 
        topics: ['Comprehension', 'Inference'], 
        duration: 20, 
        date: 'Jan 18' 
    },
]

// --- LOCAL COMPONENTS ---
const WhyTopicCard = ({ item }) => (
    <div className="flex items-center justify-between py-3">
        <div>
            <p className="font-medium text-slate-700">{item.topic}</p>
            <p className="text-sm text-slate-500">{item.domain}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.color}`}>
            {item.reason}
        </span>
    </div>
);

const ComingUpCard = ({ plan }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${plan.dotColor}`}></span>
                <span className="font-semibold text-slate-700">{plan.domain}</span>
            </div>
            <span className="text-xs text-slate-500 border border-slate-200 px-2.5 py-1 rounded-full font-medium">Planned</span>
        </div>
        <h3 className="font-semibold text-slate-800 mb-3">{plan.title}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
            {plan.topics.map(topic => (
                <span key={topic} className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-medium">{topic}</span>
            ))}
        </div>
        <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-100">
           <div className="flex items-center gap-2">
                <Timer className="w-4 h-4" />
                <span>{plan.duration} min</span>
           </div>
           <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{plan.date}</span>
           </div>
        </div>
    </div>
);


// --- MAIN LEARNING PLAN PAGE ---

const LearningPlan = ({ selectedChild, setSelectedChild, onNavigate }) => {
  // Mock subscription - will come from context/Firestore
  const subscription = { plan: 'free' }; // Change to 'single' or 'family' to test
  const isFreePlan = subscription.plan === 'free';

  // Locked domains for free plan
  const lockedDomains = ['reading', 'writing', 'grammar_punctuation'];
  const isDomainLocked = (domain) => isFreePlan && lockedDomains.includes(domain.toLowerCase().replace(/ & /g, '_'));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-6 lg:p-8">
        {/* Header Row */}
        <header className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Learning Plan</h1>
            <p className="text-slate-500 mt-1">Personalised sessions for {selectedChild.name}</p>
          </div>
          <div className="w-full sm:w-auto sm:min-w-[200px]">
            <ChildDropdown children={MOCK_CHILDREN} selectedChild={selectedChild} onSelect={setSelectedChild} />
          </div>
        </header>

        {isFreePlan && (
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Crown className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-amber-900">Free Plan - Numeracy Only</p>
                <p className="text-sm text-amber-700 mt-0.5">
                  Upgrade to access Reading, Writing, and Grammar & Punctuation domains.
                </p>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        {/* Baseline Explanation Banner */}
        {selectedChild && !selectedChild.baselineComplete && (
          <div className="mb-6 p-5 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-violet-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-violet-900 mb-1">Getting to Know {selectedChild.name}</h3>
                <p className="text-violet-700 text-sm leading-relaxed">
                  {BASELINE.HEADLINE(selectedChild.name)} Early patterns will settle as more learning happens.
                </p>
                <p className="text-violet-600 text-xs mt-2 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  This is guided learning — not a test.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Daily Recommendation Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl p-5 text-white mb-8 flex items-center justify-between">
            <div className='flex items-center gap-5'>
                <Clock className="w-10 h-10 text-indigo-300 flex-shrink-0" />
                <div>
                    <p className="font-semibold text-indigo-100 text-sm">Daily Recommendation</p>
                    <h2 className="text-2xl font-bold">~20 minutes of learning</h2>
                    <p className="text-indigo-100 text-sm mt-1 max-w-sm">Short, focused sessions work best. We recommend completing 1-2 sessions per day.</p>
                </div>
            </div>
            <div className="text-center flex-shrink-0 ml-4">
                <p className="text-6xl font-bold">2</p>
                <p className="text-indigo-100 font-medium">Sessions Ready</p>
            </div>
        </div>

        {/* Today's Learning Section */}
        <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>
                <h2 className="text-lg font-bold text-slate-800">Today's Learning</h2>
                <span className="text-slate-400 font-medium">Sunday, January 25</span>
            </div>
            {/* All Done State */}
            <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">{WELCOME.ALL_DONE.TITLE}</h3>
                <p className="text-slate-500 mt-1">Great job, {selectedChild.name}! {WELCOME.ALL_DONE.SUBTITLE}</p>
                <button
                  onClick={() => onNavigate('topic_strengths')}
                  className="text-sm text-violet-600 font-semibold mt-4 inline-block hover:text-violet-700">
                    {WELCOME.ALL_DONE.CTA}
                </button>
            </div>
        </section>

        {/* Why These Sessions */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
                <Info className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-lg text-slate-800">Why These Sessions?</h3>
            </div>
            <div className="divide-y divide-slate-100">
                {MOCK_WHY_TOPICS.map(item => (
                    isDomainLocked(item.domain) ? (
                        <div key={item.topic} className="relative">
                           <div className="absolute inset-0 bg-white/90 backdrop-blur-[1px] rounded-xl z-10 flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                                <Lock className="w-5 h-5 text-slate-400 mb-1" />
                                <p className="text-sm font-medium text-slate-600 capitalize">{item.domain}</p>
                                <p className="text-xs text-slate-400 mb-2">Free plan: Numeracy only</p>
                                <button className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1">
                                    <Crown className="w-3 h-3" />
                                    Upgrade to unlock
                                </button>
                            </div>
                            <div className="opacity-40 pointer-events-none">
                                <WhyTopicCard item={item} />
                            </div>
                        </div>
                    ) : (
                        <WhyTopicCard key={item.topic} item={item} />
                    )
                ))}
            </div>
            <p className="text-xs text-slate-400 mt-4 pt-4 border-t border-slate-100">
                Sessions are personalised based on {selectedChild.name}'s performance, targeting areas that need practice while building on strengths.
            </p>
        </section>

        {/* Coming Up Section */}
        <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Coming Up</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {MOCK_COMING_UP.map(plan => (
                     isDomainLocked(plan.domain) ? (
                        <div key={plan.title} className="relative">
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-[1px] rounded-xl z-10 flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                                <Lock className="w-5 h-5 text-slate-400 mb-1" />
                                <p className="text-sm font-medium text-slate-600 capitalize">{plan.domain}</p>
                                <p className="text-xs text-slate-400 mb-2">Free plan: Numeracy only</p>
                                <button className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1">
                                    <Crown className="w-3 h-3" />
                                    Upgrade to unlock
                                </button>
                            </div>
                            <div className="opacity-40 pointer-events-none">
                                <ComingUpCard plan={plan} />
                            </div>
                        </div>
                     ) : (
                        <ComingUpCard key={plan.title} plan={plan} />
                     )
                ))}
            </div>
            <p className="text-center text-xs text-slate-400 mt-4">
              {SESSION.JUSTIFICATION}
            </p>
        </section>

      </div>
    </div>
  );
};

export default LearningPlan;