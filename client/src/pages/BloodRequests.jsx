import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  AlertTriangle,
  Building2,
  MapPin,
  Phone,
  PlusCircle,
  Heart,
  Clock,
  CheckCircle,
  X,
  Share2,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export default function BloodRequests() {
  const { user, isHospital, isAdmin } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [bloodGroup, setBloodGroup] = useState('');
  const [urgency, setUrgency] = useState('');
  const [status, setStatus] = useState('');
  const [city, setCity] = useState('');

  // Pledge Modal
  const [pledgeModalRequest, setPledgeModalRequest] = useState(null);
  const [pledgeUnits, setPledgeUnits] = useState(1);
  const [donorName, setDonorName] = useState(user?.name || '');
  const [donorPhone, setDonorPhone] = useState(user?.phone || '');
  const [pledging, setPledging] = useState(false);
  const [pledgeSuccess, setPledgeSuccess] = useState('');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = {};
      if (bloodGroup) params.bloodGroup = bloodGroup;
      if (urgency) params.urgency = urgency;
      if (status) params.status = status;
      if (city) params.city = city;

      const res = await api.getRequests(params);
      if (res.success) {
        setRequests(res.requests || []);
      }
    } catch (e) {
      console.error('Failed to load blood requests:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [bloodGroup, urgency, status]);

  const handlePledgeSubmit = async (e) => {
    e.preventDefault();
    if (!pledgeModalRequest) return;
    setPledging(true);
    try {
      const res = await api.pledgeDonation(pledgeModalRequest._id, {
        donorName: donorName || 'Voluntary Donor',
        donorPhone: donorPhone || 'Registered contact',
        unitsPledged: Number(pledgeUnits)
      });
      if (res.success) {
        setPledgeSuccess('Your pledge has been successfully recorded! Thank you for stepping up.');
        setTimeout(() => {
          setPledgeSuccess('');
          setPledgeModalRequest(null);
          fetchRequests();
        }, 1800);
      }
    } catch (err) {
      alert(err.message || 'Error recording pledge');
    } finally {
      setPledging(false);
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const res = await api.updateRequestStatus(requestId, newStatus);
      if (res.success) {
        fetchRequests();
      }
    } catch (e) {
      alert('Could not update status: ' + e.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Active Blood Requests</h1>
          <p className="text-sm text-slate-500">
            Patients and hospitals urgently seeking matching blood units. Every pledge counts!
          </p>
        </div>
        <Link
          to="/request-blood"
          className="self-start md:self-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-md shadow-rose-200 transition flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Post New Request
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3 text-xs">
        <div className="flex-1 min-w-[140px]">
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
          >
            <option value="">All Blood Groups</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[140px]">
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
          >
            <option value="">All Urgency Levels</option>
            <option value="Emergency">🚨 Emergency</option>
            <option value="Urgent">⚠️ Urgent</option>
            <option value="Standard">Standard</option>
          </select>
        </div>

        <div className="flex-1 min-w-[140px]">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Fulfilled">Fulfilled</option>
          </select>
        </div>

        <button
          onClick={fetchRequests}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Requests Board */}
      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-rose-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
          <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No pending requests matching filters</h3>
          <p className="text-xs text-slate-500 mb-6">
            All current patient blood requests are fulfilled or none exist for this category.
          </p>
          <Link
            to="/request-blood"
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
          >
            Submit Blood Request
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => {
            const fulfilled = req.unitsFulfilled || 0;
            const required = req.unitsRequired || 1;
            const percentage = Math.min(100, Math.round((fulfilled / required) * 100));

            return (
              <div
                key={req._id}
                className={`bg-white rounded-2xl border transition p-5 flex flex-col justify-between shadow-sm hover:shadow-md ${
                  req.urgency === 'Emergency' ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-200'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        req.urgency === 'Emergency'
                          ? 'bg-red-100 text-red-800 animate-pulse-subtle'
                          : req.urgency === 'Urgent'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {req.urgency}
                    </span>

                    <span className="text-2xl font-black text-rose-600">{req.bloodGroup}</span>
                  </div>

                  {/* Patient & Hospital Info */}
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{req.patientName}</h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5 mb-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <strong>{req.hospitalName}</strong>
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {req.city}
                  </p>

                  {/* Notes / Reason */}
                  {req.notes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4 leading-relaxed">
                      "{req.notes}"
                    </p>
                  )}

                  {/* Progress Bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-600">Pledged Units</span>
                      <span className="text-rose-600">
                        {fulfilled} of {required} Units ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-slate-500">Contact: {req.contactPerson}</span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                        req.status === 'Fulfilled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex gap-2">
                    <a
                      href={`tel:${req.contactPhone}`}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                    {req.status !== 'Fulfilled' ? (
                      <button
                        onClick={() => {
                          setPledgeModalRequest(req);
                          setDonorName(user?.name || '');
                          setDonorPhone(user?.phone || '');
                        }}
                        className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                      >
                        <Heart className="w-3.5 h-3.5 fill-white" /> Pledge Blood
                      </button>
                    ) : (
                      <span className="flex-1 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl text-center border border-emerald-200">
                        ✓ Fulfilled
                      </span>
                    )}
                  </div>

                  {/* Admin / Hospital Status Controls */}
                  {(isHospital || isAdmin) && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-400">Staff Control:</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleStatusChange(req._id, 'Fulfilled')}
                          className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold hover:bg-emerald-200"
                        >
                          Mark Done
                        </button>
                        <button
                          onClick={() => handleStatusChange(req._id, 'Cancelled')}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-bold hover:bg-slate-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pledge Modal */}
      {pledgeModalRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setPledgeModalRequest(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-1.5"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-black">
                {pledgeModalRequest.bloodGroup}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Pledge Blood Donation</h3>
                <p className="text-xs text-slate-500">For patient {pledgeModalRequest.patientName}</p>
              </div>
            </div>

            {pledgeSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold text-center flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                {pledgeSuccess}
              </div>
            ) : (
              <form onSubmit={handlePledgeSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Units You Pledge to Donate</label>
                  <select
                    value={pledgeUnits}
                    onChange={(e) => setPledgeUnits(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="1">1 Unit (Whole Blood)</option>
                    <option value="2">2 Units (Or with companion)</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 leading-relaxed text-[11px]">
                  By submitting this pledge, your contact info will be shared with the patient's family/hospital to coordinate the transfusion schedule.
                </div>

                <button
                  type="submit"
                  disabled={pledging}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md shadow-rose-200 transition"
                >
                  {pledging ? 'Recording Pledge...' : 'Confirm My Blood Pledge'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
