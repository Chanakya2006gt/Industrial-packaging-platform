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
      <div className="bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 max-w-md w-full">
        
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-base text-slate-950 dark:text-white">
            Record Customer Payment
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer">✕</button>
        </div>

        <div className="space-y-3 text-xs font-mono">
          <div>
            <span className="text-slate-500">Customer / Company:</span>
            <strong className="block text-slate-900 dark:text-white text-sm">{rfq.company_name}</strong>
            <span className="text-[11px] text-slate-400">Quote Ref: {rfq.reference_no}</span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold cursor-pointer"
            >
              <option value="stanbic_wire">Bank Wire Transfer</option>
              <option value="zanaco_wire">Online Bank Transfer (ACH / EFT)</option>
              <option value="cheque">Company Cheque</option>
              <option value="cash">Cash Payment</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Payment Reference or Transaction ID *</label>
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
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Payment Amount (ZMW)</label>
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
            className="btn-pill btn-pill-outline text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting || !paymentRefNo}
            className="btn-pill btn-pill-primary text-xs font-bold disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Saving Payment...' : 'Confirm Payment & Start Production'}
          </button>
        </div>

      </div>
    </div>
  );
};
