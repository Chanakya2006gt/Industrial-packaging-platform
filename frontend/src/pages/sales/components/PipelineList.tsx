import React, { useState } from 'react';
import { Search, Calculator, MessageSquare, CheckSquare, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { RfqInquiry } from '../../../lib/supabase';

interface PipelineListProps {
  rfqs: RfqInquiry[];
  loading: boolean;
  onEstimateRfq: (rfq: RfqInquiry) => void;
  onWhatsAppRfq: (rfq: RfqInquiry) => void;
  onOpenPaymentModal: (rfq: RfqInquiry) => void;
  onUpdateStatus: (rfqId: string, newStatus: string) => Promise<void>;
}

export const PipelineList: React.FC<PipelineListProps> = ({
  rfqs,
  loading,
  onEstimateRfq,
  onWhatsAppRfq,
  onOpenPaymentModal,
  onUpdateStatus
}) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Dynamic 4-Hour SLA Timer Calculator
  const getSlaIndicator = (createdAt: string, status: string) => {
    if (status !== 'pending' && status !== 'reviewing') {
      return null;
    }

    const createdMs = new Date(createdAt).getTime();
    const nowMs = Date.now();
    const elapsedMinutes = Math.floor((nowMs - createdMs) / 60000);
    const deadlineMinutes = 4 * 60; // 4 hours SLA
    const remainingMinutes = deadlineMinutes - elapsedMinutes;

    if (remainingMinutes <= 0) {
      const overdueMins = Math.abs(remainingMinutes);
      return (
        <span className="text-[10px] font-mono font-bold text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 rounded flex items-center gap-1 border border-rose-300 dark:border-rose-800">
          <Clock className="w-3 h-3 text-rose-600 animate-pulse" />
          <span>SLA OVERDUE (+{Math.floor(overdueMins / 60)}h {overdueMins % 60}m)</span>
        </span>
      );
    }

    if (remainingMinutes <= 90) {
      return (
        <span className="text-[10px] font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded flex items-center gap-1 border border-amber-300 dark:border-amber-800">
          <Clock className="w-3 h-3 text-amber-600 animate-spin" />
          <span>URGENT: {Math.floor(remainingMinutes / 60)}h {remainingMinutes % 60}m SLA</span>
        </span>
      );
    }

    return (
      <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
        <Clock className="w-3 h-3 text-emerald-600" />
        <span>{Math.floor(remainingMinutes / 60)}h {remainingMinutes % 60}m SLA</span>
      </span>
    );
  };

  const handleStatusChange = async (rfqId: string, status: string) => {
    setUpdatingId(rfqId);
    await onUpdateStatus(rfqId, status);
    setUpdatingId(null);
  };

  const filteredRfqs = rfqs.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        r.company_name.toLowerCase().includes(q) ||
        r.reference_no.toLowerCase().includes(q) ||
        r.contact_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs font-mono">
          {[
            { id: 'all', label: 'All Inquiries' },
            { id: 'pending', label: '📥 Pending' },
            { id: 'reviewing', label: '🔍 Reviewing' },
            { id: 'quoted', label: '📄 Quoted' },
            { id: 'in_production', label: '🏭 In Press' },
            { id: 'settled', label: '💰 Settled' }
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setFilter(st.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                filter === st.id
                  ? 'bg-[#E00019] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search company, ref, contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-slate-500">
          Loading real-time RFQ records from Supabase...
        </div>
      ) : filteredRfqs.length === 0 ? (
        <div className="p-12 text-center text-xs font-mono text-slate-500 border border-dashed rounded-2xl border-slate-300 dark:border-slate-800">
          No RFQs found matching the selected criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRfqs.map(rfq => (
            <div
              key={rfq.id}
              className="double-bezel hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="double-bezel-inner p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Left Metadata */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs text-[#E00019]">{rfq.reference_no}</span>
                    <span className="text-slate-400">•</span>
                    <h3 className="font-extrabold text-base text-slate-950 dark:text-white">{rfq.company_name}</h3>
                    
                    <span className={`tech-tag text-[9px] ${
                      rfq.status === 'settled' ? 'tech-tag-emerald' :
                      rfq.status === 'in_production' ? 'tech-tag-cyan' :
                      rfq.status === 'quoted' ? 'tech-tag-neutral' : 'tech-tag-crimson'
                    }`}>
                      {rfq.status.toUpperCase()}
                    </span>

                    {getSlaIndicator(rfq.created_at, rfq.status)}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-600 dark:text-slate-400 flex-wrap">
                    <span>👤 {rfq.contact_name} ({rfq.phone})</span>
                    <span>📏 {rfq.dimensions_mm}mm</span>
                    <span>📦 {rfq.quantity.toLocaleString()} units</span>
                    <span>🏷️ {rfq.substrate}</span>
                  </div>

                  {rfq.notes && (
                    <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800/60 max-w-2xl">
                      "{rfq.notes}"
                    </p>
                  )}
                </div>

                {/* Right Action Gates */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  
                  {/* Status Transition Select */}
                  <select
                    value={rfq.status}
                    disabled={updatingId === rfq.id}
                    onChange={(e) => handleStatusChange(rfq.id, e.target.value)}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-300"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="quoted">Quoted</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_production">In Press Line</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="settled">Settled (Paid)</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={() => onEstimateRfq(rfq)}
                    className="px-3.5 py-2 rounded-xl bg-cyan-600 text-white font-mono text-xs font-bold hover:bg-cyan-700 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Estimate</span>
                  </button>

                  <button
                    onClick={() => onWhatsAppRfq(rfq)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-mono text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  {rfq.status !== 'settled' && (
                    <button
                      onClick={() => onOpenPaymentModal(rfq)}
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold hover:bg-slate-200 transition-all flex items-center gap-1"
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Record Wire</span>
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
