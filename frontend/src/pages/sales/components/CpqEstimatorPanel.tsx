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
        <div className="double-bezel">
          <div className="double-bezel-inner p-6 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-950 dark:text-white">
                  Packaging CPQ Calculation Engine
                </h3>
                <p className="text-xs text-slate-500">Live Heidelberg 6C & 8C UV Flexo rate formulas</p>
              </div>
              {selectedRefNo && (
                <span className="font-mono text-xs font-bold text-[#E00019] bg-rose-50 dark:bg-rose-950/40 px-2 py-1 rounded">
                  Ref: {selectedRefNo}
                </span>
              )}
            </div>

            {/* Company & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  value={calcCompanyName}
                  onChange={(e) => setCalcCompanyName(e.target.value)}
                  placeholder="e.g. Zambian Breweries PLC"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Client WhatsApp Phone</label>
                <input
                  type="text"
                  value={calcPhone}
                  onChange={(e) => setCalcPhone(e.target.value)}
                  placeholder="e.g. +260 977 123 456"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                />
              </div>
            </div>

            {/* Category & Substrate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Press Category</label>
                <select
                  value={calcCategory}
                  onChange={(e) => setCalcCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                >
                  <option value="flexo_labels">8C UV Flexo Roll Labels</option>
                  <option value="offset_packaging">Heidelberg 6C Folding Cartons</option>
                  <option value="commercial_print">Laser CTP Commercial Print</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Substrate Material</label>
                <select
                  value={calcSubstrate}
                  onChange={(e) => setCalcSubstrate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
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
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Order Volume</label>
                <input
                  type="number"
                  value={calcQuantity}
                  step={5000}
                  onChange={(e) => setCalcQuantity(Math.max(1000, Number(e.target.value)))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold font-mono"
                />
              </div>
            </div>

            {/* Margin Dials */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  Markup Margin ({calcMarginPercent}%)
                </label>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                  + ZMW {currentCalc.marginAmountZMW.toLocaleString()} profit
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[18, 25, 30, 35].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setCalcMarginPercent(m)}
                    className={`p-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                      calcMarginPercent === m
                        ? 'bg-[#E00019] text-white border-[#E00019] shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {m}% {m === 18 ? 'Corp' : m === 25 ? 'Std' : m === 35 ? 'Rush' : ''}
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
                className="rounded text-rose-600"
              />
              <span>Waive rotary die tooling fee (ZMW 1,800) for VIP corporate account</span>
            </label>

          </div>
        </div>
      </div>

      {/* Right Summary: Cost Matrix & Dispatch (5 Cols) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="double-bezel bg-slate-900 text-white border-slate-800">
          <div className="double-bezel-inner p-6 space-y-5 bg-[#090E1A]">
            
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <span className="tech-tag tech-tag-cyan text-[9px]">CALCULATED QUOTE BREAKDOWN</span>
              <span className="text-xs font-mono text-slate-400">16% ZRA Compliant</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Raw Substrate ({currentCalc.totalSqMeters} m²):</span>
                <strong className="text-white">ZMW {currentCalc.materialCostZMW.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>CTP Laser Plates ({currentCalc.ctpPlatesCount} plates):</span>
                <strong className="text-white">ZMW {currentCalc.plateCostZMW.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Rotary Tooling Setup:</span>
                <strong className="text-white">ZMW {currentCalc.toolingCostZMW.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Press Run Time (~{currentCalc.pressRunHours} hrs):</span>
                <strong className="text-white">ZMW {currentCalc.pressCostZMW.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>UV Inks & Protective Finish:</span>
                <strong className="text-white">ZMW {currentCalc.inkAndFinishingCostZMW.toLocaleString()}</strong>
              </div>

              <div className="border-t border-slate-800 pt-2 flex justify-between text-slate-300 font-bold">
                <span>Net Manufacturing Subtotal:</span>
                <span>ZMW {currentCalc.netPriceZMW.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-cyan-400">
                <span>ZRA VAT (16%):</span>
                <strong>ZMW {currentCalc.vatZMW.toLocaleString()}</strong>
              </div>

              <div className="border-t border-slate-700 pt-3 flex justify-between items-baseline">
                <span className="font-extrabold text-sm text-white">FINAL GROSS QUOTE:</span>
                <strong className="text-xl font-extrabold text-emerald-400">
                  ZMW {currentCalc.finalGrossPriceZMW.toLocaleString()}
                </strong>
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span>Unit Cost to Client:</span>
                <strong className="text-amber-400">ZMW {currentCalc.unitPriceZMW.toFixed(4)} / unit</strong>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800">
              <button
                onClick={onOpenWhatsApp}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Official WhatsApp Quote</span>
              </button>

              <button
                onClick={() => {
                  alert(`Official PZL Job-Card Generated! Gross: ZMW ${currentCalc.finalGrossPriceZMW.toLocaleString()}`);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700"
              >
                <Printer className="w-4 h-4" />
                <span>Print Commercial Job-Card</span>
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};
