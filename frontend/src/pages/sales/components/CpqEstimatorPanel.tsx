import React from 'react';
import { MessageSquare, Printer } from 'lucide-react';
import { PackagingEstimateOutput } from '../../../lib/calculator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

interface CpqEstimatorPanelProps {
  calcCompanyName: string;
  setCalcCompanyName: (v: string) => void;
  calcPhone: string;
  setCalcPhone: (v: string) => void;
  calcCategory: 'flexo_labels' | 'offset_packaging' | 'commercial_print';
  setCalcCategory: (v: 'flexo_labels' | 'offset_packaging' | 'commercial_print') => void;
  calcSubstrate: string;
  setCalcSubstrate: (v: string) => void;
  calcWidthMm: number;
  setCalcWidthMm: (v: number) => void;
  calcHeightMm: number;
  setCalcHeightMm: (v: number) => void;
  calcQuantity: number;
  setCalcQuantity: (v: number) => void;
  calcMarginPercent: number;
  setCalcMarginPercent: (v: number) => void;
  calcWaiveTooling: boolean;
  setCalcWaiveTooling: (v: boolean) => void;
  supplierRates: Record<string, { pricePerSqm: number; name: string; category: string }>;
  currentCalc: PackagingEstimateOutput;
  selectedRefNo?: string;
  onOpenWhatsApp: () => void;
}

