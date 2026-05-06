import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, FileText, RefreshCw } from 'lucide-react';

import * as htmlToImage from 'html-to-image';

const GeneratorModule: React.FC = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    enrollmentNumber: '',
    collegeName: '',
    branch: '',
    semester: '',
    passingYear: ''
  });

  const certRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    if (qrRef.current === null) {
      return;
    }

    setGenerating(true);
    try {
      const dataUrl = await htmlToImage.toPng(qrRef.current, {
        cacheBust: true,
        backgroundColor: '#fff',
        pixelRatio: 4, // Very high quality for QR scanning
      });

      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = dataUrl;
      link.download = `QR-${formData.enrollmentNumber}.png`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    } catch (err) {
      console.error('oops, something went wrong!', err);
      alert('Failed to generate QR code. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2rem' }}>
        {/* Form Section */}
        <section className="glass-morphism" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="var(--primary)" />
            Certificate Details
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                  {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                </label>
                <input
                  type="text"
                  name={key}
                  value={(formData as any)[key]}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    background: 'hsla(0,0%,100%,0.05)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    color: 'white',
                    outline: 'none'
                  }}
                />
              </div>
            ))}
          </div>

          <button
            className="btn-primary"
            style={{ width: '100%', marginTop: '2rem', justifyContent: 'center' }}
            onClick={handleDownload}
            disabled={generating}
          >
            {generating ? (
              <RefreshCw className="animate-spin" size={18} />
            ) : (
              <Download size={18} />
            )}
            {generating ? 'Generating...' : 'Generate & Download'}
          </button>
        </section>

        {/* Certificate Preview */}
        <section className="glass-morphism" style={{ padding: '1rem', background: '#fff', color: '#000', overflow: 'hidden' }}>
          <div
            ref={certRef}
            style={{
              width: '100%',
              height: '100%',
              border: '20px solid #f8f9fa',
              padding: '3rem',
              position: 'relative',
              backgroundImage: 'radial-gradient(#eee 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            {/* Ornate Border Sim */}
            <div style={{ position: 'absolute', inset: '10px', border: '2px solid #333', opacity: 0.1 }} />

            <h4 style={{ fontSize: '1rem', letterSpacing: '4px', color: '#666', marginBottom: '1rem' }}>OFFICIAL ACADEMIC RECORD</h4>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#1a1a1a' }}>CERTIFICATE OF COMPLETION</h1>

            <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>This is to certify that</p>
            <h2 style={{ fontSize: '2rem', textDecoration: 'underline', marginBottom: '1.5rem', fontFamily: 'serif' }}>{formData.studentName}</h2>

            <p style={{ fontSize: '1.1rem', maxWidth: '80%', lineHeight: 1.6 }}>
              has successfully completed the <strong>{formData.branch}</strong> program
              at <strong>{formData.collegeName}</strong> for the <strong>{formData.semester}</strong> semester.
            </p>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-end' }}>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '0.9rem' }}>Enrollment No: <strong>{formData.enrollmentNumber}</strong></p>
                <p style={{ fontSize: '0.9rem' }}>Passing Year: <strong>{formData.passingYear}</strong></p>
                <div style={{ marginTop: '1rem', borderTop: '1px solid #000', width: '150px', paddingTop: '5px' }}>
                  <p style={{ fontSize: '0.8rem' }}>Registrar Signature</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div ref={qrRef} style={{ border: '4px solid #000', padding: '10px', background: '#fff' }}>
                  <QRCodeSVG
                    value={JSON.stringify(formData)}
                    size={200}
                    level="H"
                  />
                </div>
                <p style={{ fontSize: '0.7rem', marginTop: '4px' }}>SCAN TO VERIFY</p>
              </div>
            </div>

            <div style={{ position: 'absolute', bottom: '20px', right: '20px', opacity: 0.1 }}>
              <FileText size={100} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GeneratorModule;
