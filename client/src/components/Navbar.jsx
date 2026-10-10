import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Droplet,
  Heart,
  PlusCircle,
  Menu,
  X,
  User,
  LogOut,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  Building2,
  Calendar
} from 'lucide-react';

export default function Navbar({ onOpenCompatibility, onOpenEligibility }) {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleDemo = async (role) => {
    setDemoDropdownOpen(false);
    setMobileMenuOpen(false);
    await demoLogin(role);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-lg shadow-rose-200 group-hover:scale-105 transition-transform duration-200">
              <Droplet className="w-6 h-6 fill-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-rose-700 to-red-600 bg-clip-text text-transparent">
                LifeFlow
              </span>
              <span className="hidden sm:block text-[10px] tracking-wider uppercase font-semibold text-slate-600 -mt-1">
                Blood Donation Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-semibold text-slate-700">
            <Link
              to="/donors"
              className={`px-3 py-2 rounded-xl transition ${
                isActive('/donors') ? 'text-rose-600 bg-rose-50' : 'hover:text-rose-600 hover:bg-slate-50'
              }`}
            >
              Find Donors
            </Link>
            <Link
              to="/requests"
              className={`px-3 py-2 rounded-xl transition ${
                isActive('/requests') ? 'text-rose-600 bg-rose-50' : 'hover:text-rose-600 hover:bg-slate-50'
              }`}
            >
              Blood Requests
            </Link>
            <Link
              to="/inventory"
              className={`px-3 py-2 rounded-xl transition ${
                isActive('/inventory') ? 'text-rose-600 bg-rose-50' : 'hover:text-rose-600 hover:bg-slate-50'
              }`}
            >
              Blood Bank Stock
            </Link>
            <Link
              to="/camps"
              className={`px-3 py-2 rounded-xl transition ${
                isActive('/camps') ? 'text-rose-600 bg-rose-50' : 'hover:text-rose-600 hover:bg-slate-50'
              }`}
            >
              Donation Camps
            </Link>

            {/* Quick Helper Modals Trigger */}
            <button
              onClick={onOpenCompatibility}
              className="px-2.5 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-slate-50 rounded-xl transition flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
              Compatibility
            </button>
            <button
              onClick={onOpenEligibility}
              className="px-2.5 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-slate-50 rounded-xl transition flex items-center gap-1"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              Eligibility
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Urgent Request CTA */}
            <Link
              to="/request-blood"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition"
            >
              <ShieldAlert className="w-4 h-4 text-rose-200" />
              Request Blood
            </Link>

            {/* Demo Quick Logins Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="px-3 py-2 text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 rounded-xl flex items-center gap-1 transition"
                title="Instant switch for evaluating roles without manual credentials"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Demo Logins
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 animate-fadeIn text-xs">
                  <div className="px-3 py-1.5 font-bold text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
                    Switch Test Account
                  </div>
                  <button
                    onClick={() => handleDemo('donor')}
                    className="w-full text-left px-3 py-2 hover:bg-rose-50 text-slate-800 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-rose-600" />
                    <span>Donor (O-)</span>
                  </button>
                  <button
                    onClick={() => handleDemo('hospital')}
                    className="w-full text-left px-3 py-2 hover:bg-rose-50 text-slate-800 flex items-center gap-2"
                  >
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Hospital Staff</span>
                  </button>
                  <button
                    onClick={() => handleDemo('admin')}
                    className="w-full text-left px-3 py-2 hover:bg-rose-50 text-slate-800 flex items-center gap-2"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
                    <span>System Admin</span>
                  </button>
                </div>
              )}
            </div>

            {/* Auth State Button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                  <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">
                    {user?.bloodGroup || user?.role}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-rose-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition"
                >
                  Register Donor
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/request-blood"
              className="px-2.5 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg"
            >
              SOS Request
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 text-sm font-semibold">
          <Link
            to="/donors"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-rose-50 text-slate-800"
          >
            Find Donors
          </Link>
          <Link
            to="/requests"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-rose-50 text-slate-800"
          >
            Blood Requests
          </Link>
          <Link
            to="/inventory"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-rose-50 text-slate-800"
          >
            Blood Bank Stock
          </Link>
          <Link
            to="/camps"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-rose-50 text-slate-800"
          >
            Donation Camps
          </Link>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCompatibility();
              }}
              className="text-left px-3 py-2 text-xs text-slate-600 font-semibold"
            >
              🔍 Compatibility Matrix
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEligibility();
              }}
              className="text-left px-3 py-2 text-xs text-slate-600 font-semibold"
            >
              ❤️ Eligibility Test
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-[10px] uppercase font-bold text-slate-400 px-3 mb-1">Demo Quick Login</p>
            <div className="flex gap-2 px-3">
              <button
                onClick={() => handleDemo('donor')}
                className="px-2.5 py-1 text-xs bg-rose-50 text-rose-700 rounded-md font-bold"
              >
                Donor
              </button>
              <button
                onClick={() => handleDemo('hospital')}
                className="px-2.5 py-1 text-xs bg-blue-50 text-blue-700 rounded-md font-bold"
              >
                Hospital
              </button>
              <button
                onClick={() => handleDemo('admin')}
                className="px-2.5 py-1 text-xs bg-purple-50 text-purple-700 rounded-md font-bold"
              >
                Admin
              </button>
            </div>
          </div>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between px-3">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="font-bold text-rose-600"
              >
                My Dashboard ({user?.name})
              </Link>
              <button onClick={logout} className="text-xs text-slate-500 font-bold">
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 bg-slate-100 rounded-xl text-slate-700 text-xs font-bold"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
