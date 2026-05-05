/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Edit2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { storageService } from '../services/storage';
import { LandTransfer } from '../types';

export default function HistoryView() {
  const [transfers, setTransfers] = useState<LandTransfer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    // Only show active or cancelled transfers here. Completed go to the Registry.
    const all = storageService.getTransfers();
    setTransfers(all.filter(t => t.status !== 'Completed'));
  }, []);

  const filteredTransfers = transfers.filter(t => {
    const matchesSearch = 
      t.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.plotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.block.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transfer History</h1>
          <p className="text-slate-500">Comprehensive log of all MIDCITY land transactions.</p>
        </div>
        <Link to="/reports" className="flex items-center gap-2 px-4 py-2 border-2 border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition-colors">
          <Download size={20} />
          <span>Export Summary</span>
        </Link>
      </div>

      <div className="card p-5 flex flex-col md:flex-row gap-5 bg-white/50 backdrop-blur-sm border-dashed">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by plot, name, or block..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-midcity-green/5 focus:border-midcity-green outline-none transition-all font-medium text-sm shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter size={16} className="text-slate-400" />
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-5 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-midcity-green/5 focus:border-midcity-green outline-none transition-all font-bold text-xs uppercase tracking-widest shadow-sm"
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        {filteredTransfers.length === 0 ? (
          <div className="p-20 text-center">
            <div className="inline-flex p-4 rounded-full bg-slate-100 mb-4 text-slate-400">
              <Search size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No results found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search terms or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Transaction Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Plot / Property</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Parties</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransfers.map((t, idx) => (
                  <motion.tr 
                    key={t.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50 group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{new Date(t.transferDate).toLocaleDateString()}</p>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Ref ID: {t.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-900">{t.plotNumber}</p>
                      <p className="text-xs font-bold text-midcity-green uppercase">{t.mclrNumber}</p>
                      <p className="text-[10px] font-medium text-slate-500">{t.block} • {t.size}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.05em] leading-none">Seller</p>
                        <p className="text-sm font-semibold text-slate-800">{t.sellerName}</p>
                        <div className="h-2 border-l border-slate-200 ml-1"></div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.05em] leading-none">Buyer</p>
                        <p className="text-sm font-semibold text-slate-800">{t.buyerName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        t.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        t.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {t.status === 'Completed' ? <CheckCircle2 size={14} /> : 
                         t.status === 'Pending' ? <Clock size={14} /> : <XCircle size={14} />}
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/edit/${t.id}`}
                          className="p-2 text-slate-400 hover:text-midcity-green hover:bg-midcity-green/5 rounded-lg transition-all"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg group-hover:block hidden">
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500 px-2 font-medium">
        <p>Showing {filteredTransfers.length} of {transfers.length} entries</p>
        <div className="flex gap-2">
          <button disabled className="px-4 py-2 opacity-50 cursor-not-allowed">Previous</button>
          <button disabled className="px-4 py-2 opacity-50 cursor-not-allowed">Next</button>
        </div>
      </div>
    </div>
  );
}
