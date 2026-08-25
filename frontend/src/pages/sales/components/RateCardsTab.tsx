import React, { useState } from 'react';
import { Upload } from 'lucide-react';

interface RateCardsTabProps {
  supplierRates: Record<string, { pricePerSqm: number; name: string; category: string }>;
  csvUploadSuccess: string | null;
  onRateChange: (key: string, newRate: number) => Promise<void>;
  onCsvUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RateCardsTab: React.FC<RateCardsTabProps> = ({
  supplierRates,
  csvUploadSuccess,
  onRateChange,
  onCsvUpload
}) => {
  const [localValues, setLocalValues] = useState<Record<string, number>>({});

  const handleBlur = (key: string) => {
    if (localValues[key] !== undefined && localValues[key] !== supplierRates[key]?.pricePerSqm) {
      onRateChange(key, localValues[key]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs p-6 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-950 dark:text-white">
              Paper & Material Pricing
            </h3>
            <p className="text-xs text-slate-500">
              Manage your raw paper and plastic substrate unit costs. You can edit values directly in the table or upload a spreadsheet.
            </p>
          </div>

          <div className="relative">
            <input
              type="file"
              id="rateCardCsvUpload"
              accept=".csv,.txt"
              onChange={onCsvUpload}
              className="hidden"
            />
            <label
              htmlFor="rateCardCsvUpload"
              className="btn-pill btn-pill-primary text-xs font-mono font-bold cursor-pointer inline-flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Price Spreadsheet (CSV)</span>
            </label>
          </div>
        </div>

        {csvUploadSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs font-mono text-emerald-800 dark:text-emerald-300">
            {csvUploadSuccess}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-100 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase">
              <tr>
                <th className="p-3">Material Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Cost per m² (ZMW)</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-white">
              {Object.entries(supplierRates).map(([key, item]) => (
                <tr key={key} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="p-3 font-bold">{item.name}</td>
                  <td className="p-3 text-slate-500">{item.category}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      step="0.10"
                      value={localValues[key] !== undefined ? localValues[key] : item.pricePerSqm}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setLocalValues({ ...localValues, [key]: val });
                      }}
                      onBlur={() => handleBlur(key)}
                      className="w-28 p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                    />
                  </td>
                  <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">✓ Active & Saved</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
