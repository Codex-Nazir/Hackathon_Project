import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, RefreshCw, Database, ScanLine } from 'lucide-react';

const Result = () => {
  const location = useLocation();
  const { result } = location.state || {};

  if (!result) return <div className="text-center py-20">No result found. <Link to="/validate" className="text-cyan-400">Go back</Link></div>;

  const isValid = result.status === 'valid' || result.trustScore > 70;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Side: Score & Status */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`glass-card p-8 text-center border-t-4 ${isValid ? 'border-green-500' : 'border-red-500'}`}
          >
            <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isValid ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {isValid ? <ShieldCheck className="w-12 h-12" /> : <ShieldAlert className="w-12 h-12" />}
            </div>
            <h3 className="text-3xl font-bold mb-2">{isValid ? 'AUTHENTIC' : 'SUSPICIOUS'}</h3>
            <p className="text-gray-400 mb-8">Verification Results</p>
            
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-cyan-600 bg-cyan-200">
                    Trust Score
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold inline-block text-cyan-400">
                    {result.trustScore}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${result.trustScore}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${isValid ? 'bg-cyan-500' : 'bg-red-500'}`}
                ></motion.div>
              </div>
            </div>
          </motion.div>

          <Link to="/validate" className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all font-bold">
            <RefreshCw className="w-5 h-5" /> Scan Another
          </Link>
        </div>

        {/* Right Side: Analysis Details */}
        <div className="w-full md:w-2/3 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8"
          >
            <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ScanLine className="w-6 h-6 text-cyan-400" /> AI Explanation
            </h4>
            <div className="bg-cyan-500/5 border border-cyan-500/20 p-6 rounded-xl italic text-gray-300 leading-relaxed">
              "{result.explanation}"
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <DataCard 
              title="Extracted (OCR)" 
              icon={<ScanLine className="w-5 h-5" />}
              data={result.extractedData} 
            />
            <DataCard 
              title="Database Record" 
              icon={<Database className="w-5 h-5" />}
              data={result.originalRecord || { status: 'No Match Found' }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const DataCard = ({ title, data, icon }) => (
  <div className="glass-card p-6 border border-white/5">
    <h5 className="font-bold text-gray-400 mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
      {icon} {title}
    </h5>
    <div className="space-y-3">
      {Object.entries(data).map(([key, value]) => {
        if (typeof value === 'object' || key === '_id' || key === '__v' || key === 'qrCode' || key === 'pdfPath' || key === 'hash') return null;
        return (
          <div key={key} className="flex flex-col">
            <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">{key}</span>
            <span className="text-sm font-medium text-gray-200">{value?.toString() || 'N/A'}</span>
          </div>
        );
      })}
    </div>
  </div>
);

export default Result;
