import React from 'react';

interface QuickIntakeModalProps {
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="double-bezel max-w-md w-full">
        <form onSubmit={onSubmit} className="double-bezel-inner p-6 space-y-4 bg-white dark:bg-slate-900">
          
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-base text-slate-950 dark:text-white">
              + Quick Walk-in / Phone Intake
            </h3>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Company Name *</label>
              <input
                type="text"
                required
                value={intakeCompany}
                onChange={(e) => setIntakeCompany(e.target.value)}
                placeholder="e.g. Lusaka Dairy Co"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Person *</label>
              <input
                type="text"
                required
                value={intakeContact}
                onChange={(e) => setIntakeContact(e.target.value)}
                placeholder="e.g. John Phiri"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number (WhatsApp) *</label>
              <input
                type="tel"
                required
                value={intakePhone}
                onChange={(e) => setIntakePhone(e.target.value)}
                placeholder="+260 97X XXX XXX"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Product Category</label>
              <select
                value={intakeCategory}
                onChange={(e) => setIntakeCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
              >
                <option value="flexo_labels">8C UV Flexo Roll Labels</option>
                <option value="offset_packaging">Heidelberg Folding Cartons</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn-pill btn-pill-outline text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-pill btn-pill-primary text-xs font-bold disabled:opacity-50"
            >
              {submitting ? 'Registering Intake...' : 'Create & Launch CPQ'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
