import React, { useState } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  CheckSquare, 
  Database, 
  MessageSquare, 
  Bell, 
  User, 
  Search,
  ChevronRight,
  Monitor,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import ValidatorPipeline from './components/ValidatorPipeline';
import CertificateGenerator from './components/CertificateGenerator';
import AIChatbot from './components/AIChatbot';
import type { PipelineResults } from './utils/AIAnalyzer';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'validator' | 'generator' | 'database'>('dashboard');
  const [showChat, setShowChat] = useState(false);
  const [lastResult, setLastResult] = useState<PipelineResults>();

  const menuItems = [
    { id: 'dashboard', label: 'Command Center', icon: <LayoutDashboard size={20} /> },
    { id: 'validator', label: 'AI Validator', icon: <CheckSquare size={20} /> },
    { id: 'generator', label: 'Cert Issuer', icon: <Award size={20} /> },
    { id: 'database', label: 'ID Registry', icon: <Database size={20} /> },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_15px_var(--primary-glow)]">
            <Shield className="text-bg-deep" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold outfit leading-none tracking-tight">CertiGuard</span>
            <span className="text-[10px] mono text-primary font-bold tracking-[0.2em]">OS v1.0.4</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === item.id 
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_0_10px_rgba(0,242,255,0.05)]' 
                : 'text-text-dim hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              <span className="text-sm font-semibold outfit">{item.label}</span>
              {activeTab === item.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4 pt-6 border-t border-border-light">
          <div className="flex items-center gap-3 px-4">
            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/30">
              <User size={16} className="text-secondary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold">Admin_User</span>
              <span className="text-[9px] text-text-dim mono">LVL-4 ACCESS</span>
            </div>
          </div>
          <button className="w-full btn btn-ghost !text-[10px] !py-2 justify-center gap-2">
             Source Repository
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content flex flex-col">
        {/* Top Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2 text-text-dim text-sm mono">
             <Monitor size={14} className="text-primary" />
             <span>SYSTEM:</span>
             <span className="text-text-main">READY_FOR_VALIDATION</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={16} />
              <input 
                className="bg-surface border border-border-light rounded-lg pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-primary/50 w-64 transition-all"
                placeholder="Global search certificates..."
              />
            </div>
            <button className="relative text-text-dim hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full" />
            </button>
          </div>
        </header>

        {/* Dynamic Views */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div key="dash" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Dashboard />
              </motion.div>
            )}
            {activeTab === 'validator' && (
              <motion.div key="val" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <ValidatorPipeline onResult={(res) => {
                  setLastResult(res);
                  setShowChat(true);
                }} />
              </motion.div>
            )}
            {activeTab === 'generator' && (
              <motion.div key="gen" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <CertificateGenerator />
              </motion.div>
            )}
            {activeTab === 'database' && (
              <motion.div key="db" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="glass p-20 text-center text-text-dim italic">
                <Database size={48} className="mx-auto mb-4 opacity-20" />
                Registry view under development for Day 2.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating AI Chatbot Toggle */}
        <div className="fixed bottom-8 right-8 z-50">
          <AnimatePresence>
            {showChat && (
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="mb-4 w-96 shadow-2xl"
              >
                <AIChatbot result={lastResult} />
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setShowChat(!showChat)}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 ${
              showChat ? 'bg-accent rotate-90' : 'bg-primary hover:scale-110 shadow-[0_0_20px_var(--primary-glow)]'
            }`}
          >
            {showChat ? <MessageSquare className="text-white" /> : <MessageSquare className="text-bg-deep" />}
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
