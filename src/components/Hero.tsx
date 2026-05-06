import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section style={{ 
      padding: '4rem 2rem', 
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.5rem'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 style={{ fontSize: '4rem', lineHeight: 1.1, marginBottom: '1rem' }}>
          Secure Your <span className="gradient-text">Academic Future</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Advanced AI-powered validation system to detect forged certificates and verify academic credentials in seconds.
        </p>
      </motion.div>
      
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', zIndex: -1, width: '100%', height: '500px', pointerEvents: 'none' }}>
        <div style={{ 
          position: 'absolute', 
          width: '300px', 
          height: '300px', 
          background: 'var(--primary)', 
          filter: 'blur(150px)', 
          opacity: 0.2,
          top: '20%',
          left: '30%'
        }} />
        <div style={{ 
          position: 'absolute', 
          width: '300px', 
          height: '300px', 
          background: 'var(--accent)', 
          filter: 'blur(150px)', 
          opacity: 0.2,
          bottom: '20%',
          right: '30%'
        }} />
      </div>
    </section>
  );
};

export default Hero;
