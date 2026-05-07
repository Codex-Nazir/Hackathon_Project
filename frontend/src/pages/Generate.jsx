import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';

const Generate = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    course: '',
    organization: '',
    certificateId: '',
    issueDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/certificates/generate', formData);
      setResult(response.data);
    } catch (err) {
      alert(err.response?.data?.error || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-4">Generate Certificate</h2>
        <p className="text-gray-400">Enter student details to generate a secure, verifiable PDF certificate.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Student Name</label>
              <input 
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-cyan-500 focus:outline-none transition-colors"
                type="text" 
                value={formData.studentName}
                onChange={(e) => setFormData({...formData, studentName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Course Name</label>
              <input 
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-cyan-500 focus:outline-none transition-colors"
                type="text" 
                value={formData.course}
                onChange={(e) => setFormData({...formData, course: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Org Name</label>
                <input 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-cyan-500 focus:outline-none transition-colors"
                  type="text" 
                  value={formData.organization}
                  onChange={(e) => setFormData({...formData, organization: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Cert ID</label>
                <input 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-cyan-500 focus:outline-none transition-colors"
                  type="text" 
                  value={formData.certificateId}
                  onChange={(e) => setFormData({...formData, certificateId: e.target.value})}
                />
              </div>
            </div>
            <button 
              disabled={loading}
              className="w-full py-4 bg-cyan-600 rounded-lg font-bold hover:bg-cyan-500 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Certificate'}
            </button>
          </form>
        </motion.div>

        <div className="flex flex-col justify-center">
          {result ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 border-cyan-500/50 bg-cyan-500/5"
            >
              <div className="flex items-center gap-4 mb-6 text-cyan-400">
                <CheckCircle2 className="w-10 h-10" />
                <h3 className="text-2xl font-bold">Success!</h3>
              </div>
              <p className="text-gray-300 mb-8">Certificate has been generated and stored in the database.</p>
              
              <a 
                href={`http://localhost:5000${result.downloadUrl}`}
                download
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all font-bold"
              >
                <Download className="w-5 h-5" /> Download PDF
              </a>
            </motion.div>
          ) : (
            <div className="text-center p-12 border-2 border-dashed border-white/10 rounded-2xl">
              <p className="text-gray-500">Fill the form to see the preview and download the certificate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generate;
