/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Printer, 
  LogOut, 
  Menu, 
  X,
  MapPin,
  TrendingUp,
  Clock,
  Landmark,
  PackageCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LandTransfer } from './types';
import { storageService } from './services/storage';

// Pages
import Dashboard from './components/Dashboard';
import TransferForm from './components/TransferForm';
import HistoryView from './components/HistoryView';
import PrintReport from './components/PrintReport';
import Login from './components/Login';

import ArchiveView from './components/ArchiveView';

const Sidebar = ({ isOpen, toggle, onLogout }: { isOpen: boolean, toggle: () => void, onLogout: () => void }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'New Transfer', path: '/new', icon: PlusCircle },
    { name: 'Active History', path: '/history', icon: History },
    { name: 'Completed Registry', path: '/archive', icon: PackageCheck },
    { name: 'Reports', path: '/reports', icon: Printer },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggle}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        className="fixed top-0 left-0 bottom-0 w-[280px] bg-midcity-green text-white z-50 transition-transform lg:translate-x-0 overflow-y-auto"
      >
        <div className="p-6 min-h-full flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
              <Landmark className="text-white" />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight">MIDCITY</h1>
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Office Portal</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && toggle()}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-white text-midcity-green font-bold shadow-xl shadow-black/10 translate-x-1' 
                      : 'hover:bg-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-white/10 mt-6">
            <div className="bg-white/5 rounded-2xl p-5 mb-4 border border-white/5 shadow-inner">
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-2">Authenticated As</p>
              <p className="text-md font-bold text-white">Anjum Zia</p>
              <p className="text-xs text-white/40 font-medium">Land Officer • ID: 7721</p>
            </div>
            
            <button 
              onClick={onLogout}
              className="flex items-center gap-3 w-full px-4 py-3.5 text-white/50 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all font-bold text-sm"
            >
              <LogOut size={20} />
              <span>Logout System</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('midcity_auth') === 'true';
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('midcity_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('midcity_auth');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#f1f5f9] flex no-print">
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggle={() => setIsSidebarOpen(!isSidebarOpen)} 
          onLogout={handleLogout}
        />
        
        <main className="flex-1 lg:ml-[280px]">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 flex items-center justify-between">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="hidden lg:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-0.5">MIDCITY Housing Pvt. Ltd.</p>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Main Dashboard</h2>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-midcity-green uppercase tracking-widest">Office Registry</p>
                <p className="text-sm font-bold text-slate-600">{new Date().toLocaleDateString('en-PK', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-midcity-green to-emerald-900 shadow-xl shadow-midcity-green/20 flex items-center justify-center text-white font-black border-2 border-white">
                AZ
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/new" element={<TransferForm />} />
              <Route path="/edit/:id" element={<TransferForm />} />
              <Route path="/history" element={<HistoryView />} />
              <Route path="/archive" element={<ArchiveView />} />
              <Route path="/reports" element={<PrintReport />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Separate Render for Print Only (Simplified for paper) */}
      <div className="print-only hidden">
         <Routes>
           <Route path="/reports" element={<PrintReport />} />
           <Route path="*" element={<div className="p-8">Please use the Reports page for printing.</div>} />
         </Routes>
      </div>
    </Router>
  );
}
