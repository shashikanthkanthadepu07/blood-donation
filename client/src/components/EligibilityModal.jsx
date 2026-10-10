import React, { useState } from 'react';
import { X, Check, AlertCircle, Heart, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EligibilityModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({
    age: true,
    weight: true,
    interval: true,
    health: true
  });

  if (!isOpen) return null;

  const handleToggle = (key) => {
    setAnswers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isEligible = answers.age && answers.weight && answers.interval && answers.health;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-2 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Donor Eligibility Checker</h3>
            <p className="text-xs text-slate-500">Quick 30-second self check before donating blood</p>
          </div>
        </div>

        <div className="space-y-3.5 my-5">
          {/* Question 1 */}
          <div
            onClick={() => handleToggle('age')}
            className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition ${
              answers.age ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-slate-800">Age between 18 and 65 years?</p>
              <p className="text-xs text-slate-500">Legal minimum age for blood donation in most countries</p>
            </div>
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center transition ${
                answers.age ? 'bg-emerald-600 text-white' : 'border border-slate-300'
              }`}
            >
              {answers.age && <Check className="w-4 h-4" />}
            </div>
          </div>

          {/* Question 2 */}
          <div
            onClick={() => handleToggle('weight')}
            className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition ${
              answers.weight ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-slate-800">Weight at least 50 kg (110 lbs)?</p>
              <p className="text-xs text-slate-500">Ensures safe blood volume recovery after donation</p>
            </div>
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center transition ${
                answers.weight ? 'bg-emerald-600 text-white' : 'border border-slate-300'
              }`}
            >
              {answers.weight && <Check className="w-4 h-4" />}
            </div>
          </div>

          {/* Question 3 */}
          <div
            onClick={() => handleToggle('interval')}
            className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition ${
              answers.interval ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-slate-800">Last donation was more than 3 months (90 days) ago?</p>
              <p className="text-xs text-slate-500">Or this is your first time donating</p>
            </div>
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center transition ${
                answers.interval ? 'bg-emerald-600 text-white' : 'border border-slate-300'
              }`}
            >
              {answers.interval && <Check className="w-4 h-4" />}
            </div>
          </div>

          {/* Question 4 */}
          <div
            onClick={() => handleToggle('health')}
            className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition ${
              answers.health ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-slate-800">Feeling healthy with no active cold/fever today?</p>
              <p className="text-xs text-slate-500">Free of recent tattoos or major surgery in the past 6 months</p>
            </div>
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center transition ${
                answers.health ? 'bg-emerald-600 text-white' : 'border border-slate-300'
              }`}
            >
              {answers.health && <Check className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* Verdict Badge */}
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            isEligible
              ? 'bg-emerald-100/70 border-emerald-300 text-emerald-900'
              : 'bg-rose-100/70 border-rose-300 text-rose-900'
          }`}
        >
          {isEligible ? (
            <Heart className="w-6 h-6 text-emerald-600 fill-emerald-500 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
          )}
          <div>
            <p className="text-sm font-bold">
              {isEligible ? '🎉 You are Eligible to Donate Blood!' : 'Currently Ineligible for Donation'}
            </p>
            <p className="text-xs opacity-85">
              {isEligible
                ? 'Your donation can save up to 3 precious lives in emergency care.'
                : 'Please consult your primary healthcare physician or wait for the cooldown window.'}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800"
          >
            Close
          </button>
          {isEligible && (
            <button
              onClick={() => {
                onClose();
                navigate('/register');
              }}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-200 transition"
            >
              Register as Donor Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
