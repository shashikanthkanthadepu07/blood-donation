import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  Droplet,
  Search,
  Heart,
  Users,
  Building2,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function Home({ onOpenCompatibility, onOpenEligibility }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDonors: 8,
    activeRequests: 4,
    fulfilledRequests: 1,
    totalUnitsInBank: 167,
    livesSaved: 254
  });
  const [searchBlood, setSearchBlood] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [urgentRequests, setUrgentRequests] = useState([]);
  const [upcomingCamps, setUpcomingCamps] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, reqsRes, campsRes] = await Promise.all([
          api.getStats().catch(() => null),
          api.getRequests({ urgency: 'Emergency', status: 'Pending' }).catch(() => null),
          api.getCamps().catch(() => null)
        ]);

        if (statsRes?.stats) setStats(statsRes.stats);
        if (reqsRes?.requests) setUrgentRequests(reqsRes.requests.slice(0, 3));
        if (campsRes?.camps) setUpcomingCamps(campsRes.camps.slice(0, 2));
      } catch (e) {
        console.error('Home load error:', e);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchBlood) params.append('bloodGroup', searchBlood);
    if (searchCity) params.append('city', searchCity);
    navigate(`/donors?${params.toString()}`);
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/70 via-white to-slate-50 pt-10 sm:pt-16 pb-16 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200 shadow-sm animate-pulse-subtle">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              24/7 Verified Emergency Blood Donation Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Give Blood, <span className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 bg-clip-text text-transparent">Give Life</span> in Real-Time.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Find verified voluntary blood donors nearby or request emergency blood units across hospitals instantly. Every donation can save up to 3 precious lives.
            </p>

            {/* Quick Search Form */}
            <form
              onSubmit={handleSearch}
              className="bg-white p-3 sm:p-4 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 max-w-2xl mx-auto flex flex-col sm:flex-row gap-3"
            >
              <div className="flex-1 relative">
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 text-left px-1">Blood Group</label>
                <div className="relative">
                  <Droplet className="w-4 h-4 text-rose-500 absolute left-3 top-3.5" />
                  <select
                    value={searchBlood}
                    onChange={(e) => setSearchBlood(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">Any Blood Group</option>
                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex-1 relative">
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 text-left px-1">City / Location</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Delhi..."
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-md shadow-rose-200 transition flex items-center justify-center gap-2 h-[42px]"
                >
                  <Search className="w-4 h-4" />
                  Find Donors
                </button>
              </div>
            </form>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs">
              <Link
                to="/request-blood"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-200 transition"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Emergency Blood Request
              </Link>
              <button
                onClick={onOpenEligibility}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold shadow-sm transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Check Eligibility
              </button>
              <button
                onClick={onOpenCompatibility}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold shadow-sm transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                Compatibility Chart
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Counter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.totalDonors}+</p>
              <p className="text-xs font-semibold text-slate-500">Verified Donors</p>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.totalUnitsInBank} Units</p>
              <p className="text-xs font-semibold text-slate-500">In Blood Banks</p>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.activeRequests}</p>
              <p className="text-xs font-semibold text-slate-500">Active Requests</p>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Heart className="w-6 h-6 text-emerald-600 fill-emerald-500" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.livesSaved}+</p>
              <p className="text-xs font-semibold text-slate-500">Lives Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Urgent Emergency Requests Section */}
      {urgentRequests.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                <h2 className="text-2xl font-bold text-slate-900">Urgent Emergency Requests</h2>
              </div>
              <p className="text-sm text-slate-500">Critical patients in urgent need of compatible blood donors right now</p>
            </div>
            <Link
              to="/requests"
              className="text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {urgentRequests.map((req) => (
              <div
                key={req._id}
                className="bg-white rounded-2xl p-5 border border-red-200 shadow-sm hover:shadow-md transition relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-red-100 text-red-800 border border-red-200">
                      EMERGENCY
                    </span>
                    <span className="text-2xl font-black text-rose-600">{req.bloodGroup}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-1">{req.patientName}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {req.hospitalName}, {req.city}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4">
                    {req.notes || 'Emergency transfusion required.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Units Needed: <span className="text-red-600">{req.unitsRequired}</span>
                  </span>
                  <Link
                    to={`/requests`}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
                  >
                    Pledge Blood
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Blood Groups Selector Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Browse Donors by Blood Group</h2>
          <p className="text-sm text-slate-500">Click any blood type to browse registered and available voluntary donors</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {bloodGroups.map((bg) => (
            <button
              key={bg}
              onClick={() => navigate(`/donors?bloodGroup=${encodeURIComponent(bg)}`)}
              className="p-4 rounded-2xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 shadow-sm hover:shadow-md transition text-center group"
            >
              <div className="w-10 h-10 mx-auto rounded-full bg-rose-100 group-hover:bg-rose-600 text-rose-600 group-hover:text-white flex items-center justify-center font-black text-sm transition mb-2">
                {bg}
              </div>
              <span className="text-xs font-bold text-slate-700 block">Type {bg}</span>
              <span className="text-[10px] text-slate-400 font-semibold group-hover:text-rose-600">Find Donors →</span>
            </button>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How LifeFlow Works</h2>
            <p className="text-sm text-slate-500">A seamless 3-step lifecycle saving lives in under 30 minutes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xl mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Register as a Donor</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fill a quick 1-minute profile with your blood group, city, and phone number. Toggle your availability on or off anytime.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xl mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Instant Emergency Match</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When a hospital or recipient posts an emergency request, compatible donors are matched automatically using medical blood rules.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xl mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Pledge & Save Lives</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Respond to requests or attend community donation camps. Real-time updates help hospitals fulfill emergency orders swiftly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Donation Camps Preview */}
      {upcomingCamps.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Upcoming Blood Donation Camps</h2>
              <p className="text-sm text-slate-500">Participate in organized drives in your city</p>
            </div>
            <Link to="/camps" className="text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1">
              View All Drives <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingCamps.map((camp) => (
              <div
                key={camp._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col sm:flex-row"
              >
                <div className="sm:w-2/5 h-48 sm:h-auto bg-slate-100 relative">
                  <img
                    src={camp.bannerUrl}
                    alt={camp.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm">
                    {camp.city}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">{camp.title}</h3>
                    <p className="text-xs text-rose-600 font-semibold mb-2">By {camp.organizedBy}</p>
                    <div className="space-y-1 text-xs text-slate-500 mb-4">
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {camp.date} ({camp.startTime} - {camp.endTime})
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {camp.location}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/camps"
                    className="w-full text-center py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
                  >
                    View Details & Register
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ready to Deploy on Vercel Callout Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 mb-4 inline-block">
              Vercel Production Ready
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight mb-3">
              Full Stack MERN System Built for Scale
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Includes Serverless Express API with cached connection management, Mongo DB integration with in-memory resilient fallback, JWT security, and responsive React SPA.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/register"
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-900/50 transition"
              >
                Join as Voluntary Donor
              </Link>
              <Link
                to="/inventory"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition"
              >
                Inspect Live Blood Bank
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
