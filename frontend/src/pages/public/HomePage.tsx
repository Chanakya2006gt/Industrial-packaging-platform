import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Award, Sparkles, CheckCircle2, Activity, Layers } from 'lucide-react';
import { useCorporateMotion } from '../../lib/motion';

export const HomePage: React.FC = () => {
  useCorporateMotion();

  return (
    <div className="space-y-24 pb-24 font-sans">
      
      {/* 1. HERO SECTION WITH RESTORED PRECISION FLEET TELEMETRY CARD ON THE RIGHT */}
      <section className="relative pt-8 sm:pt-12 pb-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs font-mono font-bold text-[#E00019] dark:text-rose-400">
                <span className="w-2 h-2 rounded-full bg-[#E00019] animate-ping"></span>
                <span>24/7 INDUSTRIAL CONVERTING & OFFSET PRESS</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 dark:text-white tracking-tighter leading-[1.08]">
                Custom Labels & Packaging <br />
                <span className="text-[#E00019]">Engineered for Your Brand.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                From waterproof beverage bottle labels and pharmaceutical cartons to heavy-duty FMCG packaging and commercial catalogues. Manufactured with European precision press machinery.
              </p>

              {/* Nested Button-in-Button CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/configurator" className="btn-pill btn-pill-primary text-sm shadow-lg">
                  <span>Configure Your B2B Quote</span>
                  <span className="btn-pill-icon">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>

                <Link to="/contact#sample-kit" className="btn-pill btn-pill-outline text-sm">
                  <span>Request Physical Sample Kit</span>
                  <span className="btn-pill-icon">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>

              {/* Industrial Sectors Strip */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-800 dark:text-slate-200">Industrial Sectors:</span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">Beverage Bottlers</span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">Pharma & Healthcare</span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">Edible Oils & Foods</span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">Chemical & Industrial</span>
              </div>

              {/* Trust Seals Strip (Lucide Icons, No Emojis) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5 text-xs font-mono">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">FINAT Certified</div>
                    <div className="text-[11px] text-slate-500">Automated roll feeding</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-mono">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Food & Pharma Safe</div>
                    <div className="text-[11px] text-slate-500">Low-migration UV inks</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-mono">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">24/7 Production</div>
                    <div className="text-[11px] text-slate-500">Continuous shifts</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-mono">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Industrial Grade</div>
                    <div className="text-[11px] text-slate-500">Modern facility</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column (5 cols) - THE ORIGINAL PRECISION FLEET TELEMETRY & INFRASTRUCTURE CARD */}
            <div className="lg:col-span-5">
              <div className="double-bezel bg-slate-100/90 dark:bg-slate-950/90 border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl">
                <div className="double-bezel-inner p-5 sm:p-6 bg-white dark:bg-[#090E1A] border-slate-200 dark:border-slate-800/80 space-y-5">
                  
                  {/* Console Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <div className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        Plant Fleet Telemetry
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                        Converting Facility • 8C Flexo + 6C Offset Litho
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>24/7 ACTIVE</span>
                    </div>
                  </div>

                  {/* 8-Deck Flexo Stations Swatches */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-2">
                      <span>Flexo Deck Configuration (8 Stations)</span>
                      <span className="text-cyan-600 dark:text-cyan-400">8 / 8 Online</span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                      {[
                        { code: 'C', name: 'Cyan', lightColor: 'text-sky-700', darkColor: 'dark:text-cyan-300', lightBg: 'bg-sky-50', darkBg: 'dark:bg-cyan-950/40', lightBorder: 'border-sky-200', darkBorder: 'dark:border-cyan-500/30' },
                        { code: 'M', name: 'Mag', lightColor: 'text-rose-700', darkColor: 'dark:text-rose-300', lightBg: 'bg-rose-50', darkBg: 'dark:bg-rose-950/40', lightBorder: 'border-rose-200', darkBorder: 'dark:border-rose-500/30' },
                        { code: 'Y', name: 'Yel', lightColor: 'text-amber-800', darkColor: 'dark:text-amber-300', lightBg: 'bg-amber-50', darkBg: 'dark:bg-amber-950/40', lightBorder: 'border-amber-200', darkBorder: 'dark:border-amber-500/30' },
                        { code: 'K', name: 'Black', lightColor: 'text-slate-900', darkColor: 'dark:text-slate-200', lightBg: 'bg-slate-100', darkBg: 'dark:bg-slate-800/60', lightBorder: 'border-slate-300', darkBorder: 'dark:border-slate-700' },
                        { code: 'S1', name: 'Spot 1', lightColor: 'text-blue-700', darkColor: 'dark:text-blue-300', lightBg: 'bg-blue-50', darkBg: 'dark:bg-blue-950/40', lightBorder: 'border-blue-200', darkBorder: 'dark:border-blue-500/30' },
                        { code: 'S2', name: 'Spot 2', lightColor: 'text-emerald-700', darkColor: 'dark:text-emerald-300', lightBg: 'bg-emerald-50', darkBg: 'dark:bg-emerald-950/40', lightBorder: 'border-emerald-200', darkBorder: 'dark:border-emerald-500/30' },
                        { code: 'FOIL', name: 'Gold', lightColor: 'text-amber-900', darkColor: 'dark:text-amber-200', lightBg: 'bg-amber-100/70', darkBg: 'dark:bg-amber-950/50', lightBorder: 'border-amber-300', darkBorder: 'dark:border-amber-500/40' },
                        { code: 'UV', name: 'Varnish', lightColor: 'text-rose-800', darkColor: 'dark:text-rose-200', lightBg: 'bg-rose-50', darkBg: 'dark:bg-rose-950/50', lightBorder: 'border-rose-200', darkBorder: 'dark:border-rose-500/40' },
                      ].map((deck) => (
                        <div key={deck.code} className={`p-2 rounded-lg border ${deck.lightBorder} ${deck.darkBorder} ${deck.lightBg} ${deck.darkBg} text-center font-mono shadow-sm`}>
                          <div className={`text-[11px] font-bold ${deck.lightColor} ${deck.darkColor}`}>{deck.code}</div>
                          <div className="text-[9px] text-slate-600 dark:text-slate-400 mt-0.5">{deck.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Precision Technical Spec Table */}
                  <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
                    <table className="w-full text-left">
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                          <td className="p-2.5">
                            <span className="tech-tag tech-tag-cyan text-[10px]">Flexo Labels</span>
                          </td>
                          <td className="p-2.5 text-slate-700 dark:text-slate-300 text-right text-[11px]">
                            Up to 8 Colours (UV Cured + Cold Foil)
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                          <td className="p-2.5">
                            <span className="tech-tag tech-tag-crimson text-[10px]">Packaging Boxes</span>
                          </td>
                          <td className="p-2.5 text-slate-700 dark:text-slate-300 text-right text-[11px]">
                            Heidelberg Speedmaster 6C (28.5" × 40")
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                          <td className="p-2.5">
                            <span className="tech-tag tech-tag-amber text-[10px]">Protective Coat</span>
                          </td>
                          <td className="p-2.5 text-slate-700 dark:text-slate-300 text-right text-[11px]">
                            Aqueous Dispersion, UV High-Gloss
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                          <td className="p-2.5">
                            <span className="tech-tag tech-tag-emerald text-[10px]">Roll Deliveries</span>
                          </td>
                          <td className="p-2.5 text-slate-700 dark:text-slate-300 text-right text-[11px]">
                            25mm, 40mm, 76mm (FINAT Dir 1–8)
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                          <td className="p-2.5">
                            <span className="tech-tag tech-tag-purple text-[10px]">Laser Pre-Press</span>
                          </td>
                          <td className="p-2.5 text-slate-700 dark:text-slate-300 text-right text-[11px]">
                            Heidelberg Suprasetter CTP Plates
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Telemetry Card Footer */}
                  <div className="flex items-center justify-between pt-2 text-xs font-mono">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      ISO 9001:2015 Standards Verified
                    </span>
                    <Link to="/services" className="text-[11px] font-bold text-[#E00019] hover:underline flex items-center gap-1">
                      <span>Full Specs</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. THREE MANUFACTURING CAPABILITIES (Machined Double-Bezel Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="max-w-2xl space-y-2">
          <div className="tech-tag tech-tag-crimson">MANUFACTURING PORTFOLIO</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Packaging & Print Solutions
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            Manufactured with European press machinery and dedicated engineering technical support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: 8C Flexo */}
          <div className="double-bezel">
            <div className="double-bezel-inner p-6 h-full flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="h-48 rounded-xl overflow-hidden relative bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <img src="/assets/img/press-flexo-8c.jpg" alt="8-Colour Flexo Labels" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 tech-tag tech-tag-cyan">8C UV FLEXO</span>
                </div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight">Waterproof Roll Labels</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Self-adhesive bottle & jar labels that stay firmly attached in cold refrigerators, ice buckets, and humid rooms without peeling or smudging.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-mono">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" /> Bottles, jars, squeeze tubes, & flexible pouches</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" /> Rotary gold & silver metallic foil accents</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" /> Machine-ready rolls for automated applicators</li>
                </ul>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <Link to="/services#flexo" className="text-xs font-mono font-bold text-primary hover:underline flex items-center gap-1">
                  <span>Explore Label Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Heidelberg 6C Cartons */}
          <div className="double-bezel">
            <div className="double-bezel-inner p-6 h-full flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="h-48 rounded-xl overflow-hidden relative bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <img src="/assets/img/cartons-packaging.jpg" alt="Heidelberg Folding Cartons" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 tech-tag tech-tag-crimson">HEIDELBERG 6C</span>
                </div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight">Custom Packaging Boxes</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Sturdy folding cartons manufactured from heavy boxboard to protect pharmaceutical medicine bottles, cosmetics, and retail merchandise.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-mono">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" /> Stiff folding boxboard (FBB 250–450gsm)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" /> Protective dispersion and UV surface coating</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" /> Precision die-cutting & auto-glued crash bottoms</li>
                </ul>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <Link to="/services#offset" className="text-xs font-mono font-bold text-primary hover:underline flex items-center gap-1">
                  <span>Explore Box Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Laser CTP Commercial Print */}
          <div className="double-bezel">
            <div className="double-bezel-inner p-6 h-full flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="h-48 rounded-xl overflow-hidden relative bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <img src="/assets/img/prepress-ctp.jpg" alt="Commercial Publishing" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 tech-tag tech-tag-purple">LASER CTP</span>
                </div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight">Reports, Books & Invoices</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Corporate annual reports, product catalogues, full-color posters, danglers, and multi-part carbonless NCR receipt & delivery books.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-mono">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" /> Stapled or book-bound (PUR perfect binding)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" /> High-definition litho imaging on art papers</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" /> Sequential numbering & security barcoding</li>
                </ul>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <Link to="/services#commercial" className="text-xs font-mono font-bold text-primary hover:underline flex items-center gap-1">
                  <span>Explore Print Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. FREE SAMPLE KIT LEAD CAPTURE CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="double-bezel shadow-xl">
          <div className="double-bezel-inner p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4">
                <div className="tech-tag tech-tag-amber">PHYSICAL PROOFING & SAMPLES</div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                  Request a Free Physical Sample Kit
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xl leading-relaxed font-sans">
                  Inspect genuine label adhesives on your containers and test boxboard calipers before placing volume orders. We dispatch swatch packs directly to your office.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link to="/contact#sample-kit" className="btn-pill btn-pill-primary text-xs font-bold">
                    <span>Order Swatch Kit</span>
                    <span className="btn-pill-icon">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                  <Link to="/gallery" className="text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white underline">
                    View Substrates Matrix →
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-56 lg:h-64 bg-slate-100 dark:bg-slate-900">
                <img src="/assets/img/hero-packaging.jpg" alt="Sample Kit Swatch Book" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 4. FOUR PRODUCTION STANDARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="max-w-2xl space-y-2">
          <div className="tech-tag tech-tag-emerald">MANUFACTURING STANDARDS</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            The Manufacturing Commitment
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            Reliable production capacity and strict quality management calibrated for industrial supply chains.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="double-bezel">
            <div className="double-bezel-inner p-6 space-y-2 h-full">
              <div className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">REGISTRATION 01</div>
              <h3 className="text-base font-bold text-slate-950 dark:text-white">Brand Color Accuracy</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Direct laser plate imaging ensures your brand colors match across production batches with strict registration tolerances.
              </p>
            </div>
          </div>

          <div className="double-bezel">
            <div className="double-bezel-inner p-6 space-y-2 h-full">
              <div className="text-xs font-mono font-bold text-sky-600 dark:text-cyan-400">AUTOMATION 02</div>
              <h3 className="text-base font-bold text-slate-950 dark:text-white">Applicator Compatibility</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Roll converting conforms strictly to FINAT standards, ensuring smooth feeding on automated bottling and packaging machinery.
              </p>
            </div>
          </div>

          <div className="double-bezel">
            <div className="double-bezel-inner p-6 space-y-2 h-full">
              <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">SECURITY 03</div>
              <h3 className="text-base font-bold text-slate-950 dark:text-white">Tamper-Evident Security</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Security seals that leave void patterns if unauthorized opening occurs, protecting pharmaceutical and FMCG products.
              </p>
            </div>
          </div>

          <div className="double-bezel">
            <div className="double-bezel-inner p-6 space-y-2 h-full">
              <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">CONTINUOUS 04</div>
              <h3 className="text-base font-bold text-slate-950 dark:text-white">24/7 Factory Output</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Continuous operations at our converting plant ensure strict delivery turnaround for seasonal FMCG production surges.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
