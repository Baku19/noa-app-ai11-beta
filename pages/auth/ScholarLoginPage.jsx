// ═══════════════════════════════════════════════════════════════
// FILE: pages/auth/ScholarLoginPage.jsx
// PURPOSE: Scholar login via 6-character code
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../config/firebase.js';
import { ArrowLeft, User, Loader2 } from 'lucide-react';

const ScholarLoginPage = ({ onNavigate }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCodeChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 6) {
      setCode(value);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Please enter your 6-character code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const validateCode = httpsCallable(functions, 'validateScholarCode');
      const result = await validateCode({ code });

      if (result.data.success) {
        // Store scholar session info
        sessionStorage.setItem('scholarSession', JSON.stringify({
          scholarId: result.data.scholarId,
          familyId: result.data.familyId,
          name: result.data.scholarName,
          yearLevel: result.data.yearLevel
        }));
        
        onNavigate('scholar-home', { 
          userType: 'scholar',
          scholar: {
            id: result.data.scholarId,
            name: result.data.scholarName,
            yearLevel: result.data.yearLevel
          }
        });
      } else {
        setError(result.data.error || 'Invalid code. Please try again.');
      }
    } catch (err) {
      console.error('Scholar login error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col">
      {/* Header */}
      <div className="p-4">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-indigo-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Welcome, Scholar!
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Enter your 6-character code to start learning
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Code Input */}
            <div>
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                placeholder="Enter code"
                className="w-full text-center text-3xl font-mono tracking-widest py-4 px-6 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all uppercase"
                autoFocus
                disabled={loading}
              />
              <p className="text-center text-sm text-gray-500 mt-2">
                Ask your parent for your code
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-center text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={code.length !== 6 || loading}
              className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <span>Start Learning</span>
              )}
            </button>
          </form>

          {/* Parent Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Are you a parent?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-indigo-600 font-medium hover:underline"
              >
                Log in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarLoginPage;
