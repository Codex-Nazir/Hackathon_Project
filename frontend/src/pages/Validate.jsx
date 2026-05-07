import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Upload, FileText, Loader2, Search } from 'lucide-react';

const Validate = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('certificate', file);

    try {
      const response = await axios.post('http://localhost:5000/api/certificates/validate', formData);
      navigate('/result', { state: { result: response.data } });
    } catch (err) {
      alert(err.response?.data?.error || "Validation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold mb-4">Validate Authenticity</h2>
        <p className="text-gray-400 text-lg">Upload a certificate image or PDF to scan for tampering using AI.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-12 border-2 border-dashed border-cyan-500/30 hover:border-cyan-500/60 transition-all flex flex-col items-center justify-center text-center group"
      >
        <div className={`mb-8 p-6 rounded-full bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform ${loading ? 'animate-pulse' : ''}`}>
          {loading ? <Search className="w-12 h-12" /> : <Upload className="w-12 h-12" />}
        </div>

        {file ? (
          <div className="flex items-center gap-4 bg-white/5 px-6 py-4 rounded-xl mb-8">
            <FileText className="text-cyan-400" />
            <span className="font-medium">{file.name}</span>
            <button onClick={() => setFile(null)} className="text-xs text-red-400 hover:underline">Remove</button>
          </div>
        ) : (
          <div className="mb-8">
            <p className="text-xl font-medium mb-2">Click to select or drag and drop</p>
            <p className="text-sm text-gray-500">PDF, PNG, or JPG (Max 5MB)</p>
          </div>
        )}

        <input 
          type="file" 
          id="file-upload" 
          className="hidden" 
          onChange={handleFileChange}
          accept=".pdf,.png,.jpg,.jpeg"
        />
        
        {!file ? (
          <label 
            htmlFor="file-upload"
            className="px-10 py-4 bg-cyan-600 rounded-xl font-bold cursor-pointer hover:bg-cyan-500 transition-all"
          >
            Choose File
          </label>
        ) : (
          <button 
            onClick={handleUpload}
            disabled={loading}
            className="px-10 py-4 bg-white text-black rounded-xl font-bold hover:bg-cyan-400 hover:text-white transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Analyzing Document...
              </>
            ) : 'Start AI Validation'}
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default Validate;
