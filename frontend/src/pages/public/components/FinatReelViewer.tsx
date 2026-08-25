import React from 'react';
import { ArrowRight, RotateCw, Check } from 'lucide-react';

interface FinatReelViewerProps {
  finatDirection: number;
  setFinatDirection: (dir: number) => void;
  finatStandards: Record<number, {
    title: string;
    winding: 'Wound Out' | 'Wound In';
    leadEdge: string;
    rotationDeg: number;
    headDirection: 'right' | 'left' | 'up' | 'down';
    diagramDesc: string;
  }>;
}

export const FinatReelViewer: React.FC<FinatReelViewerProps> = ({
  finatDirection,
  setFinatDirection,
  finatStandards
}) => {
  const currentFinat = finatStandards[finatDirection] || finatStandards[1];

  return (
    <div className="double-bezel">
      <div className="double-bezel-inner p-6 space-y-5 bg-white dark:bg-slate-900">
        
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-950 dark:text-white font-mono flex items-center gap-2">
              <span>FINAT Technical Rewind Standard (1 to 8)</span>
              <span className="tech-tag tech-tag-crimson text-[9px]">ENGINEERING GRADE</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Exact label orientation for automated rotary applicators (Krones, Pack Leader, etc.).
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-[#E00019] bg-rose-50 dark:bg-rose-950/40 px-2 py-1 rounded">
            {currentFinat.title}
          </span>
        </div>

        {/* FINAT 1 to 8 Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(finatStandards).map(([numStr, spec]) => {
            const num = Number(numStr);
            const isSelected = finatDirection === num;
            return (
              <div
                key={num}
                onClick={() => setFinatDirection(num)}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-xs font-mono flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#E00019] bg-rose-50/60 dark:bg-rose-950/30 text-slate-900 dark:text-white shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <strong className="font-extrabold">{spec.title}</strong>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#E00019]" />}
                </div>

                <div className="text-[10px] text-slate-500">{spec.winding}</div>
                <div className="text-[10px] font-bold text-[#E00019] truncate mt-0.5">{spec.leadEdge}</div>
              </div>
            );
          })}
        </div>

        {/* Detailed Diagram & Machine Applicator Instructions */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <strong className="text-slate-900 dark:text-white text-sm">{currentFinat.title} — {currentFinat.leadEdge}</strong>
              <span className="tech-tag tech-tag-emerald text-[9px]">{currentFinat.winding}</span>
            </div>
            <p className="text-xs text-slate-500 max-w-xl">
              {currentFinat.diagramDesc}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shrink-0 text-center">
            <RotateCw className="w-5 h-5 text-cyan-500 mx-auto mb-1 animate-spin" />
            <span className="text-[10px] text-slate-400 block">Applicator Reel Feed</span>
            <strong className="text-xs text-slate-900 dark:text-white">{currentFinat.leadEdge}</strong>
          </div>
        </div>

      </div>
    </div>
  );
};
