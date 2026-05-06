import React from 'react';
import { Shield, CheckCircle, PenTool as Tool } from 'lucide-react';

interface NavbarProps {
  activeTab: 'verify' | 'generate';
  setActiveTab: (tab: 'verify' | 'generate') => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="glass-morphism" style={{ 
      position: 'sticky', 
      top: '1rem', 
      margin: '1rem 2rem', 
      padding: '1rem 2rem', 
      zIndex: 100,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Shield size={32} color="var(--primary)" />
        <span style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Outfit' }}>
          Certi<span className="gradient-text">Guard</span> AI
        </span>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          onClick={() => setActiveTab('verify')}
          className="btn-primary" 
          style={{ 
            background: activeTab === 'verify' ? 'var(--primary)' : 'transparent',
            border: activeTab === 'verify' ? 'none' : '1px solid var(--glass-border)'
          }}
        >
          <CheckCircle size={18} />
          Verify
        </button>
        <button 
          onClick={() => setActiveTab('generate')}
          className="btn-primary" 
          style={{ 
            background: activeTab === 'generate' ? 'var(--primary)' : 'transparent',
            border: activeTab === 'generate' ? 'none' : '1px solid var(--glass-border)'
          }}
        >
          <Tool size={18} />
          Generator
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
