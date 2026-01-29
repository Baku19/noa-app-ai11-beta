import React, { useState } from 'react';

import Header from '../components/landing/Header.jsx';
import Hero from '../components/landing/Hero.jsx';
import SocialProof from '../components/landing/SocialProof.jsx';
import ProblemSolution from '../components/landing/ProblemSolution.jsx';
import HowItWorks from '../components/landing/HowItWorks.jsx';
import Features from '../components/landing/Features.jsx';
import Testimonials from '../components/landing/Testimonials.jsx';
import Pricing from '../components/landing/Pricing.jsx';
import FAQ from '../components/landing/FAQ.jsx';
import FinalCTA from '../components/landing/FinalCTA.jsx';
import Footer from '../components/landing/Footer.jsx';

export default function LandingPage({ onNavigate }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="font-sans antialiased">
      <Header onNavigate={onNavigate} />
      <main>
        <Hero onNavigate={onNavigate} />
        <SocialProof />
        <ProblemSolution />
        <HowItWorks />
        <Features />
        <Testimonials />
        <Pricing isAnnual={isAnnual} setIsAnnual={setIsAnnual} onNavigate={onNavigate} />
        <FAQ openFaq={openFaq} setOpenFaq={setOpenFaq} />
        <FinalCTA onNavigate={onNavigate} />
      </main>
      <Footer />
    </div>
  );
}
