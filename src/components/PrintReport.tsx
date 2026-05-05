/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Printer, Landmark, Download, FileText, Calendar } from 'lucide-react';
import { storageService } from '../services/storage';
import { LandTransfer } from '../types';

export default function PrintReport() {
  const [transfers, setTransfers] = useState<LandTransfer[]>([]);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    setTransfers(storageService.getTransfers());
  }, []);

  const reportData = transfers.filter(t => {
    const d = new Date(t.transferDate).getTime();
    return d >= new Date(dateRange.start).getTime() && d <= new Date(dateRange.end).getTime();
  }).sort((a, b) => new Date(a.transferDate).getTime() - new Date(b.transferDate).getTime());

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Configuration View (Hidden in Print) */}
      <div className="no-print space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Generate Reports</h1>
          <p className="text-slate-500">Filter transactions to generate a printable summary.</p>
        </div>

        <div className="card p-6 border-2 border-midcity-green bg-white/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                <Calendar size={16} /> From Date
              </label>
              <input 
                type="date"
                value={dateRange.start}
                onChange={e => setDateRange({...dateRange, start: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-midcity-green"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                <Calendar size={16} /> To Date
              </label>
              <input 
                type="date"
                value={dateRange.end}
                onChange={e => setDateRange({...dateRange, end: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-midcity-green"
              />
            </div>
            <button 
              onClick={handlePrint}
              className="btn-primary"
            >
              <Printer size={20} />
              <span>Print Summary Now</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Items Found</p>
              <p className="text-2xl font-bold text-slate-900">{reportData.length} records</p>
            </div>
          </div>
          <div className="card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Download size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Ready to Export</p>
              <p className="text-base font-semibold text-slate-600">CSV/Excel export coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Report View */}
      <div className="print-only hidden lg:block bg-white p-8 min-h-screen">
        <div className="flex items-center justify-between border-b-4 border-slate-900 pb-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-xl flex items-center justify-center">
              <Landmark size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">MIDCITY Housing</h1>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">Land Transfer Department</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold uppercase tracking-wider mb-1">Transfer Summary Report</h2>
            <p className="text-sm font-medium text-slate-500">{dateRange.start} — {dateRange.end}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-10">
          <div className="border-l-4 border-midcity-green pl-4">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Generated By</p>
            <p className="text-base font-bold text-slate-800 tracking-tight">Anjum Zia</p>
            <p className="text-xs text-slate-500 font-medium lowercase italic">anjumzia76@gmail.com</p>
          </div>
          <div className="border-l-4 border-midcity-green pl-4">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Report Date</p>
            <p className="text-base font-bold text-slate-800 tracking-tight">{new Date().toLocaleDateString()}</p>
          </div>
          <div className="border-l-4 border-midcity-green pl-4">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Volume</p>
            <p className="text-base font-bold text-slate-800 tracking-tight">{reportData.length} Transfers</p>
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100 border-y-2 border-slate-900">
              <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-900">S.No</th>
              <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-900">MCLR No</th>
              <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-900">Plot Info</th>
              <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-900">Parties & MC Nos</th>
              <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-900 text-center">S.Docs</th>
              <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-900 text-center">B.Docs</th>
              <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {reportData.map((t, i) => (
              <tr key={t.id}>
                <td className="px-4 py-3 text-sm font-bold text-slate-600">{i + 1}</td>
                <td className="px-4 py-3 text-sm font-bold text-slate-900">{t.mclrNumber}</td>
                <td className="px-4 py-3">
                  <p className="text-sm font-bold">{t.plotNumber}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{t.block} • {t.size}</p>
                </td>
                <td className="px-4 py-3">
                   <p className="text-xs font-bold text-slate-900">S: {t.sellerName} <span className="text-[10px] text-slate-400">({t.sellerMcNumber})</span></p>
                   <p className="text-xs font-bold text-slate-900">B: {t.buyerName} <span className="text-[10px] text-slate-400">({t.buyerMcNumber})</span></p>
                   {t.representative?.isRepresentative && (
                     <p className="text-[10px] text-rose-600 font-bold italic mt-0.5">
                       Signed by Representative: {t.representative.name} ({t.representative.cnic})
                     </p>
                   )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[8px] font-black">{t.sellerDocs?.gainTax236C === 'Verified' ? '236C ✓' : '236C ✗'}</span>
                    <span className="text-[8px] font-black">{t.sellerDocs?.exciseNOC === 'Verified' ? 'NOC ✓' : 'NOC ✗'}</span>
                    <span className="text-[8px] font-black">{t.sellerDocs?.fbrForm7E === 'Verified' ? '7E ✓' : '7E ✗'}</span>
                    <span className="text-[8px] font-black">{t.sellerDocs?.ndcFee === 'Verified' ? 'NDC ✓' : 'NDC ✗'}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[8px] font-black text-blue-700">{t.buyerDocs?.transferFee === 'Verified' ? 'TF ✓' : 'TF ✗'}</span>
                    <span className="text-[8px] font-black text-blue-700">{t.buyerDocs?.stampDuty === 'Verified' ? 'SD ✓' : 'SD ✗'}</span>
                    <span className="text-[8px] font-black text-blue-700">{t.buyerDocs?.fbrTax236K === 'Verified' ? '236K ✓' : '236K ✗'}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-black uppercase tracking-tighter">{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {reportData.length === 0 && (
          <div className="py-20 text-center text-slate-400 italic">No records found for this period.</div>
        )}

        <div className="mt-20 flex flex-col items-end gap-12">
          <div className="text-center w-64 border-t-2 border-slate-900 pt-2">
            <p className="font-black uppercase tracking-widest text-xs text-slate-900">Authorized Signature</p>
            <p className="text-sm text-slate-500 mt-1">Land Transfer Officer</p>
          </div>
          <div className="text-right w-full text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">
            MIDCITY Housing Pvt. Ltd. Official System Generated Document
          </div>
        </div>
      </div>
    </div>
  );
}
