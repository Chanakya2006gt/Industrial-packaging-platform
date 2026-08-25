import React from 'react';
import { ArrowRight, Check, Upload, CheckCircle2 } from 'lucide-react';

interface ConfiguratorStepsProps {
  currentStep: number;
  setCurrentStep: (s: number) => void;
  category: string;
  setCategory: (c: string) => void;
  widthMm: number;
  setWidthMm: (w: number) => void;
  heightMm: number;
  setHeightMm: (h: number) => void;
  quantity: number;
  setQuantity: (q: number) => void;
  substrate: string;
  setSubstrate: (s: string) => void;
  substratesList: { id: string; name: string; badge: string; desc: string }[];
  applicationMethod: 'hand' | 'machine';
  setApplicationMethod: (m: 'hand' | 'machine') => void;
  rollOrSheet: 'roll' | 'sheet';
  setRollOrSheet: (r: 'roll' | 'sheet') => void;
  coreMm: number;
  setCoreMm: (c: number) => void;
  finatDirection: number;
  setFinatDirection: (f: number) => void;
  embellishments: string[];
  toggleEmbellishment: (e: string) => void;
  companyName: string;
  setCompanyName: (c: string) => void;
  contactName: string;
  setContactName: (c: string) => void;
  email: string;
  setEmail: (e: string) => void;
  phone: string;
  setPhone: (p: string) => void;
  industry: string;
  setIndustry: (i: string) => void;
  notes: string;
  setNotes: (n: string) => void;
  artworkFile: File | null;
  handleArtworkFileChange: (f: File | null) => Promise<void>;
  submitting: boolean;
  submitError: string | null;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const ConfiguratorSteps: React.FC<ConfiguratorStepsProps> = ({
  currentStep,
  setCurrentStep,
  category,
  setCategory,
  widthMm,
  setWidthMm,
  heightMm,
  setHeightMm,
  quantity,
  setQuantity,
  substrate,
  setSubstrate,
  substratesList,
  applicationMethod,
  setApplicationMethod,
  rollOrSheet,
  setRollOrSheet,
  coreMm,
  setCoreMm,
  embellishments,
  toggleEmbellishment,
  companyName,
  setCompanyName,
  contactName,
  setContactName,
  email,
  setEmail,
  phone,
  setPhone,
  industry,
  setIndustry,
  notes,
  setNotes,
  artworkFile,
  handleArtworkFileChange,
  submitting,
  submitError,
  onSubmit
}) => {
  return (
    <div className="double-bezel">
      <div className="double-bezel-inner p-6 space-y-6 bg-white dark:bg-slate-900">
        
        {/* Step Indicator Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-mono">
          {[
            { step: 1, title: 'Dimensions & Volume' },
            { step: 2, title: 'Substrate Material' },
            { step: 3, title: 'Applicator & Winding' },
            { step: 4, title: 'Protective Finishes' },
            { step: 5, title: 'Submit RFQ' }
          ].map(s => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                currentStep === s.step
                  ? 'bg-[#E00019] text-white shadow-sm'
                  : currentStep > s.step
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              <span>{s.step}. {s.title}</span>
              {currentStep > s.step && <Check className="w-3 h-3" />}
            </button>
          ))}
        </div>

        {/* STEP 1: DIMENSIONS & VOLUME */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight">Step 1: Container Dimensions & Order Volume</h3>
              <p className="text-xs text-slate-500 mt-1">Specify width and height in millimeters, plus your required batch volume.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Width (mm)</label>
                <input
                  type="number"
                  value={widthMm}
                  onChange={(e) => setWidthMm(Math.max(10, Number(e.target.value)))}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Height (mm)</label>
                <input
                  type="number"
                  value={heightMm}
                  onChange={(e) => setHeightMm(Math.max(10, Number(e.target.value)))}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Batch Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  step={5000}
                  onChange={(e) => setQuantity(Math.max(1000, Number(e.target.value)))}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setCurrentStep(2)} className="btn-pill btn-pill-primary text-xs">
                <span>Next: Choose Substrate</span>
                <span className="btn-pill-icon"><ArrowRight className="w-3.5 h-3.5" /></span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SUBSTRATE MATERIAL */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight">Step 2: Substrate & Subsurface Material</h3>
              <p className="text-xs text-slate-500 mt-1">Select from food-grade BOPP films or pharmaceutical folding boxboards.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {substratesList.map(s => (
                <div
                  key={s.id}
                  onClick={() => setSubstrate(s.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    substrate === s.id
                      ? 'border-[#E00019] bg-rose-50/60 dark:bg-rose-950/30 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <strong className="font-bold text-sm text-slate-950 dark:text-white">{s.name}</strong>
                    <span className="tech-tag tech-tag-crimson text-[9px]">{s.badge}</span>
                  </div>
                  <p className="text-xs text-slate-500">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setCurrentStep(1)} className="btn-pill btn-pill-outline text-xs">
                <span>Back</span>
              </button>
              <button onClick={() => setCurrentStep(3)} className="btn-pill btn-pill-primary text-xs">
                <span>Next: Application & Roll Details</span>
                <span className="btn-pill-icon"><ArrowRight className="w-3.5 h-3.5" /></span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: APPLICATION METHOD & ROLL FORMAT */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight">Step 3: Application Method & Roll Orientation</h3>
              <p className="text-xs text-slate-500 mt-1">Choose whether labels will be peeled by hand or fed into an automated labeling machine.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => {
                  setApplicationMethod('hand');
                  setRollOrSheet('roll');
                }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  applicationMethod === 'hand'
                    ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-sm text-slate-950 dark:text-white">Manual Hand Application</h4>
                  <span className="tech-tag tech-tag-emerald text-[9px]">ANY DIRECTION</span>
                </div>
                <p className="text-xs text-slate-500">For manual labeling by factory workers or tabletop dispensers.</p>
              </div>

              <div
                onClick={() => {
                  setApplicationMethod('machine');
                  setRollOrSheet('roll');
                }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  applicationMethod === 'machine'
                    ? 'border-[#E00019] bg-rose-50/40 dark:bg-rose-950/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-sm text-slate-950 dark:text-white">Automatic Rotary Machine Applicator</h4>
                  <span className="tech-tag tech-tag-crimson text-[9px]">FINAT 1–8</span>
                </div>
                <p className="text-xs text-slate-500">For continuous rotary labeling conveyor lines (Krones, Pack Leader, etc.).</p>
              </div>
            </div>

            {/* Core Diameter Selection */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-2">Roll Core Diameter</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { mm: 76, inch: '3 Inch', desc: 'Standard High-Speed Press' },
                  { mm: 38, inch: '1.5 Inch', desc: 'Tabletop Dispensers' },
                  { mm: 25, inch: '1 Inch', desc: 'Handheld Gun Dispensers' }
                ].map(c => (
                  <button
                    key={c.mm}
                    type="button"
                    onClick={() => setCoreMm(c.mm)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      coreMm === c.mm
                        ? 'border-[#E00019] bg-rose-50/60 dark:bg-rose-950/30'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <strong className="font-mono text-sm block text-slate-900 dark:text-white">{c.mm}mm ({c.inch})</strong>
                    <span className="text-[10px] text-slate-500">{c.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setCurrentStep(2)} className="btn-pill btn-pill-outline text-xs">
                <span>Back</span>
              </button>
              <button onClick={() => setCurrentStep(4)} className="btn-pill btn-pill-primary text-xs">
                <span>Next: Finishes & Coatings</span>
                <span className="btn-pill-icon"><ArrowRight className="w-3.5 h-3.5" /></span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: EMBELLISHMENTS & COATINGS */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight">Step 4: Protective Coatings & Finishes</h3>
              <p className="text-xs text-slate-500 mt-1">Select protective varnishes and rotary cold foil accents.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {[
                { id: 'uv_varnish', label: 'High-Gloss Protective UV Varnish (Scuff Resistant)' },
                { id: 'matt_varnish', label: 'Matt Silky Soft-Touch Varnish' },
                { id: 'cold_foil_gold', label: 'Inline Rotary Cold Foil (Metallic Gold)' },
                { id: 'cold_foil_silver', label: 'Inline Rotary Cold Foil (Metallic Silver)' },
                { id: 'multi_level_emboss', label: 'Multi-Level Blind Embossing / Debossing' },
                { id: 'platen_diecut', label: 'Precision Platen Die-Cutting & Perforation' }
              ].map(emb => (
                <label
                  key={emb.id}
                  onClick={() => toggleEmbellishment(emb.id)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                    embellishments.includes(emb.id)
                      ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={embellishments.includes(emb.id)}
                    onChange={() => {}}
                    className="text-amber-600 rounded"
                  />
                  <span>{emb.label}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setCurrentStep(3)} className="btn-pill btn-pill-outline text-xs">
                <span>Back</span>
              </button>
              <button onClick={() => setCurrentStep(5)} className="btn-pill btn-pill-primary text-xs">
                <span>Next: Review & Contact Details</span>
                <span className="btn-pill-icon"><ArrowRight className="w-3.5 h-3.5" /></span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW, CONTACT & SUBMIT */}
        {currentStep === 5 && (
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight">Step 5: Review & Submit Manufacturing RFQ</h3>
              <p className="text-xs text-slate-500 mt-1">Provide your procurement contact details and optional vector artwork.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                  placeholder="e.g. Lusaka Bottlers Limited"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Person *</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                  placeholder="e.g. Kondwani Banda"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Official Work Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                  placeholder="procurement@company.com"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                  placeholder="+260 97X XXX XXX"
                />
              </div>
            </div>

            {/* Error Banner */}
            {submitError && (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-xs font-mono text-rose-300">
                <strong>⚠️ Submission Error:</strong> {submitError}
              </div>
            )}

            {/* CAD Dieline / Artwork Upload */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Upload CAD Dieline / Vector Artwork (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-slate-400 transition-colors">
                <input
                  type="file"
                  id="dielineUpload"
                  onChange={(e) => handleArtworkFileChange(e.target.files ? e.target.files[0] : null)}
                  className="hidden"
                  accept=".pdf,.ai,.eps,.svg,.png,.jpg,.jpeg,.zip"
                />
                <label htmlFor="dielineUpload" className="cursor-pointer space-y-1 block">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                    {artworkFile ? (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{artworkFile.name} ({(artworkFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    ) : (
                      <span>Click to browse vector file (.pdf, .ai, .eps, .svg, .zip - up to 25MB)</span>
                    )}
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="btn-pill btn-pill-outline text-xs"
              >
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-pill btn-pill-primary text-sm shadow-xl"
              >
                <span>{submitting ? 'Dispatching to Estimators...' : 'Submit Manufacturing RFQ'}</span>
                <span className="btn-pill-icon"><ArrowRight className="w-4 h-4" /></span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
