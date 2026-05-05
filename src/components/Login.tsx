/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Landmark, Lock, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would hit an API. For this professional UI, we simulate success.
    if (isLogin) {
      if (email && password) onLogin();
    } else {
      if (name && employeeId && email && password) {
        setIsLogin(true);
        alert('Account Created Successfully! Please Sign In.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#064e3b] flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/20">
          <div className="p-8 pb-2 text-center">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-midcity-green rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-midcity-green/30"
            >
              <Landmark className="text-white" size={32} />
            </motion.div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">MIDCITY Housing</h1>
            <p className="text-slate-500 font-bold text-sm tracking-tight mt-1 uppercase">
              {isLogin ? 'Officer Portal Login' : 'Register New Officer'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="form-input"
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Employee ID / Number</label>
                  <input 
                    type="text"
                    required
                    value={employeeId}
                    onChange={e => setEmployeeId(e.target.value)}
                    className="form-input"
                    placeholder="e.g. MCH-5521"
                  />
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-midcity-green/5 focus:border-midcity-green outline-none transition-all font-semibold text-sm"
                  placeholder="name@midcityhousing.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secret Password</label>
                {isLogin && <button type="button" className="text-[10px] font-black text-midcity-green uppercase tracking-widest hover:underline">Forgot?</button>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-midcity-green/5 focus:border-midcity-green outline-none transition-all font-semibold text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary py-4 rounded-2xl group mt-4">
              <span className="font-bold tracking-tight">{isLogin ? 'Secure Sign In' : 'Create Registry Account'}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="text-center pt-4">
              <button 
                type="button" 
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-bold text-slate-500 hover:text-midcity-green transition-colors"
              >
                {isLogin ? "Don't have an account? Register Now" : "Already have an account? Sign In"}
              </button>
            </div>

            <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em] pt-4">
              Strictly for MIDCITY Personnel only
            </p>
          </form>
        </div>
        
        <div className="mt-8 text-center text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">
          Official Land Management ERP v2.0
        </div>
      </motion.div>
    </div>
  );
}
