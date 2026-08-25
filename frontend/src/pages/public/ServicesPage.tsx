import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles, BookOpen, Layers } from 'lucide-react';
import { useCorporateMotion } from '../../lib/motion';

export const ServicesPage: React.FC = () => {
  useCorporateMotion();

  return (
    <div className="space-y-16 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Header Banner */}
      <section className="pt-10 text-center space-y-3 max-w-3xl mx-auto">
        <div className="tech-tag tech-tag-crimson">ENGINEERING SPECIFICATIONS</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-tight">
          Manufacturing Capabilities & Press Fleet
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Calibrated technical parameters for our 8-colour flexographic label lines, Heidelberg Speedmaster 6-colour litho press, and industrial bindery suites.
        </p>
      </section>

      {/* Main Spec Cards */}
      <section className="space-y-12">
        
        {/* Capability 1: Flexographic Roll Labels */}
        <div id="flexo" className="double-bezel">
          <div className="double-bezel-inner p-6 sm:p-10 space-y-8">
            <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden relative bg-slate-900 border border-slate-200 dark:border-slate-800">
              <img src="/assets/img/press-flexo-8c.jpg" alt="8-Colour High-Speed Flexographic UV Label Line" className="w-full h-full object-cover" />
              <span className="absolute top-4 left-4 tech-tag tech-tag-cyan">8-COLOUR UV FLEXO</span>
            </div>

            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="flex justify-center gap-2 flex-wrap">
                <span className="tech-tag tech-tag-cyan">8-COLOUR FLEXO</span>
                <span className="tech-tag tech-tag-cyan">UV CURED</span>
                <span className="tech-tag tech-tag-amber">COLD FOIL INLINE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                Waterproof & High-Speed Roll Labels
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Engineered for continuous, high-speed rotary application across beverage bottling, edible oils, lubricants, and pharmaceutical packaging lines.
              </p>
              <div className="pt-2">
                <Link to="/configurator" className="btn-pill btn-pill-primary text-xs font-bold">
                  <span>Configure Label Quote</span>
                  <span className="btn-pill-icon"><ArrowRight className="w-3.5 h-3.5" /></span>
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  <tr>
                    <th className="p-4">Technical Parameter</th>
                    <th className="p-4">Standard Capability</th>
                    <th className="p-4">Application Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr>
                    <td className="p-4 font-bold">Colour Stations</td>
                    <td className="p-4 font-mono text-cyan-600 dark:text-cyan-400 font-semibold">Up to 8 Colours (UV Curing)</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">Process CMYK + up to 4 Pantone spot colors</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Inline Embellishment</td>
                    <td className="p-4 font-mono text-amber-600 dark:text-amber-400 font-semibold">Rotary Cold Foil (Gold/Silver)</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">High-speed metallic accents without expensive dies</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Substrate Versatility</td>
                    <td className="p-4 font-mono">BOPP (White/Clear/Silver), Semi-Gloss, Thermal</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">Moisture-proof, freeze-grade, and chemical-resistant adhesives</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Roll Delivery Standards</td>
                    <td className="p-4 font-mono">FINAT Unwinds 1–8 • Cores: 25mm, 38mm, 76mm (3")</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">Guaranteed feed compatibility on automated labeling machinery</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Typical Turnaround</td>
                    <td className="p-4 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">3 to 5 Working Days</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">24/7 continuous plant shift scheduling</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Capability 2: Heidelberg 6C Offset */}
        <div id="offset" className="double-bezel">
          <div className="double-bezel-inner p-6 sm:p-10 space-y-8">
            <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden relative bg-slate-900 border border-slate-200 dark:border-slate-800">
              <img src="/assets/img/press-heidelberg-6c.jpg" alt="Heidelberg Speedmaster 6C" className="w-full h-full object-cover" />
              <span className="absolute top-4 left-4 tech-tag tech-tag-crimson">HEIDELBERG SPEEDMASTER 6C</span>
            </div>

            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="flex justify-center gap-2 flex-wrap">
                <span className="tech-tag tech-tag-crimson">HEIDELBERG SPEEDMASTER</span>
                <span className="tech-tag tech-tag-crimson">6-COLOUR LITHO</span>
                <span className="tech-tag tech-tag-amber">INLINE COATING</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                Heidelberg Custom Packaging Boxes
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Large-format sheet-fed lithography on heavyweight folding boxboards and solid bleached boards with inline single-pass protective coatings.
              </p>
              <div className="pt-2">
                <Link to="/configurator" className="btn-pill btn-pill-primary text-xs font-bold">
                  <span>Configure Box Quote</span>
                  <span className="btn-pill-icon"><ArrowRight className="w-3.5 h-3.5" /></span>
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  <tr>
                    <th className="p-4">Technical Parameter</th>
                    <th className="p-4">Standard Capability</th>
                    <th className="p-4">Application Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr>
                    <td className="p-4 font-bold">Print Format & Stations</td>
                    <td className="p-4 font-mono text-rose-600 dark:text-rose-400 font-semibold">Up to 6 Colours + Inline Coating</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">Maximum sheet dimension: 28.5" × 40" (720mm × 1020mm)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Substrate Range</td>
                    <td className="p-4 font-mono">FBB (250–450 gsm), SBB/GZ, Kraft Board, WLC</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">Food-contact approved, pharma caliper control</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Surface Protection</td>
                    <td className="p-4 font-mono text-amber-600 dark:text-amber-400 font-semibold">Inline Dispersion / Aqueous / UV Gloss</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">Abrasion resistance against shipping vibration scuffing</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Post-Press Converting</td>
                    <td className="p-4 font-mono">Platen Die-Cutting & Auto-Gluing</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">Crash-lock bottoms, reverse tuck-ends, hanging tabs</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Typical Turnaround</td>
                    <td className="p-4 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">4 to 7 Working Days</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">Rapid die tooling available for standard cartons</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Capability 3: Finishing & Embellishment Suite */}
        <div id="finishing" className="double-bezel">
          <div className="double-bezel-inner p-6 sm:p-10 space-y-8">
            <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden relative bg-slate-900 border border-slate-200 dark:border-slate-800">
              <img src="/assets/img/mockups/bottle_studio.jpg" alt="Rotary Cold Foil & UV Varnish Finishes" className="w-full h-full object-cover" />
              <span className="absolute top-4 left-4 tech-tag tech-tag-amber">FOIL & EMBELLISHMENT</span>
            </div>

            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="flex justify-center gap-2 flex-wrap">
                <span className="tech-tag tech-tag-amber">ROTARY COLD FOIL</span>
                <span className="tech-tag tech-tag-amber">SPOT UV VARNISH</span>
                <span className="tech-tag tech-tag-emerald">MULTI-LEVEL EMBOSS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                High-End Finishes & Embellishments
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Precision optical finishes including metallic cold foils, tactile soft-touch laminations, and security micro-embossing for premium retail products.
              </p>
              <div className="pt-2">
                <Link to="/contact" className="btn-pill btn-pill-primary text-xs font-bold">
                  <span>Request Finish Samples</span>
                  <span className="btn-pill-icon"><ArrowRight className="w-3.5 h-3.5" /></span>
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  <tr>
                    <th className="p-4">Finishing Process</th>
                    <th className="p-4">Technical Specification</th>
                    <th className="p-4">Ideal Applications</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr>
                    <td className="p-4 font-bold">Inline Rotary Cold Foil</td>
                    <td className="p-4 font-mono text-amber-600 dark:text-amber-400 font-semibold">Metallic Gold, Silver, Holographic</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">Spirits, luxury cosmetics, premium confectionary</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Selective Spot UV Varnish</td>
                    <td className="p-4 font-mono">High-Gloss 3D Raised or Matte Contrast</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">Logo accents, water drop effects, texture contrast</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Multi-Level Embossing</td>
                    <td className="p-4 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Blind Emboss, Deboss, Micro-Texture</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">Pharma braille, anti-counterfeit stamps, luxury cartons</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Precision Platen Die-Cut</td>
                    <td className="p-4 font-mono">Custom Steel Dies ±0.1mm Calibrated</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">Intricate cut-outs, tear strips, perforated coupons</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Capability 4: Commercial Print & Annual Reports */}
        <div id="commercial" className="double-bezel">
          <div className="double-bezel-inner p-6 sm:p-10 space-y-8">
            <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden relative bg-slate-900 border border-slate-200 dark:border-slate-800">
              <img src="/assets/img/prepress-ctp.jpg" alt="Laser CTP Commercial Printing Suite" className="w-full h-full object-cover" />
              <span className="absolute top-4 left-4 tech-tag tech-tag-cyan">COMMERCIAL & BINDERY</span>
            </div>

            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="flex justify-center gap-2 flex-wrap">
                <span className="tech-tag tech-tag-cyan">ANNUAL REPORTS</span>
                <span className="tech-tag tech-tag-cyan">PERFECT BINDING</span>
                <span className="tech-tag tech-tag-crimson">SECURITY PRINT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                Corporate Commercial Print & Publications
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                High-volume commercial printing including corporate annual reports, financial publications, saddle-stitched booklets, and corporate marketing literature.
              </p>
              <div className="pt-2">
                <Link to="/contact" className="btn-pill btn-pill-primary text-xs font-bold">
                  <span>Inquire for Commercial Run</span>
                  <span className="btn-pill-icon"><ArrowRight className="w-3.5 h-3.5" /></span>
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  <tr>
                    <th className="p-4">Product Line</th>
                    <th className="p-4">Bindery & Finishing Options</th>
                    <th className="p-4">Capacity & Turnaround</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr>
                    <td className="p-4 font-bold">Corporate Annual Reports</td>
                    <td className="p-4 font-mono text-cyan-600 dark:text-cyan-400 font-semibold">PUR Perfect Bound, Thread-Sewn, Matt Laminated Covers</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">Up to 25,000 copies in 5–7 working days</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Product Catalogues & Booklets</td>
                    <td className="p-4 font-mono">Saddle-Stitched, Loop Stitched, Wire-O Binding</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">High-speed automated Muller Martini folding & stitching</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Security Documents & Vouchers</td>
                    <td className="p-4 font-mono text-rose-600 dark:text-rose-400 font-semibold">Sequential Numbering, UV Invisible Inks, Hologram Seals</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">Controlled production area with serial reconciliation</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Corporate Stationeries</td>
                    <td className="p-4 font-mono">Letterheads, Multi-Part NCR Forms, Envelopes</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">Standard 48-hour rapid dispatch nationwide</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};
