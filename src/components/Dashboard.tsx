import React from 'react';
import { Activity, ShieldCheck, AlertTriangle, Users, BarChart3, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total Verified', value: '1,284', icon: <ShieldCheck className="text-success" />, trend: '+12%' },
    { label: 'Fraud Detected', value: '42', icon: <AlertTriangle className="text-error" />, trend: '+3%' },
    { label: 'Avg Analysis Time', value: '4.2s', icon: <Clock className="text-primary" />, trend: '-0.8s' },
    { label: 'Active Sessions', value: '18', icon: <Users className="text-secondary" />, trend: 'Stable' }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 glass-hover"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/5 rounded-lg">{s.icon}</div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded bg-white/5 ${s.trend.startsWith('+') ? 'text-success' : 'text-primary'}`}>
                {s.trend}
              </span>
            </div>
            <p className="text-text-dim text-sm">{s.label}</p>
            <h3 className="text-2xl font-bold outfit mt-1">{s.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass p-8 lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold outfit flex items-center gap-2">
              <BarChart3 className="text-primary" /> Traffic Analytics
            </h3>
            <div className="flex gap-2">
              <div className="status-badge status-active">Live</div>
            </div>
          </div>
          
          <div className="h-64 flex items-end gap-2">
            {[40, 70, 45, 90, 65, 80, 50, 100, 75, 60, 85, 40].map((h, i) => (
              <div key={i} className="flex-1 group relative">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  className="bg-primary/40 group-hover:bg-primary/60 transition-all rounded-t-sm w-full"
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-primary text-bg-deep text-[10px] font-bold px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}%
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-text-dim uppercase tracking-widest mono">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:59</span>
          </div>
        </div>

        <div className="glass p-8">
          <h3 className="text-xl font-bold outfit mb-6 flex items-center gap-2">
            <Activity className="text-secondary" /> System Health
          </h3>
          <div className="space-y-6">
            {[
              { label: 'OCR Engine', status: 'Optimal', val: 98 },
              { label: 'CNN Model v4', status: 'Active', val: 84 },
              { label: 'DB Registry', status: 'Synced', val: 100 },
              { label: 'API Gateway', status: 'Load: Med', val: 62 }
            ].map((sys, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold">{sys.label}</span>
                  <span className="text-text-dim">{sys.status}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${sys.val}%` }}
                    className={`h-full ${sys.val > 90 ? 'bg-success' : sys.val > 70 ? 'bg-primary' : 'bg-warning'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
