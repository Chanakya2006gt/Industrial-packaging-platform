import React from 'react';

export const PageLoader: React.FC = () => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-slate-200 dark:border-slate-800 animate-ping opacity-25" />
        <div className="w-12 h-12 rounded-full border-3 border-transparent border-t-[#E00019] border-r-[#00A3E0] animate-spin" />
      </div>
      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E00019] animate-pulse" />
        <span>Loading Apex Platform...</span>
      </div>
    </div>
  );
};
