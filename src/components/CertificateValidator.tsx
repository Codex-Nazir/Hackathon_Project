import React, { useState } from 'react';
import { Upload, Search, ShieldCheck, ShieldAlert, FileText, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { performOCR } from '../utils/ocr';
import { validateCertificate, type ValidationResult } from '../utils/validator';

const CertificateValidator: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [extractedText, setExtractedText] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setResult(null);
    setProgress(0);

    try {
      const text = await performOCR(file, (p) => setProgress(Math.round(p * 100)));
      setExtractedText(text);
      const validation = await validateCertificate(text);
      setResult(validation);
    } catch (error) {
      console.error(error);
      alert("Error processing certificate. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card text-center"
      >
        <div className="mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <Upload className="text-primary" size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Upload Certificate</h2>
          <p className="text-text-muted">AI will scan and validate your certificate authenticity</p>
        </div>

        <label className="relative group cursor-pointer block">
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <div className={`border-2 border-dashed rounded-xl p-12 transition-all ${isUploading ? 'border-primary bg-primary/5' : 'border-border group-hover:border-primary/50 group-hover:bg-white/5'}`}>
            {isUploading ? (
              <div className="space-y-4">
                <Loader2 className="mx-auto animate-spin text-primary" size={40} />
                <p className="font-semibold text-primary">AI Analyzing... {progress}%</p>
                <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="bg-primary h-full"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-medium">Click to browse or drag & drop</p>
                <p className="text-sm text-text-muted">Supports PNG, JPG, JPEG</p>
              </div>
            )}
          </div>
        </label>
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Status Card */}
            <div className={`glass-card border-l-8 ${result.isValid ? 'border-green-500' : 'border-red-500'}`}>
              <div className="flex items-start gap-4">
                {result.isValid ? (
                  <ShieldCheck className="text-green-500 shrink-0" size={32} />
                ) : (
                  <ShieldAlert className="text-red-500 shrink-0" size={32} />
                )}
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    {result.isValid ? "Certificate Validated" : "Potential Issues Detected"}
                  </h3>
                  <p className="text-text-muted leading-relaxed">{result.explanation}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Extracted Fields */}
              <div className="glass-card">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Search size={20} className="text-primary" /> Structured Data
                </h4>
                <div className="space-y-3">
                  {Object.entries(result.fields).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-3 bg-surface/50 rounded-lg border border-border">
                      <span className="text-sm text-text-muted capitalize">{key}</span>
                      <span className="font-medium">{value || "Not Found"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suspicious Details */}
              {!result.isValid && (
                <div className="glass-card border-red-500/20">
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-400">
                    <Info size={20} /> AI Warnings
                  </h4>
                  <ul className="space-y-2">
                    {result.suspiciousElements.map((err, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm p-2 bg-red-500/5 rounded border border-red-500/10">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Raw OCR Text (Optional/Debug) */}
              <div className="glass-card md:col-span-2">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-text-muted" /> Raw Analysis Data
                </h4>
                <pre className="text-xs text-text-muted bg-black/20 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap max-h-40">
                  {extractedText}
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CertificateValidator;
