import React, { useState, useRef } from 'react';
import { Upload, Search, Loader2, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { performOCR, parseExtractedText, scanQRCode } from '../lib/ocr';
import { validateCertificate } from '../lib/validator';
import type { ValidationResult } from '../lib/validator';
import { motion, AnimatePresence } from 'framer-motion';

const VerifyModule: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleVerify = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(0);
    
    try {
      // 1. Try QR Scanning first (faster and more accurate for the new flow)
      const qrData = await scanQRCode(file);
      
      let extracted;
      if (qrData) {
        console.log('QR Code detected:', qrData);
        extracted = qrData;
      } else {
        // 2. Fallback to OCR if no QR code found
        const text = await performOCR(file, (p) => setProgress(p));
        extracted = parseExtractedText(text);
      }

      const validationResult = validateCertificate(extracted);
      setResult(validationResult);
    } catch (error) {
      console.error(error);
      alert('Failed to process image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Upload Section */}
        <section className="glass-morphism" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Upload size={20} color="var(--primary)" />
            Upload Certificate
          </h3>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            style={{ 
              border: '2px dashed var(--glass-border)', 
              borderRadius: '12px', 
              padding: '3rem', 
              textAlign: 'center', 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: preview ? 'transparent' : 'hsla(0, 0%, 100%, 0.02)'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
          >
            {preview ? (
              <img src={preview} alt="Preview" style={{ maxWidth: '100%', borderRadius: '8px', maxHeight: '300px' }} />
            ) : (
              <div style={{ color: 'var(--muted)' }}>
                <Upload size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>Click or drag to upload JPG/PNG certificate</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
              accept="image/*"
            />
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}
            disabled={!file || loading}
            onClick={handleVerify}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Processing ({Math.round(progress * 100)}%)
              </>
            ) : (
              <>
                <Search size={18} />
                Verify Authenticity
              </>
            )}
          </button>
        </section>

        {/* Results Section */}
        <section className="glass-morphism" style={{ padding: '2rem', minHeight: '400px' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={20} color="var(--accent)" />
            Validation Analysis
          </h3>

          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: 'center', color: 'var(--muted)', marginTop: '4rem' }}
              >
                <Search size={64} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                <p>Upload and verify a certificate to see results</p>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: 'center', marginTop: '4rem' }}
              >
                <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto mb-4' }}>
                   <div style={{ 
                     position: 'absolute', 
                     inset: 0, 
                     border: '4px solid var(--glass-border)', 
                     borderRadius: '50%' 
                   }} />
                   <motion.div 
                    style={{ 
                      position: 'absolute', 
                      inset: 0, 
                      border: '4px solid var(--primary)', 
                      borderRadius: '50%',
                      borderTopColor: 'transparent'
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                   />
                </div>
                <p style={{ marginTop: '1rem' }}>AI is analyzing certificate patterns...</p>
              </motion.div>
            )}

            {result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              >
                <div style={{ 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  background: result.isValid ? 'hsla(142, 70%, 45%, 0.1)' : 'hsla(0, 84%, 60%, 0.1)',
                  border: `1px solid ${result.isValid ? 'var(--success)' : 'var(--error)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  {result.isValid ? <CheckCircle2 color="var(--success)" /> : <AlertTriangle color="var(--error)" />}
                  <div>
                    <h4 style={{ color: result.isValid ? 'var(--success)' : 'var(--error)' }}>
                      {result.isValid ? 'Certificate Verified' : result.isTampered ? 'Tampering Detected' : 'Invalid Certificate'}
                    </h4>
                    <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>AI Confidence: {result.confidence}%</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="glass-morphism" style={{ padding: '1rem', background: 'hsla(0,0%,100%,0.02)' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '4px' }}>EXTRACTED NAME</p>
                    <p style={{ fontWeight: 600 }}>{result.extractedData.studentName || 'Not found'}</p>
                  </div>
                  <div className="glass-morphism" style={{ padding: '1rem', background: 'hsla(0,0%,100%,0.02)' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '4px' }}>ENROLLMENT NO.</p>
                    <p style={{ fontWeight: 600 }}>{result.extractedData.enrollmentNumber || 'Not found'}</p>
                  </div>
                </div>

                {result.discrepancies.length > 0 && (
                  <div>
                    <h5 style={{ color: 'var(--error)', marginBottom: '8px', fontSize: '0.9rem' }}>Discrepancies Found:</h5>
                    <ul style={{ fontSize: '0.85rem', color: 'var(--muted)', paddingLeft: '1.2rem' }}>
                      {result.discrepancies.map((d, i) => <li key={i} style={{ marginBottom: '4px' }}>{d}</li>)}
                    </ul>
                  </div>
                )}

                {result.tamperingDetails.length > 0 && (
                  <div>
                    <h5 style={{ color: 'var(--error)', marginBottom: '8px', fontSize: '0.9rem' }}>Tampering Evidence:</h5>
                    <ul style={{ fontSize: '0.85rem', color: 'var(--muted)', paddingLeft: '1.2rem' }}>
                      {result.tamperingDetails.map((d, i) => <li key={i} style={{ marginBottom: '4px' }}>{d}</li>)}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
};

export default VerifyModule;
