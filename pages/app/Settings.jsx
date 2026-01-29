// ═══════════════════════════════════════════════════════════════
// FILE: pages/app/Settings.jsx
// PURPOSE: Main Settings page with real Firestore data
// VERSION: 2.0 - Cloud Functions integrated
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { Settings as SettingsIcon, Users, Info, BookUser } from 'lucide-react';
import { SETTINGS_TABS } from '../../lib/copy.js';
import { useAuth } from '../../lib/AuthContext.jsx';

// Tab components
import { AccountTab, ChildrenTab, AboutTab, GuidanceTab } from '../../components/settings/SettingsTabs.jsx';

// Modal components
import AddScholarModal from '../../components/settings/AddScholarModal.jsx';
import EditScholarModal from '../../components/settings/EditScholarModal.jsx';
import InviteParentModal from '../../components/settings/InviteParentModal.jsx';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// Plan limits
const getPlanLimits = (plan) => {
  switch(plan) {
    case 'free': return { maxScholars: 1, includedScholars: 1 };
    case 'single': return { maxScholars: 1, includedScholars: 1 };
    case 'family': return { maxScholars: 5, includedScholars: 2 };
    default: return { maxScholars: 1, includedScholars: 1 };
  }
};

export default function Settings() {
  const { family, scholars, userProfile, isDemo, refreshScholars } = useAuth();
  
  // Build subscription object from family data
  const planLimits = getPlanLimits(family?.plan || 'free');
  const subscription = {
    plan: family?.plan || 'free',
    status: family?.status || 'active',
    billingCycle: family?.billingCycle || 'monthly',
    nextBillingDate: family?.nextBillingDate || new Date(Date.now() + 30*24*60*60*1000).toISOString(),
    amount: family?.amount || 0,
    includedScholars: family?.includedScholars || planLimits.includedScholars,
    maxScholars: family?.maxScholars || planLimits.maxScholars,
  };

  // Secondary parents (placeholder for now)
  const [secondaryParents] = useState([]);
  
  // Preferences state
  const [sessionDuration, setSessionDuration] = useState(20);
  const [notifications, setNotifications] = useState(true);
  
  // Modal state
  const [showAddScholar, setShowAddScholar] = useState(false);
  const [showEditScholar, setShowEditScholar] = useState(null);
  const [showInviteParent, setShowInviteParent] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState('account');

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    // Would show toast notification
  };

  const handleScholarSaved = async () => {
    await refreshScholars();
    setShowAddScholar(false);
    setShowEditScholar(null);
  };

  const TABS = [
    { id: 'account', label: SETTINGS_TABS.ACCOUNT, icon: SettingsIcon },
    { id: 'children', label: SETTINGS_TABS.CHILDREN, icon: Users },
    { id: 'about', label: SETTINGS_TABS.ABOUT, icon: Info },
    { id: 'guidance', label: SETTINGS_TABS.GUIDANCE, icon: BookUser },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'account':
        return (
          <AccountTab 
            subscription={subscription} 
            secondaryParents={secondaryParents} 
            sessionDuration={sessionDuration} 
            setSessionDuration={setSessionDuration} 
            notifications={notifications} 
            setNotifications={setNotifications}
            setShowInviteParent={setShowInviteParent}
            userProfile={userProfile}
            familyName={family?.familyName || 'Your Family'}
            isDemo={isDemo}
          />
        );
      case 'children':
        return (
          <ChildrenTab 
            scholars={scholars} 
            subscription={subscription} 
            copyToClipboard={copyToClipboard} 
            setShowEditScholar={setShowEditScholar} 
            setShowAddScholar={setShowAddScholar}
            isDemo={isDemo}
          />
        );
      case 'about':
        return <AboutTab />;
      case 'guidance':
        return <GuidanceTab />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your subscription, scholars, and preferences</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2',
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                )}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {renderContent()}

      {/* MODALS */}
      {showAddScholar && (
        <AddScholarModal 
          onClose={() => setShowAddScholar(false)}
          onSave={handleScholarSaved}
          scholarsUsed={scholars.length}
          scholarsLimit={subscription.maxScholars}
          plan={subscription.plan}
        />
      )}
      
      {showEditScholar && (
        <EditScholarModal 
          scholar={showEditScholar}
          onClose={() => setShowEditScholar(null)}
          onSave={handleScholarSaved}
          onDelete={handleScholarSaved}
          onRegenerateCode={(id) => { 
            console.log('Regenerate code for:', id); 
          }}
          isDemo={isDemo}
        />
      )}
      
      {showInviteParent && (
        <InviteParentModal 
          onClose={() => setShowInviteParent(false)}
          onInvite={(data) => { 
            console.log('Invite parent:', data); 
            setShowInviteParent(false); 
          }}
          existingParents={secondaryParents}
        />
      )}
    </div>
  );
}
