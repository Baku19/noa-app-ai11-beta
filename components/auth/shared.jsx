import React from 'react';
import { Star } from 'lucide-react';

/**
 * Reusable Logo component for auth screens.
 * @param {{ size?: 'default' | 'large', textColor?: string }} props
 */
export const Logo = ({ size = 'default', textColor = 'text-slate-800' }) => {
  const sizeClasses = {
    default: {
      box: 'w-9 h-9',
      icon: 'w-5 h-5',
      text: 'text-xl',
    },
    large: {
      box: 'w-12 h-12',
      icon: 'w-7 h-7',
      text: 'text-2xl',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="flex items-center gap-2">
      <div className={`${currentSize.box} bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center`}>
        <Star className={`${currentSize.icon} text-white`} fill="white" />
      </div>
      <span className={`${currentSize.text} font-bold ${textColor}`}>Noa</span>
    </div>
  );
};

/**
 * Reusable Input Field component for auth forms.
 * @param {{ label: string, type?: string, placeholder: string, icon?: React.ReactNode }} props
 */
export const InputField = ({ label, type = 'text', placeholder, icon }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
        />
      </div>
    </div>
  );
};

/**
 * Reusable Primary Button component for auth actions.
 * @param {{ children: React.ReactNode, onClick?: () => void, fullWidth?: boolean, size?: 'default' | 'large' }} props
 */
export const PrimaryButton = ({ children, onClick, fullWidth = true, size = 'default' }) => {
  const widthClass = fullWidth ? 'w-full' : 'px-8';
  const sizeClass = size === 'large' ? 'py-4 text-lg' : 'py-3';

  return (
    <button
      onClick={onClick}
      className={`${widthClass} ${sizeClass} bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
    >
      {children}
    </button>
  );
};
