import React from 'react';
import { MessageSquare, Printer } from 'lucide-react';
import { PackagingEstimateOutput } from '../../../lib/calculator';

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
        <div className="bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs p-6 space-y-5">
          
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-lg text-slate-950 dark:text-white">
                Instant Price & Production Calculator
              </h3>
              <p className="text-xs text-slate-500">Calculate accurate costs, profit margins, and customer pricing for custom orders.</p>
            </div>
            {selectedRefNo && (
              <span className="font-mono text-xs font-bold text-[#E00019] bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-900/60">
                Ref: {selectedRefNo}
              </span>
            )}
          </div>

          {/* Company & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Customer / Company Name</label>
              <input
                type="text"
                value={calcCompanyName}
                onChange={(e) => setCalcCompanyName(e.target.value)}
                placeholder="e.g. Apex Bottlers Ltd"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Customer Phone Number</label>
              <input
                type="text"
                value={calcPhone}
                onChange={(e) => setCalcPhone(e.target.value)}
                placeholder="e.g. +1 (555) 019-2834"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
              />
            </div>
          </div>

          {/* Category & Substrate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Packaging Type</label>
              <select
                value={calcCategory}
                onChange={(e) => setCalcCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold cursor-pointer"
              >
                <option value="flexo_labels">Roll Labels (Flexo)</option>
                <option value="offset_packaging">Folding Cartons & Boxes</option>
                <option value="commercial_print">Commercial Print & Inserts</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Paper & Material Type</label>
              <select
                value={calcSubstrate}
                onChange={(e) => setCalcSubstrate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold cursor-pointer"
              >
                {Object.entries(supplierRates).map(([k, v]) => (
                  <option key={k} value={k}>{v.name} (ZMW {v.pricePerSqm.toFixed(2)}/m²)</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dimensions & Quantity */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Width (mm)</label>
              <input
                type="number"
                value={calcWidthMm}
                onChange={(e) => setCalcWidthMm(Math.max(10, Number(e.target.value)))}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Height (mm)</label>
              <input
                type="number"
                value={calcHeightMm}
                onChange={(e) => setCalcHeightMm(Math.max(10, Number(e.target.value)))}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Quantity (Units)</label>
              <input
                type="number"
                value={calcQuantity}
                step={5000}
                onChange={(e) => setCalcQuantity(Math.max(1000, Number(e.target.value)))}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold font-mono"
              />
            </div>
          </div>

          {/* Profit Margin Dials */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                Target Profit Margin ({calcMarginPercent}%)
              </label>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                + ZMW {currentCalc.marginAmountZMW.toLocaleString()} profit
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
                      ? 'bg-[#E00019] text-white border-[#E00019] shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Waive Tooling */}
          <label className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-slate-300 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={calcWaiveTooling}
              onChange={(e) => setCalcWaiveTooling(e.target.checked)}
              className="rounded text-rose-600 cursor-pointer"
            />
            <span>Waive one-time die-cutting setup fee (ZMW 1,800) for regular corporate customer</span>
          </label>

        </div>
      </div>

      {/* Right Summary: Cost Matrix & Dispatch (5 Cols) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-5">
          
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-900/60 text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-400">
              PRICE BREAKDOWN
            </span>
            <span className="text-xs font-mono text-slate-400">Includes 16% VAT</span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Raw Materials & Paper ({currentCalc.totalSqMeters} m²):</span>
              <strong className="text-slate-900 dark:text-white font-bold">ZMW {currentCalc.materialCostZMW.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Printing Plates Setup ({currentCalc.ctpPlatesCount} plates):</span>
              <strong className="text-slate-900 dark:text-white font-bold">ZMW {currentCalc.plateCostZMW.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Die-Cutting Tooling Setup:</span>
              <strong className="text-slate-900 dark:text-white font-bold">
                {currentCalc.toolingCostZMW === 0 ? <span className="text-emerald-500">Waived (FREE)</span> : `ZMW ${currentCalc.toolingCostZMW.toLocaleString()}`}
              </strong>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Machine Production Time (~{currentCalc.pressRunHours} hrs):</span>
              <strong className="text-slate-900 dark:text-white font-bold">ZMW {currentCalc.pressCostZMW.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Inks & Protective Varnish:</span>
              <strong className="text-slate-900 dark:text-white font-bold">ZMW {currentCalc.inkAndFinishingCostZMW.toLocaleString()}</strong>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-between text-slate-700 dark:text-slate-300 font-bold">
              <span>Subtotal (Before Tax):</span>
              <span>ZMW {currentCalc.netPriceZMW.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-cyan-600 dark:text-cyan-400">
              <span>Sales Tax / VAT (16%):</span>
              <strong>ZMW {currentCalc.vatZMW.toLocaleString()}</strong>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between items-baseline">
              <span className="font-extrabold text-sm text-slate-950 dark:text-white">TOTAL CUSTOMER PRICE:</span>
              <strong className="text-xl font-extrabold text-[#E00019] dark:text-emerald-400">
                ZMW {currentCalc.finalGrossPriceZMW.toLocaleString()}
              </strong>
            </div>

            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span>Price Per Unit:</span>
              <strong className="text-slate-950 dark:text-white font-bold font-mono">ZMW {currentCalc.unitPriceZMW.toFixed(4)} / unit</strong>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onOpenWhatsApp}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Quote to Customer on WhatsApp</span>
            </button>

            <button
              onClick={() => {
                alert(`Quote Job Sheet Generated! Total: ZMW ${currentCalc.finalGrossPriceZMW.toLocaleString()}`);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 cursor-pointer"
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
