import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  User,
  Droplet,
  MapPin,
  Phone,
  ShieldCheck,
  Heart,
  Building2,
  CheckCircle,
  XCircle,
  Edit2,
  Save,
  Clock,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, isHospital, isAdmin, updateProfile } = useAuth();

  const [isAvailable, setIsAvailable] = useState(user?.isAvailable ?? true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    address: user?.address || '',
    weight: user?.weight || 65
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setIsAvailable(user.isAvailable ?? true);
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        city: user.city || '',
        address: user.address || '',
        weight: user.weight || 65
      });
    }
  }, [user]);

  const handleToggleAvailability = async () => {
    const nextVal = !isAvailable;
    setIsAvailable(nextVal);
    try {
      await updateProfile({ isAvailable: nextVal });
      setMessage(`Availability status updated to ${nextVal ? 'Available' : 'Unavailable'}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (e) {
      setIsAvailable(!nextVal);
      alert('Could not update status: ' + e.message);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfile(formData);
      if (res.success) {
        setEditing(false);
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (e) {
      alert('Failed to save profile: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Please Sign In to Access Dashboard</h2>
        <p className="text-xs text-slate-500 mb-6">You can sign in with your account or use 1-click Demo Accounts.</p>
        <Link
          to="/login"
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg shadow-rose-200">
            {user.bloodGroup || '🩸'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border border-slate-200">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {user.city || 'City not specified'}
              <span className="text-slate-300">•</span>
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {user.phone || 'No phone'}
            </p>
          </div>
        </div>

        {/* Donor Availability Switch */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4 w-full md:w-auto justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Emergency Donor Status
            </span>
            <span className={`text-xs font-bold flex items-center gap-1 ${isAvailable ? 'text-emerald-700' : 'text-amber-700'}`}>
              {isAvailable ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-amber-600" />}
              {isAvailable ? 'Ready to Donate Blood' : 'Currently on Cooldown'}
            </span>
          </div>

          <button
            onClick={handleToggleAvailability}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              isAvailable ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                isAvailable ? 'translate-x-6' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
          {message}
        </div>
      )}

      {/* Grid of details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Card 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <Heart className="w-6 h-6 fill-rose-500 text-rose-600" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{user.donationsCount || 0}</p>
            <p className="text-xs font-semibold text-slate-500">Lifetime Blood Donations</p>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <Droplet className="w-6 h-6 fill-blue-500 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{user.bloodGroup}</p>
            <p className="text-xs font-semibold text-slate-500">Registered Blood Type</p>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">Verified</p>
            <p className="text-xs font-semibold text-slate-500">Profile Status</p>
          </div>
        </div>
      </div>

      {/* Editable Information */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Personal & Contact Details</h2>
            <p className="text-xs text-slate-500">Keep your emergency phone and city up to date for urgent patient matches</p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Emergency Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Locality / Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Email</span>
              <span className="text-slate-800 font-semibold">{user.email}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Phone</span>
              <span className="text-slate-800 font-semibold">{user.phone}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">City & Address</span>
              <span className="text-slate-800 font-semibold">{user.city} {user.address ? `(${user.address})` : ''}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Weight / Age</span>
              <span className="text-slate-800 font-semibold">{user.weight || 60} kg • {user.age || 26} yrs</span>
            </div>
          </div>
        )}
      </div>

      {/* Staff Controls (Hospital / Admin) */}
      {(isHospital || isAdmin) && (
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-300" />
            <h3 className="text-xl font-bold">Hospital Blood Bank Management Portal</h3>
          </div>
          <p className="text-xs text-blue-200 max-w-2xl leading-relaxed">
            As a verified medical partner, you can update blood unit reserves, view unfulfilled emergency requests, and organize community donation camps.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/inventory"
              className="px-4 py-2 bg-white text-blue-900 rounded-xl text-xs font-bold hover:bg-blue-50 transition"
            >
              Update Inventory Stock
            </Link>
            <Link
              to="/requests"
              className="px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold border border-blue-600 transition"
            >
              Manage Emergency Requests
            </Link>
            <Link
              to="/camps"
              className="px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold border border-blue-600 transition"
            >
              Schedule Donation Drive
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
