import React from 'react';
import { RfqInquiry } from '../../../lib/supabase';

interface PaymentClearanceModalProps {
  rfq: RfqInquiry | null;
  paymentMethod: 'stanbic_wire' | 'zanaco_wire' | 'cheque' | 'cash';
  setPaymentMethod: (v: 'stanbic_wire' | 'zanaco_wire' | 'cheque' | 'cash') => void;
  paymentRefNo: string;
  setPaymentRefNo: (v: string) => void;
  paymentAmount: number;
  setPaymentAmount: (v: number) => void;
  submitting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const PaymentClearanceModal: React.FC<PaymentClearanceModalProps> = ({
  rfq,
  paymentMethod,
  setPaymentMethod,
  paymentRefNo,
  setPaymentRefNo,
  paymentAmount,
  setPaymentAmount,
  submitting,
  onClose,
  onConfirm
}) => {
  if (!rfq) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="double-bezel max-w-md w-full">
        <div className="double-bezel-inner p-6 space-y-4 bg-white dark:bg-slate-900">
          
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-base text-slate-950 dark:text-white">
              Record Bank Clearance
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <span className="text-slate-500">Client Account:</span>
              <strong className="block text-slate-900 dark:text-white text-sm">{rfq.company_name}</strong>
              <span className="text-[11px] text-slate-400">Reference: {rfq.reference_no}</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
              >
                <option value="stanbic_wire">Commercial Wire Transfer</option>
                <option value="zanaco_wire">Corporate ACH / Electronic Transfer</option>
                <option value="cheque">Bank Cheque / Draft</option>
                <option value="cash">Cash Settlement (Plant Cashier)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Bank Reference / Cheque No *</label>
              <input
                type="text"
                required
                value={paymentRefNo}
                onChange={(e) => setPaymentRefNo(e.target.value)}
                placeholder="e.g. TXN-WIRE-884920"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Amount Cleared (ZMW)</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={onClose}
              disabled={submitting}
              className="btn-pill btn-pill-outline text-xs"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={submitting || !paymentRefNo}
              className="btn-pill btn-pill-primary text-xs font-bold disabled:opacity-50"
            >
              {submitting ? 'Recording Clearance...' : 'Confirm & Release to Press'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
