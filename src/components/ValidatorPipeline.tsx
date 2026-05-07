import React, { useState } from 'react';
import { Upload, Cpu, ShieldCheck, ShieldAlert, Zap, Loader2, Database, Search, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractText } from '../utils/OCR';
import { scanQRCode } from '../utils/QRScanner';
import { analyzeCertificate, type PipelineResults } from '../utils/AIAnalyzer';
import { convertPDFToImage } from '../utils/PDFConverter';

const ValidatorPipeline: React.FC<{ onResult: (res: PipelineResults) => void }> = ({ onResult }) => {
  const [stage, setStage] = useState<'idle' | 'preprocessing' | 'ocr' | 'engine' | 'db' | 'fraud' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<PipelineResults | null>(null);

  const stages = [
    { id: 'preprocessing', label: 'Image Preprocessing', icon: <Zap size={18} /> },
    { id: 'ocr', label: 'OCR Extraction', icon: <Cpu size={18} /> },
    { id: 'engine', label: 'AI Engine Analysis', icon: <Search size={18} /> },
    { id: 'db', label: 'Database Verification', icon: <Database size={18} /> },
    { id: 'fraud', label: 'Fraud Detection Model', icon: <ShieldAlert size={18} /> }
  ];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResult(null);
    setStage('preprocessing');
    setProgress(10);

    try {
      let analysisFile: File | string = file;
      
      // If PDF, convert to image first
      if (file.type === 'application/pdf') {
        setProgress(15);
        analysisFile = await convertPDFToImage(file);
      }

      // 1. Preprocessing (Simulated)
      await new Promise(r => setTimeout(r, 1000));
      setStage('ocr');
      
      // 2. OCR & QR
      const [text, qr] = await Promise.all([
        extractText(analysisFile, (p) => setProgress(30 + p * 30)),
        scanQRCode(analysisFile)
      ]);
      
      setStage('engine');
      setProgress(70);
      
      // 3. AI Engine + DB + Fraud (Combined in analyzeCertificate)
      const analysis = await analyzeCertificate(text, qr);
      
      setStage('db');
      await new Promise(r => setTimeout(r, 1000));
      setStage('fraud');
      await new Promise(r => setTimeout(r, 1000));
      
      setResult(analysis);
      setStage('complete');
      onResult(analysis);
    } catch (err) {
      console.error(err);
      setStage('idle');
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass p-8 text-center relative overflow-hidden">
        {stage !== 'idle' && stage !== 'complete' && <div className="scan-line" />}
        
        <div className="max-w-md mx-auto">
          <Upload className="mx-auto text-primary mb-4" size={48} />
          <h2 className="text-2xl font-bold outfit mb-2">Upload Certificate</h2>
          <p className="text-text-dim mb-6 text-sm">AI-driven multi-stage authenticity verification pipeline</p>
          
          <label className="btn btn-primary w-full justify-center">
            <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleUpload} disabled={stage !== 'idle' && stage !== 'complete'} />
            {stage === 'idle' || stage === 'complete' ? "Begin Analysis" : "Analyzing..."}
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {stages.map((s, i) => (
          <div key={s.id} className={`glass p-4 text-center transition-all ${stage === s.id ? 'border-primary shadow-[0_0_15px_rgba(0,242,255,0.2)]' : 'opacity-40'}`}>
            <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${stage === s.id ? 'bg-primary text-bg-deep' : 'bg-surface text-text-dim'}`}>
              {stage === s.id && i < stages.findIndex(st => st.id === stage) ? <ShieldCheck size={20} /> : s.icon}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Final Output Card */}
            <div className={`glass p-6 md:col-span-2 border-l-4 ${result.status === 'GENUINE' ? 'border-success' : result.status === 'FAKE' ? 'border-error' : 'border-warning'}`}>
              <div className="flex items-start gap-4">
                {result.status === 'GENUINE' ? <ShieldCheck size={40} className="text-success" /> : <ShieldAlert size={40} className="text-error" />}
                <div>
                  <h3 className="text-2xl font-bold outfit mb-2">FINAL OUTPUT: {result.status}</h3>
                  <p className="text-text-dim text-sm leading-relaxed">{result.explanation}</p>
                </div>
              </div>
            </div>

            {/* Analysis Summary */}
            <div className="glass p-6">
              <h4 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <Cpu size={14} className="text-primary" /> Metrics
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-dim">Fraud Score:</span>
                  <span className={result.fraudScore > 50 ? 'text-error' : 'text-success'}>{result.fraudScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-dim">DB Registry:</span>
                  <span>{result.analysis.dbMatch ? 'Verified' : 'Not Found'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-dim">QR Scan:</span>
                  <span className="text-primary truncate ml-4">{result.qrData || 'Not Found'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-dim">Logo Detec.:</span>
                  <span>{result.analysis.logoFound ? 'Pass' : 'Fail'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ValidatorPipeline;
