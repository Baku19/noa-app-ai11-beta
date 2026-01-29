import React from 'react';
import { Star } from 'lucide-react';

const Footer = () => {
  const productLinks = ["Features", "Pricing", "How it Works", "FAQ"];
  const companyLinks = ["About Us", "Contact", "Blog", "Careers"];
  const legalLinks = ["Privacy Policy", "Terms of Service", "Cookie Policy"];

  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Column 1 - Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="font-bold text-xl text-white">Noa</span>
            </div>
            <p className="text-slate-400 text-sm">
              AI-powered learning companion helping Australian students thrive in NAPLAN and beyond.
            </p>
          </div>

          {/* Column 2 - Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {productLinks.map(link => (
                <li key={link}><a href="#" className="text-sm text-slate-400 hover:text-white">{link}</a></li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map(link => (
                <li key={link}><a href="#" className="text-sm text-slate-400 hover:text-white">{link}</a></li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map(link => (
                <li key={link}><a href="#" className="text-sm text-slate-400 hover:text-white">{link}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500 order-2 sm:order-1 text-center sm:text-left">
            © 2026 Noa Learning Pty Ltd. All rights reserved.
          </p>
          <p className="text-xs text-slate-600 order-1 sm:order-2 text-center sm:text-right max-w-lg">
            Noa provides practice assessments and indicative feedback aligned to the Australian Curriculum. It is not affiliated with ACARA and does not provide official NAPLAN scoring.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
