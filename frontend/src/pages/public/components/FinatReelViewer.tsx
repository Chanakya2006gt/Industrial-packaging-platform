import React from 'react';
import { RotateCw, Check, ArrowRight, Activity, Gauge, Disc } from 'lucide-react';
import { finatWebTelemetry, FinatViewerSpec } from '../../../lib/finat';

interface FinatReelViewerProps {
  finatDirection: number;
  setFinatDirection: (dir: number) => void;
  coreMm?: number;
  widthMm?: number;
  heightMm?: number;
  quantity?: number;
  finatStandards: Record<number, FinatViewerSpec>;
}

export const FinatReelViewer: React.FC<FinatReelViewerProps> = ({
  finatDirection,
  setFinatDirection,
  coreMm = 76,
  widthMm = 85,
  heightMm = 120,
  quantity = 25000,
  finatStandards
}) => {
  const currentFinat = finatStandards[finatDirection] || finatStandards[1];

  // Technical Manufacturing Math via centralized FINAT telemetry spec
  const { unitAreaCm2, linearMeters, totalM2, estRolls, gapMm, labelsPerRoll } = finatWebTelemetry({
    widthMm,
    heightMm,
    quantity,
  });

  // SVG Diagram Generator for FINAT 1 to 8
  const renderFinatSvgTile = (dirNum: number, isSelected: boolean) => {
    const isWoundOut = dirNum <= 4;
    const strokeColor = isSelected ? '#E00019' : 'currentColor';
    
    // Label 'A' rotation mapping
    const rotationMap: Record<number, number> = {
      1: 0, 2: 180, 3: 90, 4: 270,
      5: 0, 6: 180, 7: 90, 8: 270
    };
    const rot = rotationMap[dirNum] || 0;

    return (
      <svg viewBox="0 0 80 80" className="w-12 h-12 mx-auto my-1 select-none">
        {/* Outer Roll Core Circle */}
        <circle cx="40" cy="40" r="26" fill="none" stroke={strokeColor} strokeWidth="2.5" />
        
        {/* Inner Core Spool Hole */}
        <circle cx="40" cy="40" r="10" fill={isSelected ? 'rgba(224,0,25,0.1)' : 'none'} stroke={strokeColor} strokeWidth="1.5" strokeDasharray="2 2" />
        <circle cx="40" cy="40" r="3" fill={strokeColor} />

        {/* Tangential Web Exit Path */}
        {isWoundOut ? (
          // Wound Out: Top/Right exit tangent
          <path d="M40,14 L72,14" fill="none" stroke="#E00019" strokeWidth="2.5" strokeLinecap="round" />
        ) : (
          // Wound In: Bottom/Right exit tangent
          <path d="M40,66 L72,66" fill="none" stroke="#E00019" strokeWidth="2.5" strokeLinecap="round" />
        )}
        <polygon points={isWoundOut ? "70,11 76,14 70,17" : "70,63 76,66 70,69"} fill="#E00019" />

        {/* Rotated Orientation Letter 'A' Box */}
        <g transform={`translate(${isWoundOut ? '56, 14' : '56, 66'})`}>
          <rect x="-8" y="-9" width="16" height="18" rx="2" fill={isSelected ? '#E00019' : '#0F172A'} stroke="#ffffff" strokeWidth="0.8" />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="10"
            fontWeight="900"
            fontFamily="monospace"
            transform={`rotate(${rot})`}
          >
            A
          </text>
        </g>
      </svg>
    );
  };

  return (
    <div className="double-bezel">
      <div className="double-bezel-inner p-6 space-y-6 bg-white dark:bg-slate-900">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-950 dark:text-white font-mono flex items-center gap-2">
              <Disc className="w-4 h-4 text-[#E00019]" />
              <span>FINAT Technical Rewind Standard (1 to 8)</span>
              <span className="tech-tag tech-tag-crimson text-[9px]">ENGINEERING GRADE</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Calibrated label unwind orientation for rotary high-speed applicators (Krones, Pack Leader, Label-Aire).
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-[#E00019] bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900 self-start sm:self-auto">
            {currentFinat.title} • {currentFinat.winding}
          </span>
        </div>

        {/* FINAT 1 to 8 Technical Diagram Matrix */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500 mb-2">
            <span>SELECT REEL UNWIND ORIENTATION:</span>
            <span className="text-[#E00019]">European FINAT Standard</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {Object.entries(finatStandards).map(([numStr, spec]) => {
              const num = Number(numStr);
              const isSelected = finatDirection === num;
              return (
                <div
                  key={num}
                  onClick={() => setFinatDirection(num)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-xs font-mono flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#E00019] bg-rose-50/60 dark:bg-rose-950/30 text-slate-900 dark:text-white shadow-md'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="font-extrabold text-xs">{spec.title}</strong>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#E00019]" />}
                  </div>

                  {/* 8-Way SVG Vector Diagram */}
                  {renderFinatSvgTile(num, isSelected)}

                  <div className="mt-1 pt-1.5 border-t border-black/5 dark:border-white/5 text-center">
                    <div className="text-[9px] text-slate-500 uppercase">{spec.winding}</div>
                    <div className="text-[10px] font-bold text-[#E00019] truncate">{spec.leadEdge}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Rotary Machine Unwinding Simulation Stage */}
        <div className="p-5 rounded-2xl bg-[#090D18] border border-slate-800 text-white space-y-4">
          <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-2.5">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span>ROTARY APPLICATOR FEED SIMULATION</span>
            </span>
            <span className="text-slate-400 text-[10px]">
              Rotary Speed: 120 m/min • Core: {coreMm}mm ({((coreMm / 25.4).toFixed(0))}")
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
            {/* Spinning Core Visualizer */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-full border-4 border-dashed border-cyan-500/60 bg-slate-900 flex items-center justify-center shadow-lg">
                <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-[8px] font-mono font-bold text-cyan-300">
                  {coreMm}mm
                </div>
                <div className="absolute -top-1.5 right-2 w-3 h-3 rounded-full bg-[#E00019] animate-ping" />
              </div>

              <div className="space-y-1 font-mono text-xs">
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{currentFinat.title}</span>
                  <span className="tech-tag tech-tag-crimson text-[9px]">{currentFinat.winding}</span>
                </div>
                <div className="text-xs text-rose-400 font-bold">{currentFinat.leadEdge}</div>
                <p className="text-[11px] text-slate-400 max-w-sm">{currentFinat.diagramDesc}</p>
              </div>
            </div>

            {/* Simulated Peeling Label Tile */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 font-mono text-center shrink-0 w-36 shadow-inner">
              <span className="text-[9px] text-slate-400 block mb-1">LABEL ORIENTATION</span>
              <div
                style={{ transform: `rotate(${currentFinat.rotationDeg}deg)` }}
                className="w-16 h-20 mx-auto rounded bg-white text-slate-950 font-black text-xl flex flex-col items-center justify-center shadow-lg border border-slate-300 transition-transform duration-500"
              >
                <span>A</span>
                <span className="text-[6px] font-mono tracking-tighter text-slate-500 mt-0.5">TOP ▲</span>
              </div>
              <span className="text-[9px] text-cyan-400 font-bold block mt-1.5 flex items-center justify-center gap-1">
                <span>FEED DIRECTION</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Manufacturing Telemetry HUD Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 text-[10px] block">UNIT LABEL AREA</span>
            <strong className="text-slate-900 dark:text-white text-sm">{unitAreaCm2} cm²</strong>
            <span className="text-[9px] text-slate-500 block">{widthMm}mm × {heightMm}mm</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 text-[10px] block">LINEAR WEB RUN</span>
            <strong className="text-slate-900 dark:text-white text-sm">{linearMeters.toLocaleString()} m</strong>
            <span className="text-[9px] text-slate-500 block">@ {gapMm}mm web gap</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 text-[10px] block">CONVERTED SURFACE</span>
            <strong className="text-slate-900 dark:text-white text-sm">{totalM2} m²</strong>
            <span className="text-[9px] text-slate-500 block">{quantity.toLocaleString()} units</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 text-[10px] block">ESTIMATED ROLLS</span>
            <strong className="text-slate-900 dark:text-white text-sm">{estRolls} Reels</strong>
            <span className="text-[9px] text-slate-500 block">~{labelsPerRoll.toLocaleString()} labels / roll</span>
          </div>
        </div>

      </div>
    </div>
  );
};

