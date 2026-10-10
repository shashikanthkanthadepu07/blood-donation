import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplet, Mail, Lock, Sparkles, User, Building2, ShieldAlert } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role) => {
    setLoading(true);
    setError('');
    try {
      await demoLogin(role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white mx-auto flex items-center justify-center shadow-md shadow-rose-200">
            <Droplet className="w-6 h-6 fill-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Sign in to LifeFlow</h1>
          <p className="text-xs text-slate-500">Access your donor dashboard or manage hospital requests</p>
        </div>

        {/* 1-Click Demo Bypass Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Instant Demo Accounts (1-Click Test)</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-tight">
            Click any role below to sign in immediately without manual passwords:
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleDemo('donor')}
              className="py-1.5 px-2 bg-white hover:bg-rose-50 text-rose-700 font-bold text-[11px] rounded-xl border border-amber-200 shadow-sm transition flex items-center justify-center gap-1"
            >
              <User className="w-3 h-3" /> Donor (O-)
            </button>
            <button
              type="button"
              onClick={() => handleDemo('hospital')}
              className="py-1.5 px-2 bg-white hover:bg-blue-50 text-blue-700 font-bold text-[11px] rounded-xl border border-amber-200 shadow-sm transition flex items-center justify-center gap-1"
            >
              <Building2 className="w-3 h-3" /> Hospital
            </button>
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              className="py-1.5 px-2 bg-white hover:bg-purple-50 text-purple-700 font-bold text-[11px] rounded-xl border border-amber-200 shadow-sm transition flex items-center justify-center gap-1"
            >
              <ShieldAlert className="w-3 h-3" /> Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Manual Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-md shadow-rose-200 transition"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          New to LifeFlow?{' '}
          <Link to="/register" className="font-bold text-rose-600 hover:text-rose-700">
            Register as a Voluntary Donor
          </Link>
        </p>
      </div>
    </div>
  );
}
