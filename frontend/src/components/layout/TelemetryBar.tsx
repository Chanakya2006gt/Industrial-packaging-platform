import React, { useState, useEffect } from 'react';
import { Clock, Phone, MapPin } from 'lucide-react';

export const TelemetryBar: React.FC = () => {
  const [lusakaTime, setLusakaTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Africa/Lusaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setLusakaTime(new Intl.DateTimeFormat('en-GB', options).format(new Date()));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#070B12] text-slate-400 text-[11px] font-mono border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-1.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Plant Shift & Live Clock */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-white">24/7 PLANT OPERATION</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Shift 1 Active</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Lusaka CAT: <strong className="text-slate-200">{lusakaTime || '12:00:00'}</strong></span>
          </div>
        </div>

        {/* Right: Quick Telemetry & Turnaround */}
        <div className="flex items-center gap-4 text-slate-400">
          <span className="hidden sm:inline">
            Turnaround: <strong className="text-emerald-400">&lt; 4 Hours</strong>
          </span>
          <span className="hidden sm:inline text-slate-700">•</span>
          <a
            href="tel:+260974423496"
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#E00019]" />
            <span>Plant Estimating: <strong>+260 974 423 496</strong></span>
          </a>
        </div>

      </div>
    </div>
  );
};
