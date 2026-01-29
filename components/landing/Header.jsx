import React from 'react';
import { Star, GraduationCap } from 'lucide-react';

const Header = ({ onNavigate }) => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: "How it Works", sectionId: "how-it-works" },
    { label: "Features", sectionId: "features" },
    { label: "Pricing", sectionId: "pricing" },
    { label: "FAQ", sectionId: "faq" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <Star className="w-6 h-6 text-white" fill="white" />
          </div>
          <span className="font-bold text-xl text-slate-800">Noa</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.sectionId)}
              className="text-slate-600 hover:text-indigo-600 font-medium bg-transparent border-none cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Scholar Login */}
          <button
            onClick={() => onNavigate('scholar-login')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Scholar</span>
          </button>
          
          {/* Parent Sign In */}
          <button
            onClick={() => onNavigate('login')}
            className="hidden sm:block px-4 py-2 text-slate-700 font-medium hover:text-indigo-600 transition-colors"
          >
            Sign In
          </button>
          
          {/* Start Free Trial */}
          <button
            onClick={() => onNavigate('signup')}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-shadow"
          >
            Start Free Trial
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
