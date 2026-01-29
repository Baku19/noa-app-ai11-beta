import React, { useState } from 'react';
import { Calendar, Star, ChevronDown, Users, Info } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext.jsx';
import ChildDropdown from '../../components/app/ChildDropdown.jsx';

// ═══════════════════════════════════════════════════════════════
// EMPTY STATES
// ═══════════════════════════════════════════════════════════════

const NoScholarsYet = () => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mb-6">
      <Users className="w-10 h-10 text-amber-500" />
    </div>
    <h2 className="text-xl font-bold text-slate-800 mb-2">No Scholars Yet</h2>
    <p className="text-slate-500 max-w-sm">
      Add a scholar to start reviewing their writing.
    </p>
  </div>
);

const NoWritingYet = ({ childName }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
    <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <Star className="w-8 h-8 text-amber-500" />
    </div>
    <h3 className="text-lg font-semibold text-slate-800 mb-2">
      No writing samples yet
    </h3>
    <p className="text-slate-500 max-w-md mx-auto mb-4">
      When {childName} completes writing activities, their work will appear here with AI-powered feedback and suggestions.
    </p>
    <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
      <Info className="w-4 h-4" />
      <span>Writing activities are included in practice sessions</span>
    </div>
  </div>
);

// --- MOCK DATA ---

const MOCK_WRITING_LIST = [
    { id: '1', title: 'A Day at the Beach', type: 'Narrative', date: 'Jan 15', improvements: 4, status: 'reviewed' },
    { id: '2', title: 'Why We Should Have Longer Lunch Breaks', type: 'Persuasive', date: 'Jan 12', improvements: 3, status: 'reviewed' },
];

const MOCK_WRITING_DETAIL = {
    '1': {
        prompt: "Write a narrative about a memorable day at the beach. Include descriptive language and show how the character feels.",
        original: "We went to the beach. It was hot. The water was nice. I made a sandcastle and it was big. Then we ate lunch. I had a sandwich. The day was fun and I liked it.",
        improved: "The hot summer sun beat down on us as we arrived at the golden beach. The water sparkled invitingly, cool and refreshing against my toes. I spent hours building an enormous sandcastle, complete with towers and a moat. When lunchtime came, I devoured my sandwich hungrily, sand crunching between my teeth. It was one of those perfect days that I'll remember forever.",
        changes: [
            { id: 'c1', category: 'structure', before: 'We went to the beach. It was hot.', after: 'The hot summer sun beat down on us as we arrived at the golden beach.', why: 'Combining sentences and adding sensory detail makes the writing more engaging.' },
            { id: 'c2', category: 'vocabulary', before: 'The water was nice.', after: 'The water sparkled invitingly, cool and refreshing against my toes.', why: 'Using stronger adjectives and adding physical sensation creates a clearer picture.' },
            { id: 'c3', category: 'vocabulary', before: 'I made a sandcastle and it was big.', after: 'I spent hours building an enormous sandcastle, complete with towers and a moat.', why: 'More descriptive words like "enormous" and adding details like "towers and a moat" make the image stronger.' },
            { id: 'c4', category: 'structure', before: 'The day was fun and I liked it.', after: 'It was one of those perfect days that I\'ll remember forever.', why: 'This creates a more powerful and conclusive final sentence that summarises the feeling of the day.' },
        ]
    },
    '2': {
        prompt: "Write a persuasive piece on why your school should have longer lunch breaks.",
        original: "We should have longer lunch breaks. It would be good. We could play more. We could also eat our food slower. It is not long enough now. Please make it longer.",
        improved: "Extending our lunch break is essential for student well-being and focus. A longer break would provide adequate time to play and socialise, which is crucial for development. Furthermore, it would allow us to eat our meals without rushing, improving digestion and health. The current short break leaves us feeling hurried and unprepared for afternoon classes. A longer lunch is a necessary change for a better school day.",
        changes: [
             { id: 'c1', category: 'structure', before: 'We should have longer lunch breaks. It would be good.', after: 'Extending our lunch break is essential for student well--being and focus.', why: 'Starts with a stronger, more formal thesis statement.' },
             { id: 'c2', category: 'vocabulary', before: 'We could play more.', after: 'A longer break would provide adequate time to play and socialise, which is crucial for development.', why: 'Expands the idea and uses more persuasive language like "crucial for development".' },
             { id: 'c3', category: 'structure', before: 'Please make it longer.', after: 'A longer lunch is a necessary change for a better school day.', why: 'Provides a concluding sentence that summarises the argument effectively.' },
        ]
    }
}


// --- MAIN WRITING PAGE ---

