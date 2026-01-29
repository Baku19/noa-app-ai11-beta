// ═══════════════════════════════════════════════════════════════
// FILE: lib/settingsConfig.js
// PURPOSE: Settings mock data and configuration constants
// ═══════════════════════════════════════════════════════════════

// Mock data - will be replaced with Firestore data
export const mockSubscription = {
  plan: 'family',
  status: 'active',
  billingCycle: 'annual',
  nextBillingDate: '2027-01-26',
  amount: 290,
  includedScholars: 2,
  addOnScholars: 0,
  maxScholars: 5,
};

export const mockScholars = [
  { id: '1', name: 'Emma', yearLevel: 5, school: 'Sydney Primary School', loginCode: 'ABC123', avatarColor: 'bg-emerald-500' },
  { id: '2', name: 'Oliver', yearLevel: 3, school: 'Sydney Primary School', loginCode: 'XYZ789', avatarColor: 'bg-sky-500' },
];

export const mockSecondaryParents = [];

export const planDetails = {
  free: { name: 'Free', scholars: 1, domains: 'Numeracy only', price: 0 },
  single: { name: 'Single', scholars: 1, domains: 'All 4 domains', price: 19 },
  family: { name: 'Family', scholars: 2, domains: 'All 4 domains', price: 29 },
};

export const avatarColors = [
  { name: 'Emerald', value: 'bg-emerald-500' },
  { name: 'Sky', value: 'bg-sky-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Orange', value: 'bg-orange-500' },
  { name: 'Rose', value: 'bg-rose-500' },
  { name: 'Slate', value: 'bg-slate-600' },
];

export const yearLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// Generate login code
export const generateLoginCode = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};
