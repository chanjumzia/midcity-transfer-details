import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PackageCheck, 
  Search, 
  ChevronRight, 
  UserCheck, 
  Calendar,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { storageService } from '../services/storage';
import { LandTransfer } from '../types';

export default function ArchiveView() {
  const navigate = useNavigate();
  const [completedTransfers, setCompletedTransfers] = useState<LandTransfer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const all = storageService.getTransfers();
    // Only show Completed transfers
    setCompletedTransfers(all.filter(t => t.status === 'Completed'));
  }, []);

  const filtered = completedTransfers.filter(t => 
    t.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.plotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.mclrNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Completed Registry</h2>
          <p className="text-slate-500 font-medium">Archive of delivered documents and received files</p>
        </div>
        
        <div className="relative group min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-midcity-green transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search MCLR, Plot, or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-100 rounded-2xl focus:border-midcity-green/30 focus:ring-4 focus:ring-midcity-green/5 outline-none transition-all font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <PackageCheck className="text-slate-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No archived records found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">Only transfers marked as "Completed" appear here in the registry.</p>
          </div>
        ) : (
          filtered.map((t, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={t.id}
              onClick={() => navigate(`/transfer/${t.id}`)}
              className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:border-midcity-green/20 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-midcity-green/5 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full"></div>
              
              <div className="flex flex-col lg:flex-row lg:items-center gap-8 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-midcity-green rounded-2xl flex flex-col items-center justify-center text-white shrink-0 shadow-lg shadow-midcity-green/20">
                    <span className="text-[10px] font-black uppercase opacity-70">File</span>
                    <PackageCheck size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">{t.plotNumber}</h4>
                    <p className="text-sm font-bold text-midcity-green uppercase tracking-widest">{t.mclrNumber}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{t.block} • {t.size}</p>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 border-l border-slate-100 pl-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><UserCheck size={16} /></div>
                       <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Parties Involved</p>
                         <p className="text-sm font-bold text-slate-800">S: {t.sellerName}</p>
                         <p className="text-sm font-bold text-slate-800">B: {t.buyerName}</p>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-midcity-green/10 rounded-lg text-midcity-green"><Calendar size={16} /></div>
                       <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Collection History</p>
                         <p className="text-sm font-bold text-slate-800">Collected: {t.collectionInfo?.receivedDate || t.transferDate}</p>
                         <p className="text-[10px] font-black text-midcity-green uppercase">
                           By: {t.collectionInfo?.receivedBy === 'Self' ? 'Buyer (Self)' : `Other (${t.collectionInfo?.receiverName})`}
                         </p>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  <div className="px-5 py-2.5 bg-midcity-green text-white text-xs font-black uppercase tracking-widest rounded-full flex items-center gap-2 shadow-lg shadow-midcity-green/20">
                    <CheckCircle2 size={16} />
                    <span>Registry Archived</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 group-hover:text-midcity-green font-bold text-sm transition-colors uppercase tracking-widest">
                    <span>Manage Details</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {t.collectionInfo?.receivedBy === 'Representative' && (
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Attorney Collection</span>
                  <span>ID: {t.collectionInfo.receiverCnic}</span>
                  <span>Ph: {t.collectionInfo.receiverContact}</span>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

import { CheckCircle2 } from 'lucide-react';
