import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shield, Factory, Cpu, Layers } from 'lucide-react';
import { useCorporateMotion } from '../../lib/motion';

export const AboutPage: React.FC = () => {
  useCorporateMotion();

  return (
    <div className="space-y-20 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Header Banner */}
      <section className="pt-10 text-center space-y-3 max-w-3xl mx-auto">
        <div className="tech-tag tech-tag-crimson">24/7 LUSAKA INDUSTRIAL CONVERTING</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-tight">
          Your Local Packaging Manufacturing Partner
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Located in Lusaka's Light Industrial Area, PrintFast Zambia Limited operates 24/7 continuous shifts to manufacture custom roll labels, product cartons, and commercial collateral with Swiss-grade precision.
        </p>
      </section>

      {/* Manufacturing Pillars Double-Bezel Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* Production & Shift Scheduling Card */}
        <div className="double-bezel">
          <div className="double-bezel-inner p-8 h-full flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight">Production & Shift Capacity</h3>
                <span className="tech-tag tech-tag-cyan">24/7 PRESSES</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Our round-the-clock 24/7 manufacturing schedule ensures that whether you require 10,000 self-adhesive beverage labels or 500,000 pharmaceutical cartons, your production moves smoothly from laser CTP pre-press straight to your delivery dock.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                We operate continuous quality checks with spectrophotometer delta-E monitoring to guarantee batch-to-batch repeatability and exact corporate color matches.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/configurator" className="btn-pill btn-pill-primary text-xs font-bold">
                <span>Start a Quote</span>
                <span className="btn-pill-icon"><ArrowRight className="w-3.5 h-3.5" /></span>
              </Link>
              <Link to="/services" className="btn-pill btn-pill-outline text-xs font-bold">
                <span>Review Equipment Fleet</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Facility Infrastructure Card */}
        <div className="double-bezel">
          <div className="double-bezel-inner p-8 h-full flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight">Facility Infrastructure</h3>
              <span className="tech-tag tech-tag-emerald">24/7 ACTIVE</span>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <span className="tech-tag tech-tag-neutral shrink-0 min-w-[75px] text-center">PLANT</span>
                <span>Plot 35288 Mwembeshi Road, Light Industrial Area, Lusaka.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="tech-tag tech-tag-cyan shrink-0 min-w-[75px] text-center">FLEXO</span>
                <span>8-colour UV flexographic converting lines with inline cold foil stamping & FINAT 1–8 slitting.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="tech-tag tech-tag-crimson shrink-0 min-w-[75px] text-center">OFFSET</span>
                <span>Heidelberg Speedmaster 6-colour litho + inline aqueous/UV coating (up to 28.5" × 40").</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="tech-tag tech-tag-purple shrink-0 min-w-[75px] text-center">PREPRESS</span>
                <span>Direct laser Computer-to-Plate (CTP) imaging with automated RIP colour calibration.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="tech-tag tech-tag-amber shrink-0 min-w-[75px] text-center">FINISH</span>
                <span>Platen die-cutting, embossing, UV flood, folding-gluing, and PUR binding suites.</span>
              </li>
            </ul>
          </div>
        </div>

      </section>

      {/* 4-Stage Production Protocol */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="tech-tag tech-tag-purple">QUALITY ASSURANCE</div>
          <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            The Four-Stage Production Protocol
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Every production run follows calibrated ISO-aligned verification checkpoints.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="double-bezel">
            <div className="double-bezel-inner overflow-hidden flex flex-col items-center text-center">
              <div className="h-40 w-full overflow-hidden bg-slate-900 relative">
                <img src="/assets/img/prepress-ctp.jpg" alt="CTP Laser Platesetter" className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 tech-tag tech-tag-purple text-[10px]">STAGE 01</span>
              </div>
              <div className="p-5 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Pre-Press Verification</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Dieline inspection, bleed validation, and laser CTP plate exposure for razor-sharp micro-registration.
                </p>
              </div>
            </div>
          </div>

          <div className="double-bezel">
            <div className="double-bezel-inner overflow-hidden flex flex-col items-center text-center">
              <div className="h-40 w-full overflow-hidden bg-slate-900 relative">
                <img src="/assets/img/press-flexo-8c.jpg" alt="8C UV Flexo Press" className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 tech-tag tech-tag-cyan text-[10px]">STAGE 02</span>
              </div>
              <div className="p-5 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">High-Speed Press Run</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Continuous press monitoring for exact ink density, color consistency, and registration accuracy.
                </p>
              </div>
            </div>
          </div>

          <div className="double-bezel">
            <div className="double-bezel-inner overflow-hidden flex flex-col items-center text-center">
              <div className="h-40 w-full overflow-hidden bg-slate-900 relative">
                <img src="/assets/img/press-heidelberg-6c.jpg" alt="Heidelberg 6C Press" className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 tech-tag tech-tag-crimson text-[10px]">STAGE 03</span>
              </div>
              <div className="p-5 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Finishing & Embellishment</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Rotary cold foiling, protective UV varnishing, die-cutting, embossing, and automated folding-gluing.
                </p>
              </div>
            </div>
          </div>

          <div className="double-bezel">
            <div className="double-bezel-inner overflow-hidden flex flex-col items-center text-center">
              <div className="h-40 w-full overflow-hidden bg-slate-900 relative">
                <img src="/assets/img/cartons-packaging.jpg" alt="Final Quality Check" className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 tech-tag tech-tag-emerald text-[10px]">STAGE 04</span>
              </div>
              <div className="p-5 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Inspection & Dispatch</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  FINAT rewind verification, core inspection, protective moisture packaging, and plant dispatch.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
