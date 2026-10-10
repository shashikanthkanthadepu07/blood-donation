import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Droplet,
  Building2,
  AlertOctagon,
  CheckCircle,
  AlertTriangle,
  Plus,
  Minus,
  RefreshCw,
  Edit2,
  Check
} from 'lucide-react';

export default function BloodInventory({ onOpenCompatibility }) {
  const { user, isHospital, isAdmin } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [totalUnits, setTotalUnits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingGroup, setEditingGroup] = useState(null);
  const [editUnits, setEditUnits] = useState(0);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await api.getInventory();
      if (res.success) {
        setInventory(res.inventory || []);
        setTotalUnits(res.totalUnits || 0);
      }
    } catch (e) {
      console.error('Failed to load blood inventory:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdateStock = async (bloodGroup, newUnits) => {
    try {
      const res = await api.updateInventory(bloodGroup, Math.max(0, newUnits));
      if (res.success) {
        setEditingGroup(null);
        fetchInventory();
      }
    } catch (e) {
      alert('Could not update inventory: ' + e.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Blood Bank Inventory</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
              Live Reserve
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Real-time stock monitoring of blood units across regional hospital storage facilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Stock Available</span>
            <span className="text-xl font-extrabold text-slate-900">{totalUnits} Units</span>
          </div>
          <button
            onClick={fetchInventory}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
            title="Refresh Stock"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stock Legend */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 font-semibold">
          <span className="text-slate-400 uppercase text-[10px] tracking-wider">Status Index:</span>
          <div className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Adequate Reserve (16+ units)
          </div>
          <div className="flex items-center gap-1.5 text-amber-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Low Reserve (6-15 units)
          </div>
          <div className="flex items-center gap-1.5 text-red-700">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span> Critical Shortage (≤5 units)
          </div>
        </div>

        <button
          onClick={onOpenCompatibility}
          className="text-rose-600 hover:text-rose-700 font-bold transition flex items-center gap-1"
        >
          Check Compatibility Guide →
        </button>
      </div>

      {/* Inventory Cards Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-rose-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Loading blood bank levels...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {inventory.map((item) => {
            const isCritical = item.unitsAvailable <= 5;
            const isLow = item.unitsAvailable > 5 && item.unitsAvailable <= 15;

            return (
              <div
                key={item.bloodGroup}
                className={`bg-white rounded-2xl border p-5 shadow-sm transition hover:shadow-md relative flex flex-col justify-between ${
                  isCritical
                    ? 'border-red-300 ring-1 ring-red-100 bg-gradient-to-b from-white to-red-50/20'
                    : isLow
                    ? 'border-amber-200'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-rose-200">
                      {item.bloodGroup}
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isCritical
                          ? 'bg-red-100 text-red-800'
                          : isLow
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.status || (isCritical ? 'Critical' : isLow ? 'Low' : 'Adequate')}
                    </span>
                  </div>

                  <div className="my-2">
                    <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">
                      Available Stock
                    </span>
                    {editingGroup === item.bloodGroup ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="number"
                          min="0"
                          value={editUnits}
                          onChange={(e) => setEditUnits(Number(e.target.value))}
                          className="w-20 px-2 py-1 border border-rose-300 rounded-lg text-lg font-black text-slate-800"
                        />
                        <button
                          onClick={() => handleUpdateStock(item.bloodGroup, editUnits)}
                          className="p-1.5 bg-emerald-600 text-white rounded-lg"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-3xl font-black text-slate-900">
                        {item.unitsAvailable}{' '}
                        <span className="text-sm font-semibold text-slate-500">Units</span>
                      </p>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-400 mt-2">
                    Last updated: {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : 'Today'}
                  </p>
                </div>

                {/* Hospital / Admin Quick adjust buttons */}
                {(isHospital || isAdmin) && (
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500 text-[10px] uppercase">Staff Adjust:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateStock(item.bloodGroup, item.unitsAvailable - 1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700"
                        title="Deduct 1 unit"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleUpdateStock(item.bloodGroup, item.unitsAvailable + 1)}
                        className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 flex items-center justify-center font-bold text-rose-700"
                        title="Add 1 unit"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingGroup(item.bloodGroup);
                          setEditUnits(item.unitsAvailable);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700"
                        title="Custom unit value"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
