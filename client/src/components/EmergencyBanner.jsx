import React from 'react';
import { AlertTriangle, ArrowRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmergencyBanner({ requests = [] }) {
  const emergencyReqs = requests.filter((r) => r.urgency === 'Emergency' && r.status === 'Pending');

  if (emergencyReqs.length === 0) return null;

  const top = emergencyReqs[0];

  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400"></span>
          </span>
          <span className="bg-white/20 uppercase tracking-wider px-2 py-0.5 rounded text-[10px] font-bold">
            Emergency SOS
          </span>
          <p className="truncate max-w-xl">
            <strong>{top.unitsRequired - (top.unitsFulfilled || 0)} Units of {top.bloodGroup}</strong> required immediately at <strong>{top.hospitalName}</strong>, {top.city}!
          </p>
        </div>

        <Link
          to={`/requests`}
          className="inline-flex items-center gap-1 bg-white text-rose-700 hover:bg-rose-50 font-bold px-3 py-1 rounded-lg text-xs whitespace-nowrap shadow-sm transition"
        >
          View & Pledge Blood
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
