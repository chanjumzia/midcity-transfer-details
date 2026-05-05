/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  Plus,
  MapPin,
  Landmark,
  Search,
  Users,
  Hash,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { storageService } from '../services/storage';
import { LandTransfer } from '../types';

const StatCard = ({ title, value, icon: Icon, color, subtext, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    className="card p-6 flex flex-col gap-4 relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2"
  >
    <div className={`p-4 rounded-2xl ${color} self-start shadow-lg shadow-current/20 z-10`}>
      <Icon size={24} className="text-white" />
    </div>
    <div className="z-10">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</p>
      <h3 className="text-4xl font-black mt-1 text-slate-900 tracking-tighter">{value}</h3>
      <p className="text-[11px] text-slate-500 mt-2 font-bold tracking-tight bg-slate-100 py-1 px-2 rounded-lg inline-block">{subtext}</p>
    </div>
    <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-125 transition-all duration-700 ease-in-out text-slate-900">
      <Icon size={160} />
    </div>
    <div className={`absolute top-0 right-0 w-1 h-full ${color.replace('bg-', 'bg-opacity-40 bg-')}`}></div>
  </motion.div>
);

export default function Dashboard() {
  const [transfers, setTransfers] = useState<LandTransfer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    setTransfers(storageService.getTransfers());
  }, []);

  const stats = {
    total: transfers.length,
    completed: transfers.filter(t => t.status === 'Completed').length,
    pending: transfers.filter(t => t.status === 'Pending').length,
    cancelled: transfers.filter(t => t.status === 'Cancelled').length,
    activeTotal: transfers.filter(t => t.status !== 'Completed').length
  };

  const filteredTransfers = transfers
    .filter(t => t.status !== 'Completed') // Dashboard usually tracks active work
    .filter(t => {
      const q = searchQuery.toLowerCase();
      return (
        t.buyerName.toLowerCase().includes(q) ||
        t.sellerName.toLowerCase().includes(q) ||
        t.buyerMcNumber.toLowerCase().includes(q) ||
        t.sellerMcNumber.toLowerCase().includes(q) ||
        t.mclrNumber.toLowerCase().includes(q) ||
        t.plotNumber.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-10 pb-16">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">System Live</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Ahlan Wa Sahlan! <span className="text-midcity-green font-black">Anjum Zia</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Sary records ab aapki ungliyo par hain.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Link to="/new" className="btn-primary px-8 py-4 shadow-xl shadow-midcity-green/20 scale-105 active:scale-100">
            <Plus size={22} strokeWidth={3} />
            <span>New Registry Intake</span>
          </Link>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Intake" 
          value={stats.activeTotal} 
          icon={Activity} 
          color="bg-emerald-600" 
          subtext="Unfinished Registry files"
          delay={0.1}
        />
        <StatCard 
          title="Ready Files" 
          value={stats.completed} 
          icon={CheckCircle2} 
          color="bg-blue-600" 
          subtext="Delivered to Archive"
          delay={0.2}
        />
        <StatCard 
          title="Waiting" 
          value={stats.pending} 
          icon={Clock} 
          color="bg-amber-500" 
          subtext="Pending NOC/Taxes"
          delay={0.3}
        />
        <StatCard 
          title="Cancelled" 
          value={stats.cancelled} 
          icon={XCircle} 
          color="bg-rose-500" 
          subtext="Rejected files"
          delay={0.4}
        />
      </div>

      {/* Advanced Search & List Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-midcity-green rounded-full"></div>
               <h2 className="text-2xl font-black text-slate-800 tracking-tight">Active Work Registry</h2>
             </div>
             
             {/* Unified Search Bar */}
             <div className={`relative transition-all duration-300 ${isSearchFocused ? 'md:w-96' : 'md:w-72'}`}>
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isSearchFocused ? 'text-midcity-green' : 'text-slate-400'}`} size={18} />
                <input 
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search Name, MC No, MCLR..."
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-100 rounded-[1.2rem] focus:ring-4 focus:ring-midcity-green/5 focus:border-midcity-green/30 outline-none transition-all font-bold text-sm shadow-sm"
                />
             </div>
          </div>

          <div className="card border-0 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
            {/* Pattern Backdrop */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#064e3b_1px,transparent_1px)] [background-size:20px_20px]"></div>
            
            <div className="relative z-10 overflow-x-auto">
              {filteredTransfers.length === 0 ? (
                <div className="p-24 text-center">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex p-6 rounded-3xl bg-slate-50 mb-4 border border-slate-100 text-slate-300"
                  >
                    <Search size={48} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-800">No matching registry found</h3>
                  <p className="text-slate-500 mt-2 font-medium">Try different keywords or add a new record.</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-[#fcfdfe] border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Plot & Identity</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stakeholders</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Lifecycle Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <AnimatePresence mode="popLayout">
                      {filteredTransfers.map((t) => (
                        <motion.tr 
                          layout
                          key={t.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="hover:bg-[#f8fafc] transition-all group"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400 group-hover:bg-midcity-green group-hover:text-white transition-colors">
                                 <Landmark size={22} />
                               </div>
                               <div>
                                 <p className="font-black text-lg text-slate-900 tracking-tight">{t.plotNumber}</p>
                                 <div className="flex items-center gap-2 mt-0.5">
                                   <span className="text-[10px] font-black text-midcity-green bg-midcity-green/5 px-2 py-0.5 rounded tracking-widest">{t.mclrNumber}</span>
                                   <span className="text-[10px] font-bold text-slate-400 uppercase">{t.block}</span>
                                 </div>
                               </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="space-y-1.5">
                               <div className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <p className="text-sm font-bold text-slate-700">S: {t.sellerName} <span className="text-[10px] text-slate-400">({t.sellerMcNumber})</span></p>
                               </div>
                               <div className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-midcity-green"></span>
                                <p className="text-sm font-bold text-slate-700">B: {t.buyerName} <span className="text-[10px] text-slate-400">({t.buyerMcNumber})</span></p>
                               </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              t.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                              t.status === 'Pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-rose-100 text-rose-700'
                            }`}>
                              {t.status === 'Completed' ? <CheckCircle2 size={12} /> : 
                               t.status === 'Pending' ? <Clock size={12} /> : <XCircle size={12} />}
                              {t.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <Link to={`/edit/${t.id}`} className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-500 hover:bg-midcity-green hover:text-white transition-all shadow-sm hover:shadow-lg hover:shadow-midcity-green/20">
                              <ArrowRight size={20} />
                            </Link>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info Panels */}
        <div className="xl:col-span-4 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-8 bg-gradient-to-br from-[#064e3b] to-[#043327] text-white border-0 shadow-2xl shadow-midcity-green/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            
            <h3 className="font-black text-2xl mb-2 tracking-tight">MIDCITY Support</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-8 font-medium">
              Daily land transfer tracking and reporting system. Professional portal for official use only.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shadow-inner">
                  <MapPin size={20} className="text-emerald-300" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Office Location</p>
                  <span className="text-sm font-bold">Lahore South Facility</span>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shadow-inner">
                  <Users size={20} className="text-emerald-300" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Team Access</p>
                  <span className="text-sm font-bold">Manager Registry Approved</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="card p-8 border-dashed border-2 bg-slate-50/50 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-300 mb-6">
              <Hash size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Operator Tip</p>
            <p className="text-sm text-slate-600 font-bold leading-relaxed">
              "Search feature respects casing. For Plot numbers, try using capital letters for faster indexing."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

