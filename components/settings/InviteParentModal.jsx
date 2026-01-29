// ═══════════════════════════════════════════════════════════════
// FILE: components/settings/InviteParentModal.jsx
// PURPOSE: Modal for inviting secondary parents (via Cloud Function)
// VERSION: 2.0 - Cloud Function integrated
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { X, Mail, Shield, AlertCircle } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../config/firebase.js';
import { useAuth } from '../../lib/AuthContext.jsx';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const InviteParentModal = ({ onClose, onInvite, existingParents }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [relation, setRelation] = useState('');
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  
  const { isDemo } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    } else if (existingParents?.some(p => p.email?.toLowerCase() === email.toLowerCase())) {
      newErrors.email = 'This parent is already invited';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSending(true);
    setErrors({});

    if (isDemo) {
      // Demo mode: simulate success
      setTimeout(() => {
        setSending(false);
        setSent(true);
        setInviteCode('DEMO99');
        onInvite({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          relation: relation || null,
          inviteCode: 'DEMO99',
          invitedAt: new Date().toISOString(),
          status: 'pending',
        });
      }, 1500);
      return;
    }

    try {
      const sendInvite = httpsCallable(functions, 'sendParentInvite');
      const result = await sendInvite({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        relation: relation || null
      });

      if (result.data.success) {
        setSent(true);
        setInviteCode(result.data.inviteCode || '');
        onInvite({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          relation: relation || null,
          inviteCode: result.data.inviteCode,
          invitedAt: new Date().toISOString(),
          status: 'pending',
        });
      } else {
        setErrors({ submit: result.data.error || 'Failed to send invite' });
      }
    } catch (error) {
      console.error('Error sending invite:', error);
      setErrors({ submit: error.message || 'Failed to send invite. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  // Success state
  if (sent) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Invite Sent!</h2>
          <p className="text-slate-500 mb-6">
            We've sent an invitation to <strong>{email}</strong>. 
            They'll receive an email with instructions to join your family account.
          </p>
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <p className="text-xs text-slate-500 mb-1">Invite expires in 7 days</p>
            {inviteCode && (
              <>
                <p className="text-sm text-slate-600">They can also use this code to sign up:</p>
                <p className="text-xl font-mono font-bold text-indigo-600 mt-2">{inviteCode}</p>
              </>
            )}
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
      <div className="bg-white rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Invite Parent</h2>
            <p className="text-sm text-slate-500">Give a partner access to view progress</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="mx-5 mt-5 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-indigo-900">What they can do:</p>
              <ul className="text-indigo-700 mt-1 space-y-0.5">
                <li>• View all children's progress & insights</li>
                <li>• Review session history & writing</li>
                <li>• Adjust learning preferences</li>
              </ul>
              <p className="font-medium text-indigo-900 mt-2">What they cannot do:</p>
              <ul className="text-indigo-700 mt-1 space-y-0.5">
                <li>• Access billing or subscription</li>
                <li>• Delete scholars or account</li>
                <li>• Invite other parents</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
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
              Demo mode: Email won't be sent
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Their Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter their name"
              disabled={sending}
              className={cn(
                "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400",
                errors.name ? "border-rose-300 bg-rose-50" : "border-slate-200"
              )}
            />
            {errors.name && <p className="text-sm text-rose-600 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="partner@email.com"
              disabled={sending}
              className={cn(
                "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400",
                errors.email ? "border-rose-300 bg-rose-50" : "border-slate-200"
              )}
            />
            {errors.email && <p className="text-sm text-rose-600 mt-1">{errors.email}</p>}
          </div>

          {/* Relation (Optional) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Relation <span className="text-slate-400">(optional)</span>
            </label>
            <select
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              disabled={sending}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="">Select relation</option>
              <option value="mother">Mother</option>
              <option value="father">Father</option>
              <option value="guardian">Guardian</option>
              <option value="grandparent">Grandparent</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Send Invite
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteParentModal;