export const CpqEstimatorPanel: React.FC<CpqEstimatorPanelProps> = ({
  calcCompanyName,
  setCalcCompanyName,
  calcPhone,
  setCalcPhone,
  calcCategory,
  setCalcCategory,
  calcSubstrate,
  setCalcSubstrate,
  calcWidthMm,
  setCalcWidthMm,
  calcHeightMm,
  setCalcHeightMm,
  calcQuantity,
  setCalcQuantity,
  calcMarginPercent,
  setCalcMarginPercent,
  calcWaiveTooling,
  setCalcWaiveTooling,
  supplierRates,
  currentCalc,
  selectedRefNo,
  onOpenWhatsApp
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Form: Inputs (7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-card border border-border rounded-2xl shadow-theme-sm p-6 space-y-5">
          
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-extrabold text-lg text-foreground">
                Instant Price & Production Calculator
              </h3>
              <p className="text-xs text-muted-foreground">Calculate accurate costs, profit margins, and customer pricing for custom orders.</p>
            </div>
            {selectedRefNo && (
              <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                Ref: {selectedRefNo}
              </span>
            )}
          </div>

          {/* Company & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-foreground mb-1.5">Customer / Company Name</label>
              <input
                type="text"
                value={calcCompanyName}
                onChange={(e) => setCalcCompanyName(e.target.value)}
                placeholder="e.g. Apex Bottlers Ltd"
                className="w-full h-10 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-foreground mb-1.5">Customer Phone Number</label>
              <input
                type="text"
                value={calcPhone}
                onChange={(e) => setCalcPhone(e.target.value)}
                placeholder="e.g. +1 (555) 019-2834"
                className="w-full h-10 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>

          {/* Category & Substrate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-foreground mb-1.5">Packaging Type</label>
              <Select value={calcCategory} onValueChange={(val: any) => setCalcCategory(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Packaging Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flexo_labels">Roll Labels (Flexo)</SelectItem>
                  <SelectItem value="offset_packaging">Folding Cartons & Boxes</SelectItem>
                  <SelectItem value="commercial_print">Commercial Print & Inserts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-foreground mb-1.5">Paper & Material Type</label>
              <Select value={calcSubstrate} onValueChange={(val) => setCalcSubstrate(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Material" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(supplierRates).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v.name} (${v.pricePerSqm.toFixed(2)}/m²)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dimensions & Quantity */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold text-foreground mb-1.5">Width (mm)</label>
              <input
                type="number"
                value={calcWidthMm}
                onChange={(e) => setCalcWidthMm(Math.max(10, Number(e.target.value)))}
                className="w-full h-10 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-foreground mb-1.5">Height (mm)</label>
              <input
                type="number"
                value={calcHeightMm}
                onChange={(e) => setCalcHeightMm(Math.max(10, Number(e.target.value)))}
                className="w-full h-10 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-foreground mb-1.5">Quantity (Units)</label>
              <input
                type="number"
                value={calcQuantity}
                step={5000}
                onChange={(e) => setCalcQuantity(Math.max(1000, Number(e.target.value)))}
                className="w-full h-10 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>

          {/* Profit Margin Dials */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-bold text-foreground">
                Target Profit Margin ({calcMarginPercent}%)
              </label>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                + ${currentCalc.marginAmountZMW.toLocaleString()} profit
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { percent: 18, label: '18% Wholesale' },
                { percent: 25, label: '25% Standard' },
                { percent: 30, label: '30% Premium' },
                { percent: 35, label: '35% Custom' }
              ].map(m => (
                <button
                  key={m.percent}
                  type="button"
                  onClick={() => setCalcMarginPercent(m.percent)}
                  className={`p-2.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                    calcMarginPercent === m.percent
                      ? 'bg-primary text-primary-foreground border-primary shadow-theme-sm'
                      : 'bg-muted border-border text-foreground hover:bg-accent'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Waive Tooling */}
          <label className="flex items-center gap-2 text-xs font-mono text-muted-foreground cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={calcWaiveTooling}
              onChange={(e) => setCalcWaiveTooling(e.target.checked)}
              className="rounded text-primary cursor-pointer"
            />
            <span>Waive one-time die-cutting setup fee ($150) for regular corporate customer</span>
          </label>

        </div>
      </div>

      {/* Right Summary: Cost Matrix & Dispatch (5 Cols) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-card border border-border rounded-2xl shadow-theme-sm p-6 space-y-5">
          
          <div className="border-b border-border pb-3 flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400">
              PRICE BREAKDOWN
            </span>
            <span className="text-xs font-mono text-muted-foreground">Includes 16% Tax</span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between text-muted-foreground">
              <span>Raw Materials & Paper ({currentCalc.totalSqMeters} m²):</span>
              <strong className="text-foreground font-bold">${currentCalc.materialCostZMW.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Printing Plates Setup ({currentCalc.ctpPlatesCount} plates):</span>
              <strong className="text-foreground font-bold">${currentCalc.plateCostZMW.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Die-Cutting Tooling Setup:</span>
              <strong className="text-foreground font-bold">
                {currentCalc.toolingCostZMW === 0 ? <span className="text-emerald-500">Waived (FREE)</span> : `$${currentCalc.toolingCostZMW.toLocaleString()}`}
              </strong>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Machine Production Time (~{currentCalc.pressRunHours} hrs):</span>
              <strong className="text-foreground font-bold">${currentCalc.pressCostZMW.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Inks & Protective Varnish:</span>
              <strong className="text-foreground font-bold">${currentCalc.inkAndFinishingCostZMW.toLocaleString()}</strong>
            </div>

            <div className="border-t border-border pt-2 flex justify-between text-foreground font-bold">
              <span>Subtotal (Before Tax):</span>
              <span>${currentCalc.netPriceZMW.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-cyan-600 dark:text-cyan-400">
              <span>Sales Tax / VAT (16%):</span>
              <strong>${currentCalc.vatZMW.toLocaleString()}</strong>
            </div>

            <div className="border-t border-border pt-3 flex justify-between items-baseline">
              <span className="font-extrabold text-sm text-foreground">TOTAL CUSTOMER PRICE:</span>
              <strong className="text-xl font-extrabold text-primary">
                ${currentCalc.finalGrossPriceZMW.toLocaleString()}
              </strong>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border">
              <span>Price Per Unit:</span>
              <strong className="text-foreground font-bold font-mono">${currentCalc.unitPriceZMW.toFixed(4)} / unit</strong>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-border">
            <button
              onClick={onOpenWhatsApp}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-theme-sm cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Quote to Customer on WhatsApp</span>
            </button>

            <button
              onClick={() => {
                alert(`Quote Job Sheet Generated! Total: $${currentCalc.finalGrossPriceZMW.toLocaleString()}`);
              }}
              className="w-full py-2.5 rounded-xl bg-muted hover:bg-accent text-foreground font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 border border-border cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Quote Summary</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
