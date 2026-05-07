import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="relative z-20 border-b border-white/10 backdrop-blur-md bg-black/20">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <ShieldCheck className="w-8 h-8 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            CertifyAI
          </span>
        </Link>
        <div className="flex gap-8 items-center">
          <Link to="/generate" className="text-gray-300 hover:text-cyan-400 transition-colors">Generate</Link>
          <Link to="/validate" className="text-gray-300 hover:text-cyan-400 transition-colors">Validate</Link>
          <Link to="/validate" className="px-5 py-2 bg-cyan-600/20 border border-cyan-500/50 rounded-full text-cyan-400 hover:bg-cyan-600/30 transition-all">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
