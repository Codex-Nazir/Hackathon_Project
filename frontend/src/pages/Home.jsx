import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FilePlus, SearchCheck, ShieldAlert, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
          SECURE YOUR <br />
          <span className="text-cyan-400 neon-text">TRUST</span> WITH AI
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          The next-generation certificate verification platform. Generate authentic certificates and detect tampering using advanced OCR and AI analysis.
        </p>

        <div className="flex flex-wrap gap-6 justify-center">
          <Link 
            to="/generate" 
            className="group relative px-8 py-4 bg-cyan-600 rounded-xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative flex items-center gap-2">
              <FilePlus className="w-5 h-5" /> Generate Certificate
            </span>
          </Link>
          
          <Link 
            to="/validate" 
            className="group px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
          >
            <span className="flex items-center gap-2">
              <SearchCheck className="w-5 h-5 text-cyan-400" /> Validate Certificate
            </span>
          </Link>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 mt-24 w-full max-w-6xl">
        <FeatureCard 
          icon={<ShieldAlert className="w-8 h-8 text-cyan-400" />}
          title="Fraud Detection"
          desc="AI-powered consistency checks to identify even the most subtle tampering attempts."
        />
        <FeatureCard 
          icon={<Zap className="w-8 h-8 text-cyan-400" />}
          title="Instant OCR"
          desc="Extract data from any certificate PDF or image in milliseconds using high-precision OCR."
        />
        <FeatureCard 
          icon={<SearchCheck className="w-8 h-8 text-cyan-400" />}
          title="Trust Scoring"
          desc="Get a detailed trust score based on metadata, layout, and database cross-referencing."
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass-card p-8 text-left border border-white/5 hover:border-cyan-500/30 transition-all"
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{desc}</p>
  </motion.div>
);

export default Home;
