import React, { useState } from 'react';
import { CrmCategoryMix } from '../../../lib/crmAnalytics';

interface PackagingMixDonutProps {
  categories: CrmCategoryMix[];
  totalUnits: number;
}

export const PackagingMixDonut: React.FC<PackagingMixDonutProps> = ({ categories, totalUnits }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const radius = 68;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div className="bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs p-6 space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-[10px] font-mono font-bold text-[#E00019] dark:text-rose-400">
            PRODUCT MIX
          </span>
          <span className="text-xs font-mono text-slate-400">Packaging Volume Share</span>
        </div>
        <h3 className="font-extrabold text-lg text-slate-950 dark:text-white tracking-tight mt-1">
          Revenue by Packaging Category
        </h3>
      </div>

      {/* Donut Canvas & Legend Layout */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* SVG Donut */}
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
            {/* Background ring */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-slate-100 dark:text-slate-900 fill-none"
            />

            {/* Colored Segments */}
            {categories.map((cat, i) => {
              const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativePercent / 100) * circumference);
              cumulativePercent += cat.percentage;

              const isHighlighted = activeIdx === i || activeIdx === null;

              return (
                <circle
                  key={cat.categoryKey}
                  cx="90"
                  cy="90"
                  r={radius}
                  stroke={cat.color}
                  strokeWidth={activeIdx === i ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="butt"
                  className="fill-none transition-all duration-300 cursor-pointer"
                  style={{ opacity: isHighlighted ? 1 : 0.4 }}
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx(null)}
                />
              );
            })}
          </svg>

          {/* Center Metric Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              {activeIdx !== null ? categories[activeIdx]?.percentage + '%' : 'Total Units'}
            </span>
            <strong className="text-sm font-extrabold text-slate-950 dark:text-white font-mono">
              {activeIdx !== null
                ? `${categories[activeIdx]?.units.toLocaleString()}`
                : `${(totalUnits / 1000).toFixed(0)}k Units`}
            </strong>
          </div>
        </div>

        {/* Categories Legend Table */}
        <div className="space-y-3 flex-1 w-full text-xs font-mono">
          {categories.map((cat, idx) => (
            <div
              key={cat.categoryKey}
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseLeave={() => setActiveIdx(null)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                activeIdx === idx
                  ? 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 shadow-xs'
                  : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: cat.color }} />
                  <strong className="text-slate-900 dark:text-white font-bold">{cat.label}</strong>
                </div>
                <span className="font-extrabold text-slate-950 dark:text-white font-sans">{cat.percentage}%</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1 pl-5">
                <span>{cat.count} Orders</span>
                <span>ZMW {cat.revenue.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
