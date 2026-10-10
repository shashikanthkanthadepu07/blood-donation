import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Droplet,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  Filter,
  UserCheck,
  RefreshCw,
  Heart,
  MessageSquare
} from 'lucide-react';

export default function FindDonors({ onOpenCompatibility }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedBlood, setSelectedBlood] = useState(searchParams.get('bloodGroup') || '');
  const [compatibleWith, setCompatibleWith] = useState(searchParams.get('compatibleWith') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (compatibleWith) params.compatibleWith = compatibleWith;
      else if (selectedBlood) params.bloodGroup = selectedBlood;

      if (city) params.city = city;
      if (availableOnly) params.availableOnly = 'true';
      if (searchQuery) params.search = searchQuery;

      const res = await api.getDonors(params);
      if (res.success) {
        setDonors(res.donors || []);
      }
    } catch (e) {
      console.error('Failed to load donors:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [selectedBlood, compatibleWith, availableOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDonors();
  };

  const handleResetFilters = () => {
    setSelectedBlood('');
    setCompatibleWith('');
    setCity('');
    setAvailableOnly(false);
    setSearchQuery('');
    setSearchParams({});
    fetchDonors();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Find Voluntary Blood Donors</h1>
          <p className="text-sm text-slate-500">
            Connect with verified blood donors across cities ready to respond in medical emergencies.
          </p>
        </div>
        <button
          onClick={onOpenCompatibility}
          className="self-start md:self-auto px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold border border-rose-200 transition flex items-center gap-1.5"
        >
          <Droplet className="w-3.5 h-3.5" />
          View Compatibility Rules
        </button>
      </div>

      {/* Filter Control Box */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Blood Group Direct Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Specific Blood Group</label>
            <select
              value={selectedBlood}
              onChange={(e) => {
                setSelectedBlood(e.target.value);
                setCompatibleWith('');
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
            >
              <option value="">All Blood Groups</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          {/* Compatibility Smart Matcher */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Compatible For Recipient Type
            </label>
            <select
              value={compatibleWith}
              onChange={(e) => {
                setCompatibleWith(e.target.value);
                setSelectedBlood('');
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-rose-700 focus:ring-2 focus:ring-rose-500"
            >
              <option value="">Select Recipient Type...</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>Patient Needs {bg} (Auto-Match)</option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">City / Region</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="e.g. Mumbai, Bangalore..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Search keyword */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Search Keyword</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Donor name or locality..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 gap-3 text-xs">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
              />
              Show Available Donors Only
            </label>
            {compatibleWith && (
              <span className="bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                Showing all compatible donors for {compatibleWith}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-semibold transition"
            >
              Reset Filters
            </button>
            <button
              onClick={fetchDonors}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Apply Search
            </button>
          </div>
        </div>
      </div>

      {/* Donors Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-rose-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Finding verified blood donors...</p>
        </div>
      ) : donors.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
          <Droplet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No donors found matching criteria</h3>
          <p className="text-xs text-slate-500 mb-6">
            Try broadening your blood group filter or search for a nearby city.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {donors.map((donor) => (
            <div
              key={donor._id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-rose-200 hover:shadow-lg transition p-5 flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Blood group & status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-rose-200">
                      {donor.bloodGroup}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">{donor.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {donor.city}{donor.state ? `, ${donor.state}` : ''}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                      donor.isAvailable
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {donor.isAvailable ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-emerald-600" /> Available
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-amber-600" /> Cooldown
                      </>
                    )}
                  </span>
                </div>

                {/* Donor stats pills */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Donations</span>
                    <span className="font-extrabold text-slate-800">{donor.donationsCount || 0} Times</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Age / Gender</span>
                    <span className="font-bold text-slate-800">{donor.age || '25'} yrs • {donor.gender || 'Donor'}</span>
                  </div>
                </div>

                {donor.address && (
                  <p className="text-xs text-slate-500 mb-4 bg-slate-50/50 p-2 rounded-lg truncate">
                    📍 {donor.address}
                  </p>
                )}
              </div>

              {/* Contact Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <a
                  href={`tel:${donor.phone}`}
                  className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call ({donor.phone})
                </a>
                <a
                  href={`https://wa.me/${donor.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${donor.name}, I found your contact on LifeFlow Blood Donation platform.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 transition"
                  title="WhatsApp Donor"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
