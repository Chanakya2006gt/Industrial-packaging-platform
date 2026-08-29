import React from 'react';
import { RfqInquiry } from '../../../lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

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
  return (
    <Dialog open={!!rfq} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Customer Payment</DialogTitle>
          <DialogDescription>
            Confirm receipt of funds to advance quote to manufacturing queue.
          </DialogDescription>
        </DialogHeader>

        {rfq && (
          <div className="space-y-3.5 text-xs font-mono py-2">
            <div className="p-3 rounded-xl bg-muted/50 border border-border space-y-1">
              <span className="text-muted-foreground block">Customer / Company:</span>
              <strong className="block text-foreground text-sm font-sans font-bold">{rfq.company_name}</strong>
              <span className="text-[11px] text-muted-foreground">Quote Ref: {rfq.reference_no}</span>
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1.5 font-sans text-xs">Payment Method</label>
              <Select value={paymentMethod} onValueChange={(val: any) => setPaymentMethod(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stanbic_wire">Bank Wire Transfer</SelectItem>
                  <SelectItem value="zanaco_wire">Online Bank Transfer (ACH / EFT)</SelectItem>
                  <SelectItem value="cheque">Company Cheque</SelectItem>
                  <SelectItem value="cash">Cash Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1.5 font-sans text-xs">Payment Reference or Transaction ID *</label>
              <input
                type="text"
                required
                value={paymentRefNo}
                onChange={(e) => setPaymentRefNo(e.target.value)}
                placeholder="e.g. TXN-WIRE-884920"
                className="w-full h-10 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1.5 font-sans text-xs">Payment Amount ($ / USD)</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="btn-pill btn-pill-outline text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting || !paymentRefNo}
            className="btn-pill btn-pill-primary text-xs font-bold disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Saving Payment...' : 'Confirm Payment & Start Production'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

