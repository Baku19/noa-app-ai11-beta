// ═══════════════════════════════════════════════════════════════
// FILE: components/settings/EditScholarModal.jsx
// PURPOSE: Modal for editing scholar profiles with delete confirmation
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { X, Copy, RefreshCw, Trash2 } from 'lucide-react';
import SchoolSearch from '../app/SchoolSearch.jsx';
import { avatarColors, yearLevels } from '../../lib/settingsConfig.js';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const EditScholarModal = ({ scholar, onClose, onSave, onDelete, onRegenerateCode }) => {
  const [name, setName] = useState(scholar.name);
  const [dateOfBirth, setDateOfBirth] = useState(scholar.dateOfBirth || '');
  const [yearLevel, setYearLevel] = useState(scholar.yearLevel);
  const [school, setSchool] = useState(scholar.school ? { name: scholar.school } : null);
  const [avatarColor, setAvatarColor] = useState(scholar.avatarColor);
  const [errors, setErrors] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!yearLevel) newErrors.yearLevel = 'School year is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    onSave({
      ...scholar,
      name: name.trim(),
      dateOfBirth: dateOfBirth || null,
      yearLevel: Number(yearLevel),
      school: school?.name || null,
      schoolData: school,
      avatarColor,
    });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(scholar.loginCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // Delete confirmation screen
  if (showDeleteConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-rose-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Delete Scholar?</h2>
            <p className="text-slate-500 mb-6">
              Are you sure you want to remove <strong>{scholar.name}</strong>? 
              All their learning history and progress will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onDelete(scholar.id)}
                className="flex-1 px-4 py-3 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
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
            <h2 className="text-xl font-bold text-slate-800">Edit Scholar</h2>
            <p className="text-sm text-slate-500">Update {scholar.name}'s profile</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Login Code Section */}
        <div className="p-5 bg-indigo-50 border-b border-indigo-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-900">Login Code</p>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-2xl font-mono font-bold text-indigo-600 tracking-wider">
                  {scholar.loginCode}
                </code>
                <button onClick={copyCode} className="p-1.5 hover:bg-indigo-100 rounded-lg transition-colors">
                  {codeCopied ? (
                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <Copy className="w-5 h-5 text-indigo-400" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onRegenerateCode(scholar.id)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </button>
          </div>
          <p className="text-xs text-indigo-600 mt-2">
            Share this code with your child to log in. Regenerating will invalidate the old code.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
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

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-3 border border-rose-200 text-rose-600 font-semibold rounded-xl hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditScholarModal;
