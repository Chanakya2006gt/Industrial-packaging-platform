import React, { useState } from 'react';
import { Calendar, Download, RefreshCw, Sparkles, Filter } from 'lucide-react';
import { CrmAnalyticsSummary, CrmTopAccount } from '../../../lib/crmAnalytics';
import { CrmKpiGrid } from './CrmKpiGrid';
import { SalesFunnelChart } from './SalesFunnelChart';
import { RevenueTrendChart } from './RevenueTrendChart';
import { PackagingMixDonut } from './PackagingMixDonut';
import { TopAccountsLeaderboard } from './TopAccountsLeaderboard';

interface CrmAnalyticsOverviewProps {
  analytics: CrmAnalyticsSummary;
  onSelectAccount?: (account: CrmTopAccount) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export const CrmAnalyticsOverview: React.FC<CrmAnalyticsOverviewProps> = ({
  analytics,
  onSelectAccount,
  onRefresh,
  loading = false
}) => {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | 'ytd' | 'all'>('30d');

  return (
    <div className="space-y-6">
      
      {/* Overview Top Bar Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-[#E00019] dark:text-rose-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-slate-950 dark:text-white tracking-tight">
              Executive Sales Intelligence & Pipeline Health
            </h2>
            <p className="text-xs text-slate-500">Live operational telemetry across inquiries, quoting velocity, and bank clearances.</p>
          </div>
        </div>

        {/* Range Selector & Refresh */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            {[
              { id: '30d', label: 'Last 30 Days' },
              { id: '90d', label: '90 Days' },
              { id: 'ytd', label: 'YTD' },
              { id: 'all', label: 'All Time' }
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setTimeRange(r.id as any)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  timeRange === r.id
                    ? 'bg-white dark:bg-[#0C1220] text-slate-950 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* 1. TOP 4 KPI CARDS */}
      <CrmKpiGrid analytics={analytics} />

      {/* 2. MIDDLE ROW: REVENUE TRENDS & PACKAGING MIX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <RevenueTrendChart trends={analytics.monthlyTrends} />
        </div>
        <div className="lg:col-span-5">
          <PackagingMixDonut
            categories={analytics.categoryMix}
            totalUnits={analytics.kpi.totalUnitsProduced}
          />
        </div>
      </div>

      {/* 3. BOTTOM ROW: CONVERSION FUNNEL & TOP CLIENT ACCOUNTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <SalesFunnelChart stages={analytics.funnelStages} />
        </div>
        <div className="lg:col-span-5">
          <TopAccountsLeaderboard
            accounts={analytics.topAccounts}
            onSelectAccount={onSelectAccount}
          />
        </div>
      </div>

    </div>
  );
};
