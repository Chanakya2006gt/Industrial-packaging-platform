import React, { useState } from 'react';
import { CrmMonthlyTrend } from '../../../lib/crmAnalytics';

interface RevenueTrendChartProps {
  trends: CrmMonthlyTrend[];
}

export const RevenueTrendChart: React.FC<RevenueTrendChartProps> = ({ trends }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Determine max value for SVG coordinate scaling
  const maxVal = Math.max(
    ...trends.map(t => Math.max(t.quotedValue, t.settledValue)),
    300000
  );

  const chartHeight = 180;
  const chartWidth = 520;
  const barGroupWidth = chartWidth / Math.max(trends.length, 1);

  return (
    <div className="bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs p-6 space-y-6">
      
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
              REVENUE & PIPELINE TRENDS
            </span>
            <span className="text-xs font-mono text-slate-400">6-Month Window</span>
          </div>
          <h3 className="font-extrabold text-lg text-slate-950 dark:text-white tracking-tight mt-1">
            Monthly Quoted vs. Settled Revenue
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#00A3E0]" />
            <span className="text-slate-600 dark:text-slate-400">Quotes Generated</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#10B981]" />
            <span className="text-slate-600 dark:text-slate-400">Cash Settled</span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Chart Canvas */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight + 35}`}
          className="w-full h-52 overflow-visible select-none"
        >
          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = chartHeight - ratio * chartHeight;
            const labelVal = Math.round((ratio * maxVal) / 1000);
            return (
              <g key={i} className="opacity-30 dark:opacity-20">
                <line
                  x1="0"
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="currentColor"
                  strokeDasharray="4,4"
                />
                <text
                  x="0"
                  y={y - 4}
                  className="text-[9px] fill-slate-400 font-mono"
                >
                  {labelVal}k
                </text>
              </g>
            );
          })}

          {/* Bar Groups */}
          {trends.map((t, idx) => {
            const groupX = idx * barGroupWidth;
            const barW = 16;
            const spacing = 4;
            const centerX = groupX + barGroupWidth / 2;

            const qHeight = Math.max(8, (t.quotedValue / maxVal) * chartHeight);
            const sHeight = Math.max(6, (t.settledValue / maxVal) * chartHeight);

            const qY = chartHeight - qHeight;
            const sY = chartHeight - sHeight;

            const isHovered = hoveredIdx === idx;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                {/* Hover Background Column Highlight */}
                {isHovered && (
                  <rect
                    x={groupX + 4}
                    y="0"
                    width={barGroupWidth - 8}
                    height={chartHeight}
                    fill="currentColor"
                    className="text-slate-100 dark:text-slate-800/60 opacity-60 rounded-xl"
                  />
                )}

                {/* Quoted Bar (Cyan) */}
                <rect
                  x={centerX - barW - spacing / 2}
                  y={qY}
                  width={barW}
                  height={qHeight}
                  rx="4"
                  fill="#00A3E0"
                  className="transition-all duration-300 hover:brightness-110"
                />

                {/* Settled Bar (Emerald) */}
                <rect
                  x={centerX + spacing / 2}
                  y={sY}
                  width={barW}
                  height={sHeight}
                  rx="4"
                  fill="#10B981"
                  className="transition-all duration-300 hover:brightness-110"
                />

                {/* X-axis Month Label */}
                <text
                  x={centerX}
                  y={chartHeight + 22}
                  textAnchor="middle"
                  className={`text-xs font-mono font-bold transition-colors ${
                    isHovered ? 'fill-[#E00019] dark:fill-white font-extrabold' : 'fill-slate-500 dark:fill-slate-400'
                  }`}
                >
                  {t.month}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip when hovered */}
        {hoveredIdx !== null && trends[hoveredIdx] && (
          <div
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white dark:bg-slate-950 px-3.5 py-2 rounded-xl text-xs font-mono shadow-xl border border-slate-700 pointer-events-none flex items-center gap-3 z-20"
          >
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">{trends[hoveredIdx].month} {trends[hoveredIdx].year}</span>
              <strong className="text-cyan-400">Quotes: ZMW {trends[hoveredIdx].quotedValue.toLocaleString()}</strong>
            </div>
            <span className="text-slate-600">|</span>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">{trends[hoveredIdx].orderCount} Orders</span>
              <strong className="text-emerald-400">Settled: ZMW {trends[hoveredIdx].settledValue.toLocaleString()}</strong>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
