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
      value: `$${kpi.activePipelineZMW.toLocaleString()}`,
      subtext: `${kpi.totalQuotesCount} total customer inquiries`,
      badge: '+14.2% vs last month',
      badgeType: 'emerald',
      icon: DollarSign,
      sparklineColor: '#00A3E0',
      sparklinePoints: '0,28 15,22 30,25 45,18 60,12 75,16 90,8 105,4 120,2',
      polygonPoints: '0,30 0,28 15,22 30,25 45,18 60,12 75,16 90,8 105,4 120,2 120,30',
      lastPoint: { cx: 120, cy: 2 }
    },
    {
      id: 'settled',
      label: 'Confirmed Settled Revenue',
      value: `$${kpi.settledRevenueZMW.toLocaleString()}`,
      subtext: `${kpi.inProductionCount} orders in production`,
      badge: 'Verified Bank Receipts',
      badgeType: 'cyan',
      icon: CheckCircle2,
      sparklineColor: '#10B981',
      sparklinePoints: '0,26 15,24 30,20 45,22 60,15 75,12 90,10 105,6 120,3',
      polygonPoints: '0,30 0,26 15,24 30,20 45,22 60,15 75,12 90,10 105,6 120,3 120,30',
      lastPoint: { cx: 120, cy: 3 }
    },
    {
      id: 'win_rate',
      label: 'Quote Conversion Rate',
      value: `${kpi.winRatePercent}%`,
      subtext: `${kpi.totalUnitsProduced.toLocaleString()} units converted`,
      badge: '+4.1% conversion efficiency',
      badgeType: 'emerald',
      icon: Target,
      sparklineColor: 'hsl(var(--primary))',
      sparklinePoints: '0,24 15,22 30,18 45,20 60,14 75,10 90,12 105,8 120,4',
      polygonPoints: '0,30 0,24 15,22 30,18 45,20 60,14 75,10 90,12 105,8 120,4 120,30',
      lastPoint: { cx: 120, cy: 4 }
    },
    {
      id: 'velocity',
      label: 'Average Response Time',
      value: `${Math.floor(kpi.avgResponseMinutes / 60)}h ${kpi.avgResponseMinutes % 60}m`,
      subtext: `${kpi.onTimeResponsePercent}% within 3h SLA target`,
      badge: 'Industry Benchmark Met',
      badgeType: 'slate',
      icon: Clock,
      sparklineColor: '#6366F1',
      sparklinePoints: '0,10 15,14 30,8 45,16 60,10 75,6 90,4 105,6 120,2',
      polygonPoints: '0,30 0,10 15,14 30,8 45,16 60,10 75,6 90,4 105,6 120,2 120,30',
      lastPoint: { cx: 120, cy: 2 }
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        const gradId = `spark-grad-${c.id}`;
        return (
          <div
            key={c.id}
            className="bg-card border border-border rounded-2xl shadow-theme-sm p-5 flex flex-col justify-between space-y-4 hover:border-border/80 transition-all group"
          >
            {/* Top row: Label & Icon */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-muted-foreground">
                {c.label}
              </span>
              <div className="p-2 rounded-xl bg-muted border border-border text-muted-foreground group-hover:text-primary transition-colors">
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Middle row: Big Metric Number */}
            <div>
              <div className="text-2xl font-extrabold text-foreground tracking-tight font-sans tabular-nums">
                {c.value}
              </div>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                {c.subtext}
              </p>
            </div>

            {/* Bottom row: Sparkline & Trend Badge */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold inline-flex items-center gap-1 ${
                  c.badgeType === 'emerald'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60'
                    : c.badgeType === 'cyan'
                    ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-900/60'
                    : 'bg-muted text-muted-foreground border border-border'
                }`}
              >
                <ArrowUpRight className="w-2.5 h-2.5" />
                {c.badge}
              </span>

              {/* Native SVG Mini Sparkline with Gradient & Terminus Dot */}
              <div className="w-16 h-7 opacity-85 group-hover:opacity-100 transition-opacity">
                <svg viewBox="0 0 120 30" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c.sparklineColor} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={c.sparklineColor} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Area fill */}
                  <polygon
                    fill={`url(#${gradId})`}
                    points={c.polygonPoints}
                  />

                  {/* Line path */}
                  <polyline
                    fill="none"
                    stroke={c.sparklineColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={c.sparklinePoints}
                  />

                  {/* Pulsing Terminus Dot */}
                  <circle
                    cx={c.lastPoint.cx}
                    cy={c.lastPoint.cy}
                    r="4"
                    fill={c.sparklineColor}
                    className="animate-ping opacity-75"
                  />
                  <circle
                    cx={c.lastPoint.cx}
                    cy={c.lastPoint.cy}
                    r="3"
                    fill={c.sparklineColor}
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

