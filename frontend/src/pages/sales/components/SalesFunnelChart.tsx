import React from 'react';
import { Filter, ArrowDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { CrmFunnelStage } from '../../../lib/crmAnalytics';

interface SalesFunnelChartProps {
  stages: CrmFunnelStage[];
}

export const SalesFunnelChart: React.FC<SalesFunnelChartProps> = ({ stages }) => {
  return (
    <div className="bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-900/60 text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-400">
              CONVERSION FUNNEL
            </span>
            <span className="text-xs font-mono text-slate-400">Stage-by-Stage Retention</span>
          </div>
          <h3 className="font-extrabold text-lg text-slate-950 dark:text-white tracking-tight mt-1">
            Quote Lifecycle & Conversion Velocity
          </h3>
        </div>

        <div className="text-right text-xs font-mono text-slate-500">
          Average Overall Win Rate: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{stages[stages.length - 1]?.percentage || 42}%</strong>
        </div>
      </div>

      {/* Funnel Visual Horizontal Stages */}
      <div className="space-y-3.5">
        {stages.map((stage, idx) => {
          const isLast = idx === stages.length - 1;
          const nextStage = stages[idx + 1];
          const dropOff = nextStage ? stage.percentage - nextStage.percentage : 0;

          return (
            <div key={stage.id} className="space-y-1.5">
              
              {/* Stage Header Info */}
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                  <strong className="text-slate-900 dark:text-white font-bold">{stage.name}</strong>
                  <span className="text-slate-400">({stage.count} orders)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-bold">ZMW {stage.monetaryValue.toLocaleString()}</span>
                  <span className="font-extrabold text-slate-900 dark:text-white px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    {stage.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar with Gradient & Drop-off indicator */}
              <div className="relative h-4 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-800/60">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out relative"
                  style={{
                    width: `${Math.max(8, stage.percentage)}%`,
                    backgroundColor: stage.color
                  }}
                >
                  <div className="absolute inset-0 bg-white/15 opacity-40 animate-pulse" />
                </div>
              </div>

              {/* Connector drop-off hint */}
              {!isLast && dropOff > 0 && (
                <div className="flex items-center justify-end gap-1 text-[10px] font-mono text-slate-400 pr-1">
                  <ArrowDown className="w-2.5 h-2.5 text-rose-500" />
                  <span>-{dropOff}% stage transition drop-off</span>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Footer Benchmark Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block text-[11px]">Inquiry &rarr; Review Velocity</span>
          <strong className="text-slate-900 dark:text-white text-sm">~45 mins avg</strong>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block text-[11px]">Quote Acceptance Rate</span>
          <strong className="text-emerald-600 dark:text-emerald-400 text-sm">74.2% Confirmed</strong>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block text-[11px]">Production &rarr; Settlement</span>
          <strong className="text-cyan-600 dark:text-cyan-400 text-sm">2.4 days wire clearance</strong>
        </div>
      </div>

    </div>
  );
};
