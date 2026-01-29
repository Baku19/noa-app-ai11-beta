// ═══════════════════════════════════════════════════════════════
// FILE: components/settings/SettingsTabs.jsx
// PURPOSE: Tab content components for Settings page
// VERSION: 2.0 - Stripe portal integrated
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { 
  CreditCard, Users, UserPlus, Clock, Crown, Copy, Pencil, Plus,
  Shield, AlertCircle, Info, HandHeart, MessageSquareQuote, Loader2, ExternalLink
} from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../config/firebase.js';
import { ABOUT_NOA, CHILD_PROTECTION, WHAT_TO_SAY, SIBLING_COMPARISON } from '../../lib/copy.js';
import { planDetails } from '../../lib/settingsConfig.js';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// ═══════════════════════════════════════════════════════════════
// ACCOUNT TAB
// ═══════════════════════════════════════════════════════════════

export const AccountTab = ({ 
  subscription, 
  secondaryParents, 
  sessionDuration, 
  setSessionDuration, 
  notifications, 
  setNotifications, 
  setShowInviteParent,
  userProfile,
  familyName,
  isDemo
}) => {
  const currentPlan = planDetails[subscription.plan] || planDetails.free;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const openStripePortal = async () => {
    if (isDemo) {
      alert('Stripe portal is not available in demo mode');
      return;
    }
    
    if (subscription.plan === 'free') {
      alert('Upgrade flow coming soon!');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const createPortalSession = httpsCallable(functions, 'createCustomerPortalSession');
      const result = await createPortalSession({
        returnUrl: window.location.href
      });
      
      if (result.data.url) {
        window.location.href = result.data.url;
      } else {
        setError('Could not open billing portal. Please try again.');
      }
    } catch (err) {
      console.error('Stripe portal error:', err);
      setError(err.message || 'Failed to open billing portal');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* SUBSCRIPTION SECTION */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">Subscription</h2>
              <p className="text-sm text-slate-500">Manage your plan and billing</p>
            </div>
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold",
            subscription.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
          )}>
            {subscription.status === 'active' ? 'Active' : 'Inactive'}
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                <span className="text-lg font-semibold text-slate-800 capitalize">{currentPlan.name} Plan</span>
                {subscription.billingCycle && (
                  <span className="text-sm text-slate-500">({subscription.billingCycle})</span>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-1">{currentPlan.domains}</p>
            </div>
            {subscription.amount > 0 && (
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-800">${subscription.amount}</p>
                <p className="text-sm text-slate-500">/{subscription.billingCycle === 'annual' ? 'year' : 'month'}</p>
              </div>
            )}
          </div>
          {subscription.nextBillingDate && subscription.plan !== 'free' && (
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Next billing date</span>
                <span className="font-medium text-slate-800">
                  {new Date(subscription.nextBillingDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="p-3 mb-4 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          
          <div className="flex gap-3">
            <button 
              onClick={openStripePortal}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Opening...
                </>
              ) : (
                <>
                  {subscription.plan === 'free' ? 'Upgrade Plan' : 'Manage Plan'}
                  <ExternalLink className="w-4 h-4" />
                </>
              )}
            </button>
            {subscription.plan !== 'free' && (
              <button 
                onClick={openStripePortal}
                disabled={loading}
                className="px-4 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                Billing History
              </button>
            )}
          </div>
          
          {isDemo && (
            <p className="text-xs text-amber-600 mt-3 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Demo mode: Billing features disabled
            </p>
          )}
        </div>
      </section>

      {/* FAMILY ACCESS SECTION */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">Family Access</h2>
              <p className="text-sm text-slate-500">Manage parent accounts</p>
            </div>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                {userProfile?.displayName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-800">{userProfile?.displayName || 'You'}</p>
                  <span className="px-2 py-0.5 bg-indigo-200 text-indigo-700 text-xs font-medium rounded-full">Primary</span>
                </div>
                <p className="text-sm text-slate-500">Account owner • Full access</p>
              </div>
            </div>
          </div>
          {secondaryParents.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-slate-500">No secondary parents added</p>
              <p className="text-xs text-slate-400 mt-1">Invite a partner to view progress (no billing access)</p>
            </div>
          )}
          <button onClick={() => setShowInviteParent(true)} className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50/50 transition-all">
            <UserPlus className="w-5 h-5" />
            <span className="font-medium">Invite Parent</span>
          </button>
        </div>
      </section>

      {/* PREFERENCES SECTION */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">Preferences</h2>
              <p className="text-sm text-slate-500">Customize the learning experience</p>
            </div>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Daily Session Duration</p>
              <p className="text-sm text-slate-500">How long each learning session should be</p>
            </div>
            <select 
              value={sessionDuration} 
              onChange={(e) => setSessionDuration(Number(e.target.value))} 
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={20}>20 minutes</option>
              <option value={30}>30 minutes</option>
            </select>
          </div>
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Session Reminders</p>
                <p className="text-sm text-slate-500">Get notified when it's time to practice</p>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)} 
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  notifications ? "bg-indigo-600" : "bg-slate-200"
                )}
              >
                <span className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  notifications ? "translate-x-6" : "translate-x-1"
                )} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// CHILDREN TAB
// ═══════════════════════════════════════════════════════════════

export const ChildrenTab = ({ 
  scholars, 
  subscription, 
  copyToClipboard, 
  setShowEditScholar, 
  setShowAddScholar,
  isDemo 
}) => {
  const scholarsUsed = scholars.length;
  const canAddScholar = scholarsUsed < subscription.maxScholars;
  const needsUpgrade = subscription.plan !== 'family' && scholarsUsed >= subscription.maxScholars;

  return (
    <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">Scholars</h2>
            <p className="text-sm text-slate-500">Manage your children's profiles</p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
          {scholarsUsed} of {subscription.maxScholars} slots
        </div>
      </div>
      <div className="p-5 space-y-3">
        {scholars.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <p className="font-medium text-slate-700 mb-1">No scholars yet</p>
            <p className="text-sm text-slate-500 mb-4">Add your first scholar to get started</p>
            <button 
              onClick={() => setShowAddScholar(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Add Your First Scholar
            </button>
          </div>
        ) : (
          <>
            {scholars.map((scholar) => (
              <div key={scholar.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold", scholar.avatarColor || 'bg-indigo-500')}>
                    {scholar.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{scholar.name}</p>
                    <p className="text-sm text-slate-500">
                      Year {scholar.yearLevel}
                      {scholar.school && ` • ${scholar.school}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right mr-2">
                    <p className="text-xs text-slate-400">Login Code</p>
                    <div className="flex items-center gap-1">
                      <code className="text-sm font-mono font-semibold text-indigo-600">{scholar.loginCode || 'N/A'}</code>
                      {scholar.loginCode && (
                        <button onClick={() => copyToClipboard(scholar.loginCode)} className="p-1 hover:bg-slate-200 rounded transition-colors">
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      )}
                    </div>
                  </div>
                  <button onClick={() => setShowEditScholar(scholar)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                    <Pencil className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>
            ))}
            
            {canAddScholar ? (
              <button onClick={() => setShowAddScholar(true)} className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add Scholar</span>
              </button>
            ) : needsUpgrade ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800">Scholar limit reached</p>
                    <p className="text-sm text-amber-700 mt-1">Upgrade to Family plan to add more scholars.</p>
                    <button className="mt-2 px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700 transition-colors">
                      Upgrade Plan
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl text-center">
                <p className="text-sm text-slate-500">Maximum scholars reached for Family plan</p>
                <p className="text-xs text-slate-400 mt-1">Contact support if you need more slots</p>
              </div>
            )}
            
            {subscription.plan === 'family' && scholarsUsed >= subscription.includedScholars && scholarsUsed < subscription.maxScholars && (
              <p className="text-xs text-slate-500 text-center">Additional scholars are $15/month each</p>
            )}
          </>
        )}
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════
// ABOUT TAB
// ═══════════════════════════════════════════════════════════════

export const AboutTab = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
    {ABOUT_NOA.SECTIONS.map((section, index) => (
      <div key={index} className={cn(index > 0 && "pt-6 border-t border-slate-100")}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
            <Info className="w-4 h-4 text-slate-500" />
          </div>
          <h3 className="font-semibold text-slate-800 text-lg">{section.title}</h3>
        </div>
        {section.content && <p className="text-slate-600 text-sm leading-relaxed">{section.content}</p>}
        {section.items && (
          <ul className="space-y-2.5 mt-3">
            {section.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span className="text-sm text-slate-600">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// GUIDANCE TAB
// ═══════════════════════════════════════════════════════════════

export const GuidanceTab = () => (
  <div className="space-y-6">
    <section className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
          <HandHeart className="w-5 h-5 text-rose-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{CHILD_PROTECTION.TITLE}</h2>
          <p className="text-sm text-slate-500">A very important reminder</p>
        </div>
      </div>
      <p className="text-slate-600 leading-relaxed bg-rose-50 border border-rose-100 p-4 rounded-xl">{CHILD_PROTECTION.MESSAGE}</p>
    </section>

    {/* SIBLING COMPARISON WARNING */}
    <section className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
          <Users className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{SIBLING_COMPARISON.TITLE}</h2>
          <p className="text-sm text-slate-500">{SIBLING_COMPARISON.SUBTITLE}</p>
        </div>
      </div>
      <p className="text-slate-600 leading-relaxed bg-amber-50 border border-amber-100 p-4 rounded-xl">
        {SIBLING_COMPARISON.MESSAGE}
      </p>
    </section>

    <section className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
          <MessageSquareQuote className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{WHAT_TO_SAY.TITLE}</h2>
          <p className="text-sm text-slate-500">Helpful scripts for parent-child conversations</p>
        </div>
      </div>
      <div className="space-y-4 mb-6">
        {WHAT_TO_SAY.SCENARIOS.map((scenario, i) => (
          <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="font-semibold text-sm text-slate-600 mb-2">"{scenario.prompt}"</p>
            <p className="text-sm text-indigo-700 font-medium">Try saying: <span className="text-slate-800 font-normal">"{scenario.response}"</span></p>
          </div>
        ))}
      </div>
      <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
        <h3 className="font-semibold text-sm text-rose-800 mb-2">{WHAT_TO_SAY.AVOID_TITLE}</h3>
        <ul className="text-sm text-rose-700 space-y-1">
          {WHAT_TO_SAY.AVOID.map((phrase, i) => <li key={i}>• {phrase}</li>)}
        </ul>
      </div>
    </section>
  </div>
);
