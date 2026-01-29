// ═══════════════════════════════════════════════════════════════
// FILE: components/settings/AddScholarModal.jsx
// PURPOSE: Modal for adding new scholar profiles (via Cloud Function)
// VERSION: 4.0 - Cloud Function integrated
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { X, AlertCircle, Copy, Check } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../config/firebase.js';
import SchoolSearch from '../app/SchoolSearch.jsx';
import { avatarColors, yearLevels } from '../../lib/settingsConfig.js';
import { useAuth } from '../../lib/AuthContext.jsx';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// Helper: Get session duration based on year level
const getSessionMinutes = (yearLevel) => {
  const year = Number(yearLevel);
  if (year <= 4) return 20;
  if (year <= 6) return 25;
  return 30;
};

const AddScholarModal = ({ onClose, onSave, scholarsUsed, scholarsLimit, plan }) => {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [school, setSchool] = useState(null);
  const [avatarColor, setAvatarColor] = useState('bg-emerald-500');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [copied, setCopied] = useState(false);
  
  const { isDemo, refreshScholars } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!yearLevel) newErrors.yearLevel = 'School year is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const copyCode = () => {
    if (success?.loginCode) {
      navigator.clipboard.writeText(success.loginCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    setErrors({});

    const scholarData = {
      name: name.trim(),
      dateOfBirth: dateOfBirth || null,
      yearLevel: Number(yearLevel),
      school: school?.name || null,
      schoolData: school || null,
      avatarColor,
      settings: {
        dailySessionMinutes: getSessionMinutes(yearLevel),
        notificationsEnabled: true
      }
    };

    if (isDemo) {
      // Demo mode: simulate success
      setIsLoading(false);
      setSuccess({
        scholarName: scholarData.name,
        loginCode: 'DEMO01'
      });
      onSave({ ...scholarData, loginCode: 'DEMO01' });
      return;
    }

    try {
      const generateCode = httpsCallable(functions, 'generateScholarCode');
      const result = await generateCode({ scholarData });

      if (result.data.success) {
        setSuccess({
          scholarName: result.data.scholarName,
          loginCode: result.data.loginCode,
          scholarId: result.data.scholarId
        });
        await refreshScholars();
        onSave({ ...scholarData, loginCode: result.data.loginCode });
      } else {
        setErrors({ submit: result.data.error || 'Failed to add scholar' });
      }
    } catch (error) {
      console.error('Error adding scholar:', error);
      setErrors({ submit: error.message || 'Failed to add scholar. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Scholar Added!</h2>
          <p className="text-slate-500 mb-6">
            {success.scholarName} can now log in using their code
          </p>
          
          {/* Login Code Display */}
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <p className="text-xs text-slate-500 mb-2">Login Code</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-mono font-bold tracking-widest text-indigo-600">
                {success.loginCode}
              </span>
              <button
                onClick={copyCode}
                className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                title="Copy code"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Copy className="w-5 h-5 text-slate-400" />
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Share this code with your child to let them log in
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Add Scholar</h2>
            <p className="text-sm text-slate-500">{scholarsUsed} of {scholarsLimit} slots used</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.submit}
            </div>
          )}

          {/* Demo Mode Notice */}
          {isDemo && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-amber-700 text-sm">
              <AlertCircle className="w-4 h-4" />
              Demo mode: Changes won't be saved
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter child's first name"
              className={cn(
                "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500",
                errors.name ? "border-rose-300 bg-rose-50" : "border-slate-200"
              )}
            />
            {errors.name && <p className="text-sm text-rose-600 mt-1">{errors.name}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* School Year */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              School Year <span className="text-rose-500">*</span>
            </label>
            <select
              value={yearLevel}
              onChange={(e) => setYearLevel(e.target.value)}
              className={cn(
                "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white",
                errors.yearLevel ? "border-rose-300 bg-rose-50" : "border-slate-200"
              )}
            >
              <option value="">Select year level</option>
              {yearLevels.map((year) => (
                <option key={year} value={year}>Year {year}</option>
              ))}
            </select>
            {errors.yearLevel && <p className="text-sm text-rose-600 mt-1">{errors.yearLevel}</p>}
            {plan === 'free' && (
              <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Free plan: Only Numeracy domain available
              </p>
            )}
            {yearLevel && (
              <p className="text-xs text-slate-500 mt-1.5">
                Session duration: {getSessionMinutes(yearLevel)} minutes (based on year level)
              </p>
            )}
          </div>

          {/* School Search */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">School</label>
            <SchoolSearch value={school} onChange={setSchool} placeholder="Search for school..." />
          </div>

          {/* Avatar Color */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Avatar Color</label>
            <div className="flex flex-wrap gap-3">
              {avatarColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setAvatarColor(color.value)}
                  className={cn(
                    "w-10 h-10 rounded-xl transition-all flex items-center justify-center",
                    color.value,
                    avatarColor === color.value ? "ring-2 ring-offset-2 ring-indigo-500 scale-110" : "hover:scale-105"
                  )}
                >
                  {avatarColor === color.value && (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-2">Preview</p>
            <div className="flex items-center gap-3">
              <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl font-bold", avatarColor)}>
                {name ? name.charAt(0).toUpperCase() : '?'}
              </div>
              <div>
                <p className="font-semibold text-slate-800">{name || 'Scholar Name'}</p>
                <p className="text-sm text-slate-500">
                  {yearLevel ? `Year ${yearLevel}` : 'Year level'}
                  {school?.name && ` • ${school.name}`}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add Scholar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddScholarModal;
