import React, { useState } from 'react';
import { X, CheckCircle, Info, HeartHandshake } from 'lucide-react';

const COMPATIBILITY_RULES = {
  'O-': {
    canGiveTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-'],
    label: 'Universal Red Blood Cell Donor',
    badge: 'bg-emerald-100 text-emerald-800'
  },
  'O+': {
    canGiveTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O+', 'O-'],
    label: 'Most Common Blood Type',
    badge: 'bg-blue-100 text-blue-800'
  },
  'A-': {
    canGiveTo: ['A-', 'A+', 'AB-', 'AB+'],
    canReceiveFrom: ['A-', 'O-'],
    label: 'Rare Negative Type',
    badge: 'bg-purple-100 text-purple-800'
  },
  'A+': {
    canGiveTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
    label: 'Second Most Common Blood Type',
    badge: 'bg-blue-100 text-blue-800'
  },
  'B-': {
    canGiveTo: ['B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['B-', 'O-'],
    label: 'Rare Negative Type',
    badge: 'bg-amber-100 text-amber-800'
  },
  'B+': {
    canGiveTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
    label: 'High Demand in Asian Populations',
    badge: 'bg-blue-100 text-blue-800'
  },
  'AB-': {
    canGiveTo: ['AB-', 'AB+'],
    canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    label: 'Rarest Blood Type (<1% population)',
    badge: 'bg-rose-100 text-rose-800'
  },
  'AB+': {
    canGiveTo: ['AB+'],
    canReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    label: 'Universal Recipient',
    badge: 'bg-indigo-100 text-indigo-800'
  }
};

export default function BloodCompatibilityModal({ isOpen, onClose, initialType = 'O-' }) {
  const [selectedType, setSelectedType] = useState(initialType);

  if (!isOpen) return null;

  const bloodGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  const current = COMPATIBILITY_RULES[selectedType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-2 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Blood Group Compatibility Guide</h3>
            <p className="text-sm text-slate-500">Select any blood type to inspect donor and recipient compatibility</p>
          </div>
        </div>

        {/* Blood Type Selector Pills */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 my-5">
          {bloodGroups.map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedType(bg)}
              className={`py-2 px-3 rounded-xl font-bold text-sm transition-all duration-200 border ${
                selectedType === bg
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-200 scale-105'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50 hover:border-rose-300'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>

        {/* Selected Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-rose-600">{selectedType}</span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${current.badge}`}>
                {current.label}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Can Donate To */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Can Donate Blood To:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {current.canGiveTo.map((type) => (
                  <span
                    key={type}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-sm font-bold border border-emerald-200"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            {/* Can Receive From */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5 mb-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                Can Receive Blood From:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {current.canReceiveFrom.map((type) => (
                  <span
                    key={type}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 text-sm font-bold border border-blue-200"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Did You Know Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Emergency Fact:</strong> Type <strong>O- negative</strong> blood is called the universal red blood cell donor because it has neither A nor B antigens and no Rh factor, making it safe for transfusion in urgent trauma cases before blood matching is completed!
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
