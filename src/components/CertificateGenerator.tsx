import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Download, Award, User, Calendar, Hash, Building, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const CertificateGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    course: 'Cybersecurity Domain 1',
    date: 'May 07, 2026',
    id: 'SENTINEL-X-99',
    org: 'ISC2 Academy'
  });

  const certRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (certRef.current === null) return;
    
    const dataUrl = await toPng(certRef.current, { 
      cacheBust: true,
      pixelRatio: 2 // Higher quality for PDF
    });

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [800, 566] // 1.414 aspect ratio roughly
    });

    pdf.addImage(dataUrl, 'PNG', 0, 0, 800, 566);
    const sanitizedName = formData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    pdf.save(`certificate-${sanitizedName}.pdf`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass p-8"
      >
        <h2 className="text-2xl font-bold outfit mb-6 flex items-center gap-2">
          <Award className="text-primary" /> Certificate Issuance
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-text-dim mb-2 block uppercase tracking-wider">Recipient Name</label>
            <input 
              className="w-full bg-surface border border-border-light rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-text-dim mb-2 block uppercase tracking-wider">Organization</label>
            <input 
              className="w-full bg-surface border border-border-light rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
              value={formData.org}
              onChange={(e) => setFormData({...formData, org: e.target.value})}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-text-dim mb-2 block uppercase tracking-wider">Course Name</label>
            <input 
              className="w-full bg-surface border border-border-light rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
              value={formData.course}
              onChange={(e) => setFormData({...formData, course: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-text-dim mb-2 block uppercase tracking-wider">Date</label>
              <input 
                className="w-full bg-surface border border-border-light rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-text-dim mb-2 block uppercase tracking-wider">Cert ID</label>
              <input 
                className="w-full bg-surface border border-border-light rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                value={formData.id}
                onChange={(e) => setFormData({...formData, id: e.target.value})}
              />
            </div>
          </div>

          <button onClick={handleDownload} className="btn btn-primary w-full mt-4 justify-center">
            <Download size={20} /> Generate & Download PDF
          </button>
          <p className="text-[10px] text-center text-text-dim italic">Note: Use ID 'SENTINEL-X-99' to test the Genuine verification flow.</p>
        </div>
      </motion.div>

      {/* Preview Section */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="sticky top-10"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-text-dim">Digital Twin Preview</h3>
          <div className="status-badge status-active">Live Rendering</div>
        </div>
        
        {/* Actual Certificate Template */}
        <div ref={certRef} style={{ 
          width: '100%', 
          aspectRatio: '1.414', 
          background: 'white', 
          color: '#1a1a1a', 
          padding: '40px',
          border: '15px solid #1a1a1a',
          position: 'relative',
          boxShadow: 'inset 0 0 0 5px #d4af37'
        }}>
          {/* Borders */}
          <div style={{ position: 'absolute', top: '15px', left: '15px', bottom: '15px', right: '15px', border: '1px solid #d4af37' }} />
          
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
             <Award size={60} color="#d4af37" style={{ marginBottom: '20px' }} />
             <h1 style={{ fontFamily: 'serif', fontSize: '48px', textTransform: 'uppercase', letterSpacing: '8px', margin: 0 }}>Certificate</h1>
             <p style={{ letterSpacing: '4px', textTransform: 'uppercase', fontSize: '12px', color: '#666' }}>of Professional Completion</p>
             
             <div style={{ margin: '40px 0' }}>
               <p style={{ fontStyle: 'italic', fontSize: '18px' }}>This is to certify that</p>
               <h2 style={{ fontSize: '42px', color: '#6366f1', margin: '15px 0', textDecoration: 'underline' }}>{formData.name}</h2>
               <p style={{ fontSize: '18px', maxWidth: '80%', margin: '0 auto' }}>
                 has successfully completed all requirements for
                 <br />
                 <strong style={{ fontSize: '24px' }}>{formData.course}</strong>
               </p>
               <p style={{ marginTop: '20px', color: '#444' }}>issued by {formData.org}</p>
             </div>

             <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', padding: '0 40px' }}>
                <div style={{ borderTop: '1px solid #1a1a1a', width: '180px', paddingTop: '10px' }}>
                  <p style={{ fontSize: '10px', color: '#666', margin: 0 }}>DATE: {formData.date}</p>
                </div>
                <div style={{ borderTop: '1px solid #1a1a1a', width: '180px', paddingTop: '10px' }}>
                  <p style={{ fontSize: '10px', color: '#666', margin: 0 }}>ID: {formData.id}</p>
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CertificateGenerator;