const Writing = ({ selectedChild, setSelectedChild, childrenList = [] }) => {
  const { isDemo } = useAuth();
  const [selectedId, setSelectedId] = useState('1');

  // No scholars - show empty state
  if (!selectedChild || childrenList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto p-6 lg:p-8">
          <header className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Writing Review</h1>
            <p className="text-slate-500">Review your child's writing with AI-powered feedback</p>
          </header>
          <NoScholarsYet />
        </div>
      </div>
    );
  }

  // For real users without writing data, show empty state
  // Demo mode always has data via MOCK_WRITING_LIST
  if (!isDemo) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto p-6 lg:p-8">
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Writing Review</h1>
              <p className="text-slate-500">Review {selectedChild.name}'s writing with AI-powered feedback</p>
            </div>
            {childrenList.length > 1 && (
              <ChildDropdown 
                children={childrenList}
                selectedChild={selectedChild}
                onSelect={setSelectedChild}
              />
            )}
          </header>
          <NoWritingYet childName={selectedChild.name} />
        </div>
      </div>
    );
  }

  const selectedWriting = MOCK_WRITING_LIST.find(w => w.id === selectedId);
  const selectedDetail = MOCK_WRITING_DETAIL[selectedId];

  const ChangeItem = ({ change }) => {
    const categoryStyles = {
        structure: 'bg-indigo-500 text-white',
        vocabulary: 'bg-amber-500 text-white',
    };
    return (
        <div className="py-4">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mb-3 inline-block ${categoryStyles[change.category] || 'bg-slate-500 text-white'}`}>
                {change.category.charAt(0).toUpperCase() + change.category.slice(1)}
            </span>
            <div className="grid md:grid-cols-2 gap-3 mb-3">
                <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs font-bold text-slate-500 mb-1">BEFORE</p>
                    <p className="text-sm text-slate-700">{change.before}</p>
                </div>
                 <div className="bg-indigo-600 rounded-lg p-3 text-white">
                    <p className="text-xs font-bold text-indigo-100 mb-1">AFTER</p>
                    <p className="text-sm">{change.after}</p>
                </div>
            </div>
            <p className="text-sm text-slate-600">{change.why}</p>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header Row */}
        <header className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Writing Review</h1>
            <p className="text-slate-500 mt-1">Review your child's writing with AI-powered feedback</p>
          </div>
          {childrenList.length > 1 && (
            <div className="w-full sm:w-auto sm:min-w-[200px]">
              <ChildDropdown children={childrenList} selectedChild={selectedChild} onSelect={setSelectedChild} />
            </div>
          )}
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-3xl font-bold text-slate-800">2</p>
                <p className="text-sm font-medium text-slate-500">Total Pieces</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-3xl font-bold text-indigo-600">2</p>
                <p className="text-sm font-medium text-slate-500">Reviewed</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-3xl font-bold text-slate-400">0</p>
                <p className="text-sm font-medium text-slate-500">In Progress</p>
            </div>
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - List */}
            <aside>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Writing Assignments</h2>
                <div className="space-y-3">
                    {MOCK_WRITING_LIST.map(item => (
                        <div key={item.id} onClick={() => setSelectedId(item.id)}
                             className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${selectedId === item.id ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-slate-300'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full border border-slate-200 text-slate-600">{item.type}</span>
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">Reviewed</span>
                            </div>
                            <p className="font-medium text-slate-800">{item.title}</p>
                            <div className="flex items-center justify-between mt-3">
                                <span className="flex items-center gap-1.5 text-xs text-slate-400"><Calendar className="w-3.5 h-3.5"/>{item.date}</span>
                                <span className="text-xs text-indigo-600 font-semibold">{item.improvements} improvements made</span>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Right Column - Detail */}
            <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-slate-800">{selectedWriting.title}</h2>
                        <span className="text-sm font-medium px-3 py-1 rounded-full bg-amber-100 text-amber-700">{selectedWriting.type}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">Submitted on {selectedWriting.date}</p>
                </div>
                
                <div className="bg-slate-100 rounded-xl p-4">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Writing Prompt</p>
                    <p className="text-slate-700">{selectedDetail.prompt}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                            <h3 className="font-semibold text-slate-700">Original Writing</h3>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-sm">{selectedDetail.original}</p>
                    </div>
                    <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-5">
                         <div className="flex items-center gap-2 mb-3">
                            <Star className="w-4 h-4 text-indigo-500" />
                            <h3 className="font-semibold text-indigo-800">Improved Version</h3>
                        </div>
                        <p className="text-slate-800 leading-relaxed text-sm">{selectedDetail.improved}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5">
                     <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-lg text-slate-800">What Changed & Why</h3>
                            <p className="text-sm text-slate-500">{selectedDetail.changes.length} micro-improvements made</p>
                        </div>
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                     </div>
                     <div className="divide-y divide-slate-100">
                        {selectedDetail.changes.map(change => <ChangeItem key={change.id} change={change} />)}
                     </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Writing;