import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  MapPin,
  Clock,
  Phone,
  Users,
  Building2,
  CheckCircle2,
  PlusCircle,
  X,
  Share2,
  RefreshCw
} from 'lucide-react';

export default function DonationCamps() {
  const { user, isHospital, isAdmin } = useAuth();
  const [camps, setCamps] = useState([]);
  const [cityFilter, setCityFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Registration Modal State
  const [registerModalCamp, setRegisterModalCamp] = useState(null);
  const [attendeeName, setAttendeeName] = useState(user?.name || '');
  const [attendeeEmail, setAttendeeEmail] = useState(user?.email || '');
  const [attendeePhone, setAttendeePhone] = useState(user?.phone || '');
  const [regSuccess, setRegSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // New Camp Modal (Hospital / Admin)
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newCamp, setNewCamp] = useState({
    title: '',
    organizedBy: user?.name || '',
    location: '',
    city: user?.city || '',
    date: '',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    contactPhone: user?.phone || '',
    description: '',
    bannerUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80'
  });

  const fetchCamps = async () => {
    setLoading(true);
    try {
      const res = await api.getCamps(cityFilter ? { city: cityFilter } : {});
      if (res.success) {
        setCamps(res.camps || []);
      }
    } catch (e) {
      console.error('Failed to load camps:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCamps();
  }, [cityFilter]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registerModalCamp) return;
    setSubmitting(true);
    try {
      const res = await api.registerCamp(registerModalCamp._id, {
        name: attendeeName,
        email: attendeeEmail,
        phone: attendeePhone
      });
      if (res.success) {
        setRegSuccess('You are registered! We look forward to seeing you at the drive.');
        setTimeout(() => {
          setRegSuccess('');
          setRegisterModalCamp(null);
          fetchCamps();
        }, 1800);
      }
    } catch (err) {
      alert(err.message || 'Error registering for camp');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCamp = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createCamp(newCamp);
      if (res.success) {
        setCreateModalOpen(false);
        fetchCamps();
      }
    } catch (err) {
      alert(err.message || 'Error creating camp');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Blood Donation Camps & Drives</h1>
          <p className="text-sm text-slate-500">
            Join community blood drives organized by Red Cross, Rotary Clubs, and certified hospital networks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {(isHospital || isAdmin) && (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200 transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Schedule New Drive
            </button>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <MapPin className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter drives by city (e.g. Mumbai, Delhi)..."
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>

        <button
          onClick={fetchCamps}
          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Camps List */}
      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-rose-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Loading donation drives...</p>
        </div>
      ) : camps.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No upcoming drives found in this city</h3>
          <p className="text-xs text-slate-500 mb-6">
            Clear your filter to view camps in other regions or schedule a new drive.
          </p>
          <button
            onClick={() => setCityFilter('')}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
          >
            Show All Cities
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {camps.map((camp) => (
            <div
              key={camp._id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-44 bg-slate-100 relative overflow-hidden">
                  <img
                    src={camp.bannerUrl || 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80'}
                    alt={camp.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-black text-rose-600 shadow-sm">
                    {camp.city}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">{camp.title}</h3>
                    <p className="text-xs font-semibold text-rose-600 mt-0.5">By {camp.organizedBy}</p>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <strong>Date:</strong> {camp.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <strong>Timing:</strong> {camp.startTime} - {camp.endTime}
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span>{camp.location}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>Helpline: {camp.contactPhone}</span>
                    </p>
                  </div>

                  {camp.description && (
                    <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 line-clamp-3">
                      {camp.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {camp.registeredAttendees?.length || 0} Registered
                  </span>
                  <button
                    onClick={() => {
                      setRegisterModalCamp(camp);
                      setAttendeeName(user?.name || '');
                      setAttendeeEmail(user?.email || '');
                      setAttendeePhone(user?.phone || '');
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
                  >
                    Register to Attend
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register Attendee Modal */}
      {registerModalCamp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setRegisterModalCamp(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-1.5"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">Register for Blood Donation Camp</h3>
            <p className="text-xs text-slate-500 mb-4">{registerModalCamp.title}</p>

            {regSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {regSuccess}
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={attendeeName}
                    onChange={(e) => setAttendeeName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={attendeeEmail}
                    onChange={(e) => setAttendeeEmail(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={attendeePhone}
                    onChange={(e) => setAttendeePhone(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  {submitting ? 'Registering...' : 'Confirm Camp Registration'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Create Camp Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-1.5"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">Schedule Donation Drive</h3>
            <p className="text-xs text-slate-500 mb-5">Create a blood collection event for donors to register</p>

            <form onSubmit={handleCreateCamp} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Camp Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. City LifeFlow Mega Camp 2024"
                  value={newCamp.title}
                  onChange={(e) => setNewCamp({ ...newCamp, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Organizing Body *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Red Cross Society"
                    value={newCamp.organizedBy}
                    onChange={(e) => setNewCamp({ ...newCamp, organizedBy: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai"
                    value={newCamp.city}
                    onChange={(e) => setNewCamp({ ...newCamp, city: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Venue Location Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Community Center, 5th Avenue"
                  value={newCamp.location}
                  onChange={(e) => setNewCamp({ ...newCamp, location: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newCamp.date}
                    onChange={(e) => setNewCamp({ ...newCamp, date: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={newCamp.startTime}
                    onChange={(e) => setNewCamp({ ...newCamp, startTime: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Time</label>
                  <input
                    type="text"
                    value={newCamp.endTime}
                    onChange={(e) => setNewCamp({ ...newCamp, endTime: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Helpline Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98200 12345"
                  value={newCamp.contactPhone}
                  onChange={(e) => setNewCamp({ ...newCamp, contactPhone: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Facilities</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Certified doctors present, refreshments, air-conditioned bus"
                  value={newCamp.description}
                  onChange={(e) => setNewCamp({ ...newCamp, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition"
              >
                Publish Donation Drive
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
