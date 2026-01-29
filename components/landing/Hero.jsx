import React from 'react';
import { ChevronRight, ArrowRight, Play, Cpu, BookCheck, GraduationCap, Clock, TrendingUp } from 'lucide-react';

const Hero = ({ onNavigate }) => {
  // NAPLAN 2026 starts March 11
  const getCountdown = () => {
    const naplanDate = new Date('2026-03-11T00:00:00+11:00');
    const now = new Date();
    const diffTime = naplanDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysUntilNaplan = getCountdown();

  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-slate-50 via-white to-indigo-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <button 
              onClick={() => onNavigate('signup')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-6 group hover:from-indigo-200 hover:to-purple-200 transition-colors"
            >
              <span role="img" aria-label="rocket">🚀</span>
              <span className="text-sm font-semibold text-indigo-700">
                NAPLAN Blitz: 30 Days Free — {daysUntilNaplan} days until NAPLAN
              </span>
              <ChevronRight className="w-4 h-4 text-indigo-500 transform group-hover:translate-x-1 transition-transform" />
            </button>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Help your child
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> thrive </span>
              with adaptive learning
            </h1>

            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Noa is an Adaptive Learning Companion powered by a comprehensive system of 7 unique AI modules working together — building your child's confidence and skills through personalised practice aligned to the Australian Curriculum.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={() => onNavigate('signup')}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg rounded-xl shadow-lg shadow-indigo-500/25 transition-shadow hover:shadow-xl"
              >
                Start 30-Day Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-semibold text-lg rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
                <Play className="w-5 h-5" />
                Watch a Demo
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-500" />
                <span>7 Adaptive AI Modules</span>
              </div>
              <div className="flex items-center gap-2">
                <BookCheck className="w-5 h-5 text-indigo-500" />
                <span>Australian Curriculum v9.0</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-500" />
                <span>Years 1-9</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                <span>20-30 mins/day</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span>Incremental improvement</span>
              </div>
            </div>
          </div>

          <div className="relative mt-10 lg:mt-0">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="font-bold text-lg text-slate-800">Emma's Dashboard</h2>
                  <p className="text-sm text-slate-500">Year 5</p>
                </div>
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-white text-lg">E</div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center my-6">
                <div><p className="text-2xl font-bold text-slate-800">3</p><p className="text-xs text-slate-500">Strengths</p></div>
                <div><p className="text-2xl font-bold text-slate-800">3</p><p className="text-xs text-slate-500">Emerging</p></div>
                <div><p className="text-2xl font-bold text-slate-800">2</p><p className="text-xs text-slate-500">Focus</p></div>
                <div><p className="text-2xl font-bold text-slate-800">12</p><p className="text-xs text-slate-500">Sessions</p></div>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-50/70 border-l-4 border-emerald-500">
                  <p className="font-semibold text-sm text-slate-800">Strength: Fractions</p>
                  <p className="text-sm text-slate-600 mt-1">Emma is consistently scoring above 90% in identifying and comparing fractions.</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50/70 border-l-4 border-amber-500">
                  <p className="font-semibold text-sm text-slate-800">Emerging: Geometry</p>
                  <p className="text-sm text-slate-600 mt-1">Let's work on 2D shapes and their properties. Suggest starting a new lesson.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;