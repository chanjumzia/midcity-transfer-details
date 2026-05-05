/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Trash2, CheckCircle2, PackageCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { storageService } from '../services/storage';
import { LandTransfer, TransferStatus } from '../types';
import { toTitleCase, toSentenceCase } from '../lib/utils';

export default function TransferForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<Partial<LandTransfer>>({
    buyerName: '',
    buyerMcNumber: '',
    sellerName: '',
    sellerMcNumber: '',
    mclrNumber: '',
    plotNumber: '',
    block: '',
    size: '5 Marla',
    transferDate: new Date().toISOString().split('T')[0],
    status: 'Pending',
    sellerDocs: {
      gainTax236C: 'Not Submitted',
      exciseNOC: 'Not Submitted',
      fbrForm7E: 'Not Submitted',
      ndcFee: 'Not Submitted'
    },
    buyerDocs: {
      transferFee: 'Not Submitted',
      stampDuty: 'Not Submitted',
      fbrTax236K: 'Not Submitted'
    },
    representative: {
      isRepresentative: false,
      name: '',
      cnic: '',
      contact: ''
    },
    notes: ''
  });

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      const all = storageService.getTransfers();
      const existing = all.find(t => t.id === id);
      if (existing) {
        setFormData(existing);
      }
    }
  }, [id, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Formatting data to Sentence/Title Case before saving
    const transfer: LandTransfer = {
      ...(formData as LandTransfer),
      id: isEditing && id ? id : Math.random().toString(36).substr(2, 9),
      buyerName: toTitleCase(formData.buyerName || ''),
      sellerName: toTitleCase(formData.sellerName || ''),
      block: toTitleCase(formData.block || ''),
      plotNumber: (formData.plotNumber || '').toUpperCase(), // Identity usually stays uppercase
      mclrNumber: (formData.mclrNumber || '').toUpperCase(),
      buyerMcNumber: (formData.buyerMcNumber || '').toUpperCase(),
      sellerMcNumber: (formData.sellerMcNumber || '').toUpperCase(),
      representative: {
        ...(formData.representative || { isRepresentative: false, name: '', cnic: '', contact: '' }),
        name: toTitleCase(formData.representative?.name || ''),
        cnic: (formData.representative?.cnic || '').toUpperCase(),
      },
      collectionInfo: formData.status === 'Completed' ? {
        ...(formData.collectionInfo || { receivedDate: new Date().toISOString().split('T')[0], receivedBy: 'Self' }),
        receiverName: toTitleCase(formData.collectionInfo?.receiverName || ''),
        receiverCnic: (formData.collectionInfo?.receiverCnic || '').toUpperCase(),
      } : undefined,
      createdAt: isEditing ? (formData as LandTransfer).createdAt : new Date().toISOString(),
    };

    storageService.saveTransfer(transfer);
    setIsSaved(true);
    setTimeout(() => {
      navigate('/history');
    }, 1500);
  };

  const handleDelete = () => {
    if (id && window.confirm('Are you sure you want to delete this record?')) {
      storageService.deleteTransfer(id);
      navigate('/history');
    }
  };

  if (isSaved) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h2 className="text-2xl font-bold text-slate-900">Record Saved Successfully!</h2>
        <p className="text-slate-500 mt-2">Redirecting to history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isEditing ? 'Edit Land Transfer' : 'New Land Transfer'}</h1>
          <p className="text-slate-500">Enter transfer details accurately for verification.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-6">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-4">Primary Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Seller Name</label>
                  <input 
                    required
                    value={formData.sellerName}
                    onChange={e => setFormData({...formData, sellerName: e.target.value})}
                    className="form-input"
                    placeholder="Seller Full Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Seller MC No.</label>
                  <input 
                    required
                    value={formData.sellerMcNumber}
                    onChange={e => setFormData({...formData, sellerMcNumber: e.target.value})}
                    className="form-input"
                    placeholder="MC No."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Buyer Name</label>
                  <input 
                    required
                    value={formData.buyerName}
                    onChange={e => setFormData({...formData, buyerName: e.target.value})}
                    className="form-input"
                    placeholder="Buyer Full Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Buyer MC No.</label>
                  <input 
                    required
                    value={formData.buyerMcNumber}
                    onChange={e => setFormData({...formData, buyerMcNumber: e.target.value})}
                    className="form-input"
                    placeholder="MC No."
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">MCLR / Membership No.</label>
                <input 
                  required
                  value={formData.mclrNumber}
                  onChange={e => setFormData({...formData, mclrNumber: e.target.value})}
                  className="form-input font-bold text-midcity-green"
                  placeholder="MCLR-XXXX"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Plot Number</label>
                <input 
                  required
                  value={formData.plotNumber}
                  onChange={e => setFormData({...formData, plotNumber: e.target.value})}
                  className="form-input"
                  placeholder="e.g. 123-A"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Block / Sector</label>
                <input 
                  required
                  value={formData.block}
                  onChange={e => setFormData({...formData, block: e.target.value})}
                  className="form-input"
                  placeholder="e.g. Block C"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Size / Area</label>
                <select 
                  value={formData.size}
                  onChange={e => setFormData({...formData, size: e.target.value})}
                  className="form-input"
                >
                  <option value="5 Marla">5 Marla</option>
                  <option value="10 Marla">10 Marla</option>
                  <option value="12 Marla">12 Marla</option>
                  <option value="1 Kanal">1 Kanal</option>
                  <option value="2 Kanal">2 Kanal</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-6">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-4 flex items-center justify-between">
              <span>Seller Documentation & Taxes</span>
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase font-black">Mandatory for Transfer</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Gain Tax (236-C)</label>
                <select 
                  value={formData.sellerDocs?.gainTax236C}
                  onChange={e => setFormData({
                    ...formData, 
                    sellerDocs: { ...formData.sellerDocs!, gainTax236C: e.target.value as any }
                  })}
                  className="form-input"
                >
                  <option value="Not Submitted">Not Submitted</option>
                  <option value="Pending">Pending Verification</option>
                  <option value="Verified">Verified / Paid</option>
                  <option value="Exempted">Exempted</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Excise NOC</label>
                <select 
                  value={formData.sellerDocs?.exciseNOC}
                  onChange={e => setFormData({
                    ...formData, 
                    sellerDocs: { ...formData.sellerDocs!, exciseNOC: e.target.value as any }
                  })}
                  className="form-input"
                >
                  <option value="Not Submitted">Not Submitted</option>
                  <option value="Pending">In Process</option>
                  <option value="Verified">NOC Received</option>
                  <option value="Exempted">Not Applicable</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">FBR Form 7E Status</label>
                <select 
                  value={formData.sellerDocs?.fbrForm7E}
                  onChange={e => setFormData({
                    ...formData, 
                    sellerDocs: { ...formData.sellerDocs!, fbrForm7E: e.target.value as any }
                  })}
                  className="form-input"
                >
                  <option value="Not Submitted">Not Submitted</option>
                  <option value="Pending">Pending</option>
                  <option value="Verified">Available</option>
                  <option value="Exempted">Exempted</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">NDC Fee Status</label>
                <select 
                  value={formData.sellerDocs?.ndcFee}
                  onChange={e => setFormData({
                    ...formData, 
                    sellerDocs: { ...formData.sellerDocs!, ndcFee: e.target.value as any }
                  })}
                  className="form-input"
                >
                  <option value="Not Submitted">Unpaid</option>
                  <option value="Pending">Processing</option>
                  <option value="Verified">Paid & Verified</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-6">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-4 flex items-center justify-between">
              <span>Buyer Documentation & Representative</span>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase font-black">Nominee Details</span>
            </h3>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-10 h-6 rounded-full transition-all relative ${formData.representative?.isRepresentative ? 'bg-midcity-green' : 'bg-slate-200'}`}>
                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.representative?.isRepresentative ? 'left-5' : 'left-1'}`}></div>
                </div>
                <input 
                  type="checkbox"
                  className="hidden"
                  checked={formData.representative?.isRepresentative}
                  onChange={e => setFormData({
                    ...formData,
                    representative: { ...formData.representative!, isRepresentative: e.target.checked }
                  })}
                />
                <span className="text-sm font-bold text-slate-700">Someone else is signing on behalf of Buyer?</span>
              </label>

              {formData.representative?.isRepresentative && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-200/50"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Representative Name</label>
                    <input 
                      value={formData.representative?.name}
                      onChange={e => setFormData({
                        ...formData,
                        representative: { ...formData.representative!, name: e.target.value }
                      })}
                      className="form-input bg-white"
                      placeholder="Name of Signatory"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Representative CNIC</label>
                    <input 
                      value={formData.representative?.cnic}
                      onChange={e => setFormData({
                        ...formData,
                        representative: { ...formData.representative!, cnic: e.target.value }
                      })}
                      className="form-input bg-white"
                      placeholder="00000-0000000-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Contact No.</label>
                    <input 
                      value={formData.representative?.contact}
                      onChange={e => setFormData({
                        ...formData,
                        representative: { ...formData.representative!, contact: e.target.value }
                      })}
                      className="form-input bg-white"
                      placeholder="03XX-XXXXXXX"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Transfer Fee</label>
                <select 
                  value={formData.buyerDocs?.transferFee}
                  onChange={e => setFormData({
                    ...formData, 
                    buyerDocs: { ...formData.buyerDocs!, transferFee: e.target.value as any }
                  })}
                  className="form-input"
                >
                  <option value="Not Submitted">Unpaid</option>
                  <option value="Pending">Pending</option>
                  <option value="Verified">Paid & Clear</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Stamp Duty</label>
                <select 
                  value={formData.buyerDocs?.stampDuty}
                  onChange={e => setFormData({
                    ...formData, 
                    buyerDocs: { ...formData.buyerDocs!, stampDuty: e.target.value as any }
                  })}
                  className="form-input"
                >
                  <option value="Not Submitted">Not Submitted</option>
                  <option value="Pending">In Process</option>
                  <option value="Verified">Verified</option>
                  <option value="Exempted">Exempted</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">FBR Tax (236-K)</label>
                <select 
                  value={formData.buyerDocs?.fbrTax236K}
                  onChange={e => setFormData({
                    ...formData, 
                    buyerDocs: { ...formData.buyerDocs!, fbrTax236K: e.target.value as any }
                  })}
                  className="form-input"
                >
                  <option value="Not Submitted">Not Submitted</option>
                  <option value="Pending">Pending</option>
                  <option value="Verified">Paid / Verified</option>
                  <option value="Exempted">Exempted</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-6">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-4 flex items-center justify-between">
               <span>Processing Details</span>
               <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase font-black">Official Tracking</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Application Status</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value as TransferStatus})}
                  className="form-input"
                >
                  <option value="Pending">Pending (In-Process)</option>
                  <option value="Completed">Completed (File Delivered)</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Date of Transaction</label>
                <input 
                  type="date"
                  required
                  value={formData.transferDate}
                  onChange={e => setFormData({...formData, transferDate: e.target.value})}
                  className="form-input"
                />
              </div>
            </div>

            {formData.status === 'Completed' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-6 border-t border-slate-100 space-y-6"
              >
                <h4 className="flex items-center gap-2 text-sm font-black text-midcity-green uppercase tracking-widest">
                  <PackageCheck size={18} />
                  File Collection Registry
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Received Date</label>
                    <input 
                      type="date"
                      value={formData.collectionInfo?.receivedDate || new Date().toISOString().split('T')[0]}
                      onChange={e => setFormData({
                        ...formData,
                        collectionInfo: { ...(formData.collectionInfo || { receivedBy: 'Self', receivedDate: '' }), receivedDate: e.target.value }
                      })}
                      className="form-input bg-midcity-green/5 border-midcity-green/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Received By</label>
                    <select 
                      value={formData.collectionInfo?.receivedBy || 'Self'}
                      onChange={e => setFormData({
                        ...formData,
                        collectionInfo: { ...(formData.collectionInfo || { receivedDate: '', receivedBy: 'Self' }), receivedBy: e.target.value as any }
                      })}
                      className="form-input bg-midcity-green/5 border-midcity-green/20"
                    >
                      <option value="Self">Purchaser (Self)</option>
                      <option value="Representative">Representative / Attorney</option>
                    </select>
                  </div>
                </div>

                {formData.collectionInfo?.receivedBy === 'Representative' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-amber-50 rounded-2xl border border-amber-200/50"
                  >
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Receiver Name</label>
                      <input 
                        value={formData.collectionInfo?.receiverName || ''}
                        onChange={e => setFormData({
                          ...formData,
                          collectionInfo: { ...formData.collectionInfo!, receiverName: e.target.value }
                        })}
                        className="form-input bg-white"
                        placeholder="Name of receiver"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Receiver CNIC</label>
                      <input 
                        value={formData.collectionInfo?.receiverCnic || ''}
                        onChange={e => setFormData({
                          ...formData,
                          collectionInfo: { ...formData.collectionInfo!, receiverCnic: e.target.value }
                        })}
                        className="form-input bg-white"
                        placeholder="CNIC of receiver"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Receiver Contact</label>
                      <input 
                        value={formData.collectionInfo?.receiverContact || ''}
                        onChange={e => setFormData({
                          ...formData,
                          collectionInfo: { ...formData.collectionInfo!, receiverContact: e.target.value }
                        })}
                        className="form-input bg-white"
                        placeholder="Phone number"
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Notes / Remarks</label>
              <textarea 
                rows={3}
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                className="form-input"
                placeholder="Any special remarks..."
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            {isEditing && (
              <button 
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-rose-600 font-bold hover:bg-rose-50 rounded-lg transition-colors border-2 border-rose-100"
              >
                <Trash2 size={20} />
                <span>Delete Record</span>
              </button>
            )}
            <button type="submit" className="btn-primary ml-auto shadow-lg shadow-midcity-green/20 min-w-[200px]">
              <Save size={20} />
              <span>{isEditing ? 'Update Record' : 'Save Transfer'}</span>
            </button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="card p-6 bg-slate-900 text-white border-0">
            <h3 className="font-bold text-lg mb-4">Transfer Guidelines</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-midcity-green text-white flex shrink-0 items-center justify-center text-[10px] font-bold">1</div>
                <p>Ensure Seller's allotment letter is verified against the original ledger.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-midcity-green text-white flex shrink-0 items-center justify-center text-[10px] font-bold">2</div>
                <p>Buyer's CNIC must be valid and a copy should be attached to the physical file.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-midcity-green text-white flex shrink-0 items-center justify-center text-[10px] font-bold">3</div>
                <p>Transfer status should only be marked 'Completed' after all dues are clear.</p>
              </li>
            </ul>
          </div>

          <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Internal Note</p>
            <p className="text-sm text-slate-600">
              Records are saved to your local database securely. You can export these to PDF from the 'Reports' section for printing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
