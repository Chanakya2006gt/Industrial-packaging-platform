import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageSquare, CheckCircle, Send, Package, ArrowRight, AlertCircle, Navigation } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useCorporateMotion } from '../../lib/motion';

export const ContactPage: React.FC = () => {
  useCorporateMotion();

  // Inquiry Form State
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryCompany, setInquiryCompany] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [inquiryError, setInquiryError] = useState<string | null>(null);

  // Sample Kit Form State
  const [sampleCompany, setSampleCompany] = useState('');
  const [sampleContact, setSampleContact] = useState('');
  const [sampleEmail, setSampleEmail] = useState('');
  const [samplePhone, setSamplePhone] = useState('');
  const [sampleAddress, setSampleAddress] = useState('');
  const [sampleCategories, setSampleCategories] = useState<string[]>(['Waterproof BOPP Labels (White & Clear)']);
  const [sampleStatus, setSampleStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [sampleError, setSampleError] = useState<string | null>(null);
  const [sampleRef, setSampleRef] = useState('');

  // 1. Real Fail-Closed General Inquiry Write
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryStatus('submitting');
    setInquiryError(null);
    const refNo = `INQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const { error } = await supabase.from('rfq_inquiries').insert([
        {
          reference_no: refNo,
          company_name: inquiryCompany.trim() || inquiryName.trim(),
          contact_name: inquiryName.trim(),
          email: inquiryEmail.trim(),
          phone: inquiryPhone.trim(),
          industry: 'Commercial Inquiry',
          category: 'general_inquiry',
          substrate: 'General Print',
          dimensions_mm: 'Custom',
          quantity: 1,
          roll_or_sheet: 'sheet',
          notes: inquiryMsg,
          status: 'pending'
        }
      ]);

      if (error) {
        setInquiryError(`Unable to transmit message: ${error.message}`);
        setInquiryStatus('idle');
        return;
      }

      setInquiryStatus('success');
    } catch (err: any) {
      setInquiryError(`Network error: ${err.message || 'Transmission failed'}`);
      setInquiryStatus('idle');
    }
  };

  // 2. Real Fail-Closed Physical Sample Kit Submission
  const handleSampleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSampleStatus('submitting');
    setSampleError(null);
    const refNo = `SMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const { error } = await supabase.from('sample_kit_requests').insert([
        {
          reference_no: refNo,
          company_name: sampleCompany.trim(),
          contact_name: sampleContact.trim(),
          email: sampleEmail.trim(),
          phone: samplePhone.trim(),
          sample_categories: sampleCategories,
          delivery_address: sampleAddress.trim(),
          status: 'pending'
        }
      ]);

      if (error) {
        setSampleError(`Unable to register sample request: ${error.message}`);
        setSampleStatus('idle');
        return;
      }

      setSampleRef(refNo);
      setSampleStatus('success');
    } catch (err: any) {
      setSampleError(`Network error: ${err.message || 'Request failed'}`);
      setSampleStatus('idle');
    }
  };

  const toggleSampleCat = (cat: string) => {
    if (sampleCategories.includes(cat)) {
      setSampleCategories(sampleCategories.filter(c => c !== cat));
    } else {
      setSampleCategories([...sampleCategories, cat]);
    }
  };

  return (
    <div className="space-y-16 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Header Banner */}
      <section className="pt-10 text-center space-y-3 max-w-3xl mx-auto">
        <div className="tech-tag tech-tag-crimson">MWEMBESHI ROAD PLANT & ESTIMATING DESK</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-tight">
          Contact Plant Estimating & Logistics
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Speak directly with our technical team in Lusaka, request a physical sample kit, or schedule a plant inspection at our Mwembeshi Road facility.
        </p>
      </section>

      {/* Grid: Plant Info + General Inquiries */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* Plant Details Double-Bezel */}
        <div className="double-bezel">
          <div className="double-bezel-inner p-8 h-full flex flex-col justify-between space-y-6 bg-white dark:bg-slate-900">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight">Lusaka Facility Details</h3>
                <span className="tech-tag tech-tag-emerald">24/7 OPEN</span>
              </div>
              
              <div className="space-y-4 text-sm font-sans">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Physical Plant Facility</strong>
                    <span className="text-slate-600 dark:text-slate-400 font-mono text-xs">
                      Plot 35288 Mwembeshi Road, Light Industrial Area, Lusaka, Zambia
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Direct Estimating Line</strong>
                    <a href="tel:+260974423496" className="text-slate-600 dark:text-slate-400 font-mono text-xs hover:text-cyan-500">
                      +260 974 423 496
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <MessageSquare className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white">WhatsApp Plant Dispatch</strong>
                    <a href="https://wa.me/260974423496" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 font-mono text-xs hover:underline">
                      +260 974 423 496 (Click to Chat)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Mail className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Estimating & Inquiries Email</strong>
                    <a href="mailto:sales@printfastzambia.com" className="text-slate-600 dark:text-slate-400 font-mono text-xs hover:text-amber-500">
                      sales@printfastzambia.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Production Shift Schedule
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
                Press lines operate continuously in three 8-hour industrial rotations. Walk-in technical consultations and CAD proofing reviews welcome Monday – Friday, 08:00 – 17:00 CAT.
              </p>
            </div>
          </div>
        </div>

        {/* General Inquiry Form */}
        <div className="double-bezel">
          <div className="double-bezel-inner p-8 space-y-6 bg-white dark:bg-slate-900">
            <div>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight">Direct Message to Plant Team</h3>
              <p className="text-xs text-slate-500 mt-1">General inquiries, commercial printing runs, and tender specifications.</p>
            </div>

            {inquiryStatus === 'success' ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="font-extrabold text-slate-950 dark:text-white text-base">Message Transmitted to Estimating Desk</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                  Your inquiry has been logged in our manufacturing ledger. An estimator will reply via email or phone within 4 business hours.
                </p>
                <button
                  onClick={() => setInquiryStatus('idle')}
                  className="btn-pill btn-pill-outline text-xs mt-2"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs font-mono">
                {inquiryError && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{inquiryError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                      placeholder="e.g. Kondwani Phiri"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Company Name</label>
                    <input
                      type="text"
                      value={inquiryCompany}
                      onChange={(e) => setInquiryCompany(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                      placeholder="e.g. Lusaka Agro Ltd"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                      placeholder="procurement@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Phone Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                      placeholder="+260 97X XXX XXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Project Details / Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={inquiryMsg}
                    onChange={(e) => setInquiryMsg(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    placeholder="Describe your packaging volumes, dieline requirements, or commercial print timeline..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={inquiryStatus === 'submitting'}
                  className="btn-pill btn-pill-primary text-xs w-full justify-center shadow-lg"
                >
                  <span>{inquiryStatus === 'submitting' ? 'Logging in Plant Queue...' : 'Transmit Message to Estimators'}</span>
                  <span className="btn-pill-icon"><Send className="w-3.5 h-3.5" /></span>
                </button>
              </form>
            )}

          </div>
        </div>

      </section>

      {/* Interactive Plant Map & Directions Section */}
      <section id="plant-map" className="double-bezel">
        <div className="double-bezel-inner p-8 space-y-6 bg-white dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 text-rose-500 font-mono text-xs font-bold mb-1">
                <Navigation className="w-3.5 h-3.5" />
                <span>GEOGRAPHIC PLANT LOCATION</span>
              </div>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight">
                Plot 35288 Mwembeshi Road, Light Industrial Area, Lusaka
              </h3>
              <p className="text-xs text-slate-500">Easily accessible via Lumumba Road and Mungwi Road freight corridors.</p>
            </div>
            <a
              href="https://maps.google.com/?q=Mwembeshi+Road+Lusaka+Zambia"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill btn-pill-outline text-xs font-mono font-bold shrink-0"
            >
              <span>Open in Google Maps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="h-72 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 relative flex items-center justify-center text-center p-6">
            <iframe
              title="PrintFast Zambia Facility Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15383.504936387087!2d28.2536838!3d-15.4216892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1940f368097b6933%3A0xb36ef2799c85fae4!2sMwembeshi%20Rd%2C%20Lusaka%2C%20Zambia!5e0!3m2!1sen!2szm!4v1700000000000!5m2!1sen!2szm"
              className="w-full h-full border-0 absolute inset-0 opacity-80 filter grayscale contrast-125"
              loading="lazy"
            />
            <div className="relative z-10 bg-slate-950/90 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white max-w-sm">
              <div className="w-3 h-3 rounded-full bg-[#E00019] mx-auto mb-2 animate-ping" />
              <strong className="block text-xs font-mono">PRINTFAST ZAMBIA LIMITED</strong>
              <span className="text-[11px] text-slate-300">Plot 35288 Mwembeshi Road • 24/7 Security Gate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Physical Sample Swatch Kit Request */}
      <section id="sample-kit" className="double-bezel">
        <div className="double-bezel-inner p-8 sm:p-12 space-y-8 bg-white dark:bg-slate-900 text-slate-950 dark:text-white">
          
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold">
              <Package className="w-4 h-4" />
              <span>COMPLIMENTARY B2B SWATCH COMPENDIUM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              Request Physical Sample Kit (Delivered to Your Office)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Test substrate calipers, adhesive aggression, rotary cold foil reflectances, and food-grade barrier coatings on your actual containers before ordering.
            </p>
          </div>

          {sampleStatus === 'success' ? (
            <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="tech-tag tech-tag-emerald text-xs">DISPATCH REGISTERED</span>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">Sample Swatch Pack Queued for Dispatch</h3>
                <p className="text-xs font-mono text-slate-600 dark:text-slate-400">
                  Tracking Reference: <strong className="text-amber-600 dark:text-amber-400">{sampleRef}</strong>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto pt-2">
                  Our Lusaka delivery courier will deliver the curated sample box to <span className="text-slate-950 dark:text-white font-bold">{sampleAddress}</span> within 24–48 hours.
                </p>
              </div>
              <button
                onClick={() => {
                  setSampleStatus('idle');
                  setSampleCompany('');
                }}
                className="btn-pill btn-pill-outline text-xs text-slate-900 dark:text-white border-slate-300 dark:border-slate-700"
              >
                Request Another Kit
              </button>
            </div>
          ) : (
            <form onSubmit={handleSampleSubmit} className="space-y-6 text-xs font-mono">
              {sampleError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{sampleError}</span>
                </div>
              )}

              {/* Swatch Selection Grid */}
              <div className="space-y-2">
                <label className="block text-slate-700 dark:text-slate-300 font-bold">Select Substrate Samples Required:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    'Waterproof BOPP Labels (White & Clear)',
                    'Metallic Foil & Holographic Labels',
                    'Pharmaceutical Folding Cartons (FBB/SBB)',
                    'Food-Grade Greaseproof Packaging',
                    'Soft-Touch & Raised UV Samples',
                    'Direct Thermal & Barcode Logistics Rolls'
                  ].map(cat => {
                    const isChecked = sampleCategories.includes(cat);
                    return (
                      <div
                        key={cat}
                        onClick={() => toggleSampleCat(cat)}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                          isChecked
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${isChecked ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-400 dark:border-slate-600'}`}>
                          {isChecked && '✓'}
                        </div>
                        <span className="text-[11px] leading-tight">{cat}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Company / Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={sampleCompany}
                    onChange={(e) => setSampleCompany(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    placeholder="e.g. Lusaka Bottlers Ltd"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Attention Person *</label>
                  <input
                    type="text"
                    required
                    value={sampleContact}
                    onChange={(e) => setSampleContact(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    placeholder="e.g. Kondwani Banda"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={sampleEmail}
                    onChange={(e) => setSampleEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    placeholder="kondwani@company.com"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Courier Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={samplePhone}
                    onChange={(e) => setSamplePhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    placeholder="+260 97X XXX XXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Office Delivery Address (Lusaka & Nationwide) *</label>
                <input
                  type="text"
                  required
                  value={sampleAddress}
                  onChange={(e) => setSampleAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  placeholder="e.g. Stand 1045, Great East Road, Rhodes Park, Lusaka"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={sampleStatus === 'submitting'}
                  className="btn-pill btn-pill-primary text-xs font-bold"
                >
                  <span>{sampleStatus === 'submitting' ? 'Registering Dispatch...' : 'Dispatch Sample Kit to Office'}</span>
                  <span className="btn-pill-icon"><ArrowRight className="w-3.5 h-3.5" /></span>
                </button>
              </div>
            </form>
          )}

        </div>
      </section>

    </div>
  );
};
