import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VerifyModule from './components/VerifyModule';
import GeneratorModule from './components/GeneratorModule';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState<'verify' | 'generate'>('verify');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main>
        <Hero />
        
        <AnimatePresence mode="wait">
          {activeTab === 'verify' ? (
            <motion.div
              key="verify"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <VerifyModule />
            </motion.div>
          ) : (
            <motion.div
              key="generate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <GeneratorModule />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        borderTop: '1px solid var(--glass-border)',
        color: 'var(--muted)',
        fontSize: '0.9rem'
      }}>
        <p>&copy; 2026 CertiGuard AI. Built for Hackathon Excellence.</p>
      </footer>
    </div>
  );
}

export default App;
