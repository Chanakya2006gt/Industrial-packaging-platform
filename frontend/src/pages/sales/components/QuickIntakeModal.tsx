import React from 'react';
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

interface QuickIntakeModalProps {
  isOpen: boolean;
  intakeCompany: string;
  setIntakeCompany: (v: string) => void;
  intakeContact: string;
  setIntakeContact: (v: string) => void;
  intakePhone: string;
  setIntakePhone: (v: string) => void;
  intakeCategory: 'flexo_labels' | 'offset_packaging';
  setIntakeCategory: (v: 'flexo_labels' | 'offset_packaging') => void;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const QuickIntakeModal: React.FC<QuickIntakeModalProps> = ({
  isOpen = true,
  intakeCompany,
  setIntakeCompany,
  intakeContact,
  setIntakeContact,
  intakePhone,
  setIntakePhone,
  intakeCategory,
  setIntakeCategory,
  submitting,
  onClose,
  onSubmit
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md">
        <form onSubmit={onSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>+ New Customer Quote</DialogTitle>
            <DialogDescription>
              Create an expedited packaging inquiry directly from the floor.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 text-xs py-1">
            <div>
              <label className="block font-sans font-bold text-foreground mb-1.5 text-xs">Company / Customer Name *</label>
              <input
                type="text"
                required
                value={intakeCompany}
                onChange={(e) => setIntakeCompany(e.target.value)}
                placeholder="e.g. Metro Dairy Co"
                className="w-full h-10 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>

            <div>
              <label className="block font-sans font-bold text-foreground mb-1.5 text-xs">Contact Person *</label>
              <input
                type="text"
                required
                value={intakeContact}
                onChange={(e) => setIntakeContact(e.target.value)}
                placeholder="e.g. John Miller"
                className="w-full h-10 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>

            <div>
              <label className="block font-sans font-bold text-foreground mb-1.5 text-xs">Customer Phone Number *</label>
              <input
                type="tel"
                required
                value={intakePhone}
                onChange={(e) => setIntakePhone(e.target.value)}
                placeholder="+1 (555) 019-XXXX"
                className="w-full h-10 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>

            <div>
              <label className="block font-sans font-bold text-foreground mb-1.5 text-xs">Packaging Type</label>
              <Select value={intakeCategory} onValueChange={(val: any) => setIntakeCategory(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Packaging Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flexo_labels">Roll Labels (Flexo)</SelectItem>
                  <SelectItem value="offset_packaging">Folding Cartons & Boxes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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
              type="submit"
              disabled={submitting}
              className="btn-pill btn-pill-primary text-xs font-bold disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Creating Quote...' : 'Create Quote'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
