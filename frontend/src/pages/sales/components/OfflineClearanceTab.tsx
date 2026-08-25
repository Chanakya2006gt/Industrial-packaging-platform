import React from 'react';
import { DollarSign, CheckCircle } from 'lucide-react';

export interface ClearanceRecord {
  id: string;
  rfq_reference_no: string;
  company_name: string;
  payment_method: string;
  bank_reference_no: string;
  amount_zmw: number;
  cleared_by: string;
  cleared_at: string;
}

interface OfflineClearanceTabProps {
  clearances: ClearanceRecord[];
  loading: boolean;
}

export const OfflineClearanceTab: React.FC<OfflineClearanceTabProps> = ({
  clearances,
  loading
}) => {
  return (
    <div className="space-y-6">
      <div className="double-bezel">
        <div className="double-bezel-inner p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-lg text-slate-950 dark:text-white">
                Cleared B2B Production Orders (Offline Clearance Ledger)
              </h3>
              <p className="text-xs text-slate-500">
                Direct wire transfers, ZANACO transfers, cheques, and cash settlements verified in `offline_bank_clearances`.
              </p>
            </div>
            <span className="tech-tag tech-tag-emerald text-[10px]">
              {clearances.length} Orders Cleared
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs font-mono text-slate-500">
              Loading clearance transactions from Supabase...
            </div>
          ) : clearances.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-slate-500 border border-dashed rounded-xl border-slate-300 dark:border-slate-800">
              No offline bank clearance records logged yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {clearances.map(c => (
                <div key={c.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                  <div>
                    <strong className="text-slate-900 dark:text-white font-bold text-sm">{c.company_name}</strong>
                    <span className="text-slate-500 ml-2 font-bold">({c.rfq_reference_no})</span>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                      <span className="text-[#E00019] font-bold uppercase">{c.payment_method.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>Ref: <strong className="text-slate-700 dark:text-slate-300">{c.bank_reference_no}</strong></span>
                      <span>•</span>
                      <span>Cleared by: {c.cleared_by}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded text-xs">
                      ZMW {c.amount_zmw ? c.amount_zmw.toLocaleString() : '0.00'}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {new Date(c.cleared_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
