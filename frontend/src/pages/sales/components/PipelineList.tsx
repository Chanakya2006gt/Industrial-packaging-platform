import React, { useState } from 'react';
import { Search, Calculator, MessageSquare, CheckSquare, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { RfqInquiry } from '../../../lib/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

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

  // Response Time Target Indicator
  const getSlaIndicator = (createdAt: string, status: string) => {
    if (status !== 'pending' && status !== 'reviewing') {
      return null;
    }

    const createdMs = new Date(createdAt).getTime();
    const nowMs = Date.now();
    const elapsedMinutes = Math.floor((nowMs - createdMs) / 60000);
    const deadlineMinutes = 3 * 60; // 3 hours response goal
    const remainingMinutes = deadlineMinutes - elapsedMinutes;

    if (remainingMinutes <= 0) {
      const overdueMins = Math.abs(remainingMinutes);
      return (
        <span className="text-[10px] font-mono font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded flex items-center gap-1 border border-destructive/30">
          <Clock className="w-3 h-3 text-destructive animate-pulse" />
          <span>Needs Immediate Reply (+{Math.floor(overdueMins / 60)}h {overdueMins % 60}m)</span>
        </span>
      );
    }

    if (remainingMinutes <= 60) {
      return (
        <span className="text-[10px] font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded flex items-center gap-1 border border-amber-300 dark:border-amber-800">
          <Clock className="w-3 h-3 text-amber-600" />
          <span>Reply within {Math.floor(remainingMinutes / 60)}h {remainingMinutes % 60}m</span>
        </span>
      );
    }

    return (
      <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
        <Clock className="w-3 h-3 text-emerald-600" />
        <span>Target: {Math.floor(remainingMinutes / 60)}h {remainingMinutes % 60}m</span>
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
            { id: 'all', label: 'All Quotes' },
            { id: 'pending', label: '📥 New' },
            { id: 'reviewing', label: '🔍 Under Review' },
            { id: 'quoted', label: '📄 Quoted' },
            { id: 'in_production', label: '🏭 In Production' },
            { id: 'settled', label: '💰 Paid' }
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setFilter(st.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                filter === st.id
                  ? 'bg-primary text-primary-foreground shadow-theme-sm'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search company, ref, or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-input bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-muted-foreground">
          Loading customer quotes...
        </div>
      ) : filteredRfqs.length === 0 ? (
        <div className="p-12 text-center text-xs font-mono text-muted-foreground border border-dashed rounded-2xl border-border">
          No quotes found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRfqs.map(rfq => (
            <div
              key={rfq.id}
              className="bg-card border border-border rounded-2xl shadow-theme-sm hover:border-border/80 transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Metadata */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-xs text-primary">{rfq.reference_no}</span>
                  <span className="text-muted-foreground">•</span>
                  <h3 className="font-extrabold text-base text-foreground">{rfq.company_name}</h3>
                  
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                    rfq.status === 'settled' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
                    rfq.status === 'in_production' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800' :
                    rfq.status === 'quoted' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800' :
                    'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  }`}>
                    {rfq.status === 'in_production' ? 'IN PRODUCTION' : rfq.status === 'settled' ? 'PAID & SETTLED' : rfq.status.toUpperCase()}
                  </span>

                  {getSlaIndicator(rfq.created_at, rfq.status)}
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground flex-wrap">
                  <span>👤 {rfq.contact_name} ({rfq.phone})</span>
                  <span>📏 {rfq.dimensions_mm}mm</span>
                  <span>📦 {rfq.quantity.toLocaleString()} units</span>
                  <span>🏷️ {rfq.substrate}</span>
                </div>

                {rfq.notes && (
                  <p className="text-xs text-muted-foreground italic bg-muted/40 p-2 rounded-lg border border-border max-w-2xl">
                    "{rfq.notes}"
                  </p>
                )}
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                
                {/* Radix Status Select */}
                <div className="w-36">
                  <Select
                    value={rfq.status}
                    disabled={updatingId === rfq.id}
                    onValueChange={(val) => handleStatusChange(rfq.id, val)}
                  >
                    <SelectTrigger className="h-9 text-xs font-mono font-bold">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">New Inquiry</SelectItem>
                      <SelectItem value="reviewing">Under Review</SelectItem>
                      <SelectItem value="quoted">Quote Sent</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="in_production">In Production</SelectItem>
                      <SelectItem value="dispatched">Dispatched</SelectItem>
                      <SelectItem value="settled">Paid & Settled</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <button
                  onClick={() => onEstimateRfq(rfq)}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600 text-white font-mono text-xs font-bold hover:bg-cyan-700 transition-all flex items-center gap-1.5 shadow-theme-sm cursor-pointer"
                  title="Open Price Calculator"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Calculate</span>
                </button>

                <button
                  onClick={() => onWhatsAppRfq(rfq)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-mono text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-theme-sm cursor-pointer"
                  title="Send Quote via WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                {rfq.status !== 'settled' && (
                  <button
                    onClick={() => onOpenPaymentModal(rfq)}
                    className="px-3 py-2 rounded-xl bg-muted border border-border text-foreground font-mono text-xs font-bold hover:bg-accent transition-all flex items-center gap-1 cursor-pointer"
                    title="Record Payment"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Record Payment</span>
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

