import React from 'react';
import { Building2, ArrowRight, MessageSquare, Calculator } from 'lucide-react';
import { CrmTopAccount } from '../../../lib/crmAnalytics';

interface TopAccountsLeaderboardProps {
  accounts: CrmTopAccount[];
  onSelectAccount?: (account: CrmTopAccount) => void;
}

export const TopAccountsLeaderboard: React.FC<TopAccountsLeaderboardProps> = ({ accounts, onSelectAccount }) => {
  return (
    <div className="bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/60 text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-400">
              CLIENT ACCOUNTS
            </span>
            <span className="text-xs font-mono text-slate-400">High-Volume B2B Buyers</span>
          </div>
          <h3 className="font-extrabold text-lg text-slate-950 dark:text-white tracking-tight mt-1">
            Top Corporate Accounts by Volume
          </h3>
        </div>
        <span className="text-xs font-mono font-bold text-slate-500">
          Ranked by Lifetime Spend
        </span>
      </div>

      {/* Account Rows */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {accounts.map((acc, index) => (
          <div
            key={acc.companyName}
            className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono hover:bg-slate-50 dark:hover:bg-slate-900/40 px-2 rounded-xl transition-colors"
          >
            {/* Left Info */}
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                #{index + 1}
              </span>
              <div>
                <strong className="text-slate-950 dark:text-white font-bold text-sm block">
                  {acc.companyName}
                </strong>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                  <span>👤 {acc.contactName || 'Primary Buyer'}</span>
                  <span>•</span>
                  <span>{acc.orderCount} Orders</span>
                  <span>•</span>
                  <span className="text-[#E00019] font-bold uppercase">{acc.latestStatus}</span>
                </div>
              </div>
            </div>

            {/* Right Spend & Action */}
            <div className="flex items-center gap-4 sm:justify-end">
              <div className="text-left sm:text-right">
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm block font-sans">
                  ZMW {acc.totalSpendZMW.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">Total Account Spend</span>
              </div>

              {onSelectAccount && (
                <button
                  onClick={() => onSelectAccount(acc)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#E00019] hover:text-white dark:hover:bg-[#E00019] text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                  title="Open New Quote for Account"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
