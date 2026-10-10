import React from 'react';
import { Heart, Droplet, Phone, Shield, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-900">
                <Droplet className="w-5 h-5 fill-white" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">LifeFlow</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every two seconds, someone needs blood. LifeFlow bridges the critical gap between voluntary blood donors, emergency patients, and certified hospital blood banks.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-[11px] font-semibold text-rose-400 border border-slate-700">
              <Shield className="w-3.5 h-3.5" /> 100% Free & Community Driven
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/donors" className="hover:text-rose-400 transition">Search Blood Donors</Link>
              </li>
              <li>
                <Link to="/requests" className="hover:text-rose-400 transition">Urgent Blood Requests</Link>
              </li>
              <li>
                <Link to="/request-blood" className="hover:text-rose-400 transition">Post Emergency Request</Link>
              </li>
              <li>
                <Link to="/inventory" className="hover:text-rose-400 transition">Blood Bank Inventory</Link>
              </li>
              <li>
                <Link to="/camps" className="hover:text-rose-400 transition">Donation Camps & Drives</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Blood Group Types */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Blood Groups</h4>
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <Link
                  key={bg}
                  to={`/donors?bloodGroup=${encodeURIComponent(bg)}`}
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-900/40 hover:text-rose-300 border border-slate-700/60 transition"
                >
                  {bg}
                </Link>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3">
              One blood donation can save up to three lives when separated into red cells, platelets, and plasma.
            </p>
          </div>

          {/* Col 4: Emergency Hotlines */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Emergency Support</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-xs text-slate-500 font-semibold">24/7 National Blood Helpline</span>
                  <span className="font-bold text-white">104 / 1910</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-400">
                <span className="font-semibold text-rose-400 block mb-1">Vercel Production Deployment</span>
                Runs on Serverless Node.js, Express, React, and MongoDB Atlas.
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LifeFlow Blood Donation System. Developed with MERN Stack.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for emergency blood relief</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
