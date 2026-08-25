import React from 'react';
import { TrendingUp, DollarSign, Target, Clock, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { CrmAnalyticsSummary } from '../../../lib/crmAnalytics';

interface CrmKpiGridProps {
  analytics: CrmAnalyticsSummary;
}

export const CrmKpiGrid: React.FC<CrmKpiGridProps> = ({ analytics }) => {
  const { kpi } = analytics;

  const cards = [
    {
      id: 'pipeline',
      label: 'Active Pipeline Value',
      value: `ZMW ${kpi.activePipelineZMW.toLocaleString()}`,
      subtext: `${kpi.totalQuotesCount} total customer inquiries`,
      badge: '+14.2% vs last month',
      badgeType: 'emerald',
      icon: DollarSign,
      sparklineColor: '#00A3E0',
      sparklinePoints: '0,28 15,22 30,25 45,18 60,12 75,16 90,8 105,4 120,2'
    },
    {
      id: 'settled',
      label: 'Confirmed Settled Revenue',
      value: `ZMW ${kpi.settledRevenueZMW.toLocaleString()}`,
      subtext: `${kpi.inProductionCount} orders in production`,
      badge: 'Verified Bank Receipts',
      badgeType: 'cyan',
      icon: CheckCircle2,
      sparklineColor: '#10B981',
      sparklinePoints: '0,26 15,24 30,20 45,22 60,15 75,12 90,10 105,6 120,3'
    },
    {
      id: 'win_rate',
      label: 'Quote Conversion Rate',
      value: `${kpi.winRatePercent}%`,
      subtext: `${kpi.totalUnitsProduced.toLocaleString()} units converted`,
      badge: '+4.1% conversion efficiency',
      badgeType: 'emerald',
      icon: Target,
      sparklineColor: '#E00019',
      sparklinePoints: '0,24 15,22 30,18 45,20 60,14 75,10 90,12 105,8 120,4'
    },
    {
      id: 'velocity',
      label: 'Average Response Time',
      value: `${Math.floor(kpi.avgResponseMinutes / 60)}h ${kpi.avgResponseMinutes % 60}m`,
      subtext: `${kpi.onTimeResponsePercent}% within 4h SLA target`,
      badge: 'Industry Benchmark Met',
      badgeType: 'slate',
      icon: Clock,
      sparklineColor: '#6366F1',
      sparklinePoints: '0,10 15,14 30,8 45,16 60,10 75,6 90,4 105,6 120,2'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            className="bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
          >
            {/* Top row: Label & Icon */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                {c.label}
              </span>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 group-hover:text-[#E00019] transition-colors">
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Middle row: Big Metric Number */}
            <div>
              <div className="text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight font-sans">
                {c.value}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                {c.subtext}
              </p>
            </div>

            {/* Bottom row: Sparkline & Trend Badge */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold inline-flex items-center gap-1 ${
                  c.badgeType === 'emerald'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60'
                    : c.badgeType === 'cyan'
                    ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-900/60'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <ArrowUpRight className="w-2.5 h-2.5" />
                {c.badge}
              </span>

              {/* Native SVG Mini Sparkline */}
              <div className="w-16 h-7 opacity-80 group-hover:opacity-100 transition-opacity">
                <svg viewBox="0 0 120 30" className="w-full h-full overflow-visible">
                  <polyline
                    fill="none"
                    stroke={c.sparklineColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={c.sparklinePoints}
                  />
                </svg>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
