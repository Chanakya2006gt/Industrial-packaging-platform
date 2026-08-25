import React, { useState } from 'react';
import { 
  CheckCircle2, ArrowRight, ShieldCheck, Download, RefreshCw,
  Sparkles, Sliders, Box, Layers, RotateCw, Factory, Eye
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useCorporateMotion } from '../../lib/motion';

// Modular Child Components
import { StudioMockupViewer } from './components/StudioMockupViewer';
import { FinatReelViewer } from './components/FinatReelViewer';
import { ConfiguratorSteps } from './components/ConfiguratorSteps';

export const ConfiguratorPage: React.FC = () => {
  useCorporateMotion();

  // Wizard Steps (1 to 5)
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [category, setCategory] = useState('flexo_labels');
  const [substrate, setSubstrate] = useState('polypropylene_white');
  const [selectedContainer, setSelectedContainer] = useState('bottle');
  const [widthMm, setWidthMm] = useState(85);
  const [heightMm, setHeightMm] = useState(120);
  const [quantity, setQuantity] = useState(25000);
  const [applicationMethod, setApplicationMethod] = useState<'hand' | 'machine'>('hand');
  const [rollOrSheet, setRollOrSheet] = useState<'roll' | 'sheet'>('roll');
  const [coreMm, setCoreMm] = useState(76);
  const [finatDirection, setFinatDirection] = useState(1);
  const [embellishments, setEmbellishments] = useState<string[]>(['uv_varnish']);
  const [notes, setNotes] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [industry, setIndustry] = useState('Beverage & Bottling');
  const [artworkFile, setArtworkFile] = useState<File | null>(null);

  // Active View Tab on Studio Stage ('mockup' | 'finat')
  const [studioView, setStudioView] = useState<'mockup' | 'finat'>('mockup');

  // Submission Status (Fail-Closed)
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const toggleEmbellishment = (emb: string) => {
    if (embellishments.includes(emb)) {
      setEmbellishments(embellishments.filter(e => e !== emb));
    } else {
      setEmbellishments([...embellishments, emb]);
    }
  };

  const handleArtworkFileChange = async (file: File | null) => {
    if (!file) {
      setArtworkFile(null);
      return;
    }

    const { validateClientFileMagicBytes } = await import('../../lib/magicBytes');
    const { valid, reason } = await validateClientFileMagicBytes(file);
    if (!valid) {
      setSubmitError(`Invalid file: ${reason}`);
      setArtworkFile(null);
      return;
    }

    setSubmitError(null);
    setArtworkFile(file);
  };

  const handleSubmitRfq = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    const refNo = `PZL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      let fileUrl = '';
      if (artworkFile) {
        try {
          const fileExt = artworkFile.name.split('.').pop();
          const fileName = `${refNo}_${Date.now()}.${fileExt}`;
          const { data, error: storageErr } = await supabase.storage
            .from('rfq-dielines')
            .upload(fileName, artworkFile);
          if (!storageErr && data) {
            fileUrl = data.path;
          }
        } catch (storageErr) {}
      }

      const { error: insertError } = await supabase.from('rfq_inquiries').insert([
        {
          reference_no: refNo,
          company_name: companyName,
          contact_name: contactName,
          email: email,
          phone: phone,
          industry: industry,
          category: category,
          substrate: substrate,
          dimensions_mm: `${widthMm}x${heightMm}`,
          quantity: quantity,
          roll_or_sheet: rollOrSheet,
          roll_core_mm: rollOrSheet === 'roll' ? coreMm : null,
          rewind_direction: rollOrSheet === 'roll' ? finatDirection : null,
          embellishments: embellishments,
          artwork_file_url: fileUrl || (artworkFile ? artworkFile.name : null),
          artwork_original_name: artworkFile ? artworkFile.name : null,
          artwork_size_bytes: artworkFile ? artworkFile.size : null,
          notes: notes,
          status: 'pending'
        }
      ]);

      if (insertError) {
        setSubmitError(`Unable to register RFQ: ${insertError.message || 'Database write rejected'}`);
        setSubmitting(false);
        return;
      }

      setSubmittedRef(refNo);
      setSubmitting(false);
    } catch (err: any) {
      setSubmitError(`Network error: ${err.message || 'Failed to submit RFQ'}`);
      setSubmitting(false);
    }
  };

  const substratesList = [
    { id: 'polypropylene_white', name: 'White Gloss BOPP 60μm', badge: 'WATERPROOF', desc: 'Synthetic tear-proof film for chilled beverages & edible oils.' },
    { id: 'polypropylene_clear', name: 'Crystal Clear BOPP', badge: 'NO-LOOK EFFECT', desc: 'Ultra-transparent film for seamless glass & PET bottle look.' },
    { id: 'polypropylene_silver', name: 'Silver Metallized BOPP', badge: 'METALLIC FOIL', desc: 'High-reflectance metallic sheen for spirits & agrochemicals.' },
    { id: 'fasson_semi_gloss', name: 'Fasson Semi-Gloss Paper', badge: 'HIGH TACK', desc: 'Premium coated paper for dry packaging & carton sealing.' },
    { id: 'fbb_carton', name: 'Folding Boxboard (FBB 250–450gsm)', badge: 'PHARMA / BOX', desc: 'Rigid multi-ply virgin board for medicine cartons & retail.' },
    { id: 'solid_bleached_board', name: 'Solid Bleached Board (SBB/GZ)', badge: 'LUXURY BOARD', desc: 'Ultra-smooth premium white board for cosmetics & gifts.' },
  ];

  const containerImages: Record<string, string> = {
    bottle: '/assets/img/mockups/bottle_studio.jpg',
    jug: '/assets/img/mockups/jug_studio.jpg',
    jar: '/assets/img/mockups/jar_studio.jpg',
    vial: '/assets/img/mockups/vial_studio.jpg',
    carton: '/assets/img/mockups/carton_studio.jpg',
  };

  const finatStandards: Record<number, { 
    title: string; 
    winding: 'Wound Out' | 'Wound In'; 
    leadEdge: string; 
    rotationDeg: number;
    headDirection: 'right' | 'left' | 'up' | 'down';
    diagramDesc: string;
  }> = {
    1: { title: 'FINAT #1', winding: 'Wound Out', leadEdge: 'Top Edge Off First', rotationDeg: 0, headDirection: 'right', diagramDesc: 'Labels on OUTSIDE face of web • Top of artwork feeds first into applicator' },
    2: { title: 'FINAT #2', winding: 'Wound Out', leadEdge: 'Bottom Edge Off First', rotationDeg: 180, headDirection: 'left', diagramDesc: 'Labels on OUTSIDE face of web • Bottom of artwork feeds first into applicator' },
    3: { title: 'FINAT #3', winding: 'Wound Out', leadEdge: 'Right Edge Off First', rotationDeg: 90, headDirection: 'down', diagramDesc: 'Labels on OUTSIDE face of web • Right side of artwork leads the exit' },
    4: { title: 'FINAT #4', winding: 'Wound Out', leadEdge: 'Left Edge Off First', rotationDeg: 270, headDirection: 'up', diagramDesc: 'Labels on OUTSIDE face of web • Left side of artwork leads the exit' },
    5: { title: 'FINAT #5', winding: 'Wound In', leadEdge: 'Top Edge Off First', rotationDeg: 0, headDirection: 'right', diagramDesc: 'Labels on INSIDE face of web • Top of artwork feeds first' },
    6: { title: 'FINAT #6', winding: 'Wound In', leadEdge: 'Bottom Edge Off First', rotationDeg: 180, headDirection: 'left', diagramDesc: 'Labels on INSIDE face of web • Bottom of artwork feeds first' },
    7: { title: 'FINAT #7', winding: 'Wound In', leadEdge: 'Right Edge Off First', rotationDeg: 90, headDirection: 'down', diagramDesc: 'Labels on INSIDE face of web • Right side feeds first' },
    8: { title: 'FINAT #8', winding: 'Wound In', leadEdge: 'Left Edge Off First', rotationDeg: 270, headDirection: 'up', diagramDesc: 'Labels on INSIDE face of web • Left side feeds first' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2">
          <span className="tech-tag tech-tag-crimson text-xs">CAD & DIELINE CONFIGURATOR</span>
          <span className="tech-tag tech-tag-emerald text-xs">8K STUDIO VIRTUAL PROTOTYPING</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white">
          Packaging & Label Engineering Studio
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Configure exact roll geometry, FINAT 1–8 rewind directions, and food-grade substrates with instant photorealistic container inspection.
        </p>
      </div>

      {submittedRef ? (
        <div className="double-bezel max-w-2xl mx-auto text-center">
          <div className="double-bezel-inner p-10 space-y-6 bg-white dark:bg-slate-900">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="tech-tag tech-tag-emerald text-xs">MANUFACTURING RFQ REGISTERED</span>
              <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">
                RFQ Dispatched to Engineering Desk
              </h2>
              <p className="text-xs font-mono text-slate-500">
                Official Reference: <strong className="text-[#E00019]">{submittedRef}</strong>
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto pt-2">
                Our plant estimating team at Mwembeshi Road has received your CAD specifications. An official quote PDF with dieline validation will be dispatched within 4 hours.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSubmittedRef(null);
                  setCurrentStep(1);
                }}
                className="btn-pill btn-pill-primary text-xs"
              >
                Configure Another Specification
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive 3D Stage & FINAT Reel Viewer (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* View Switcher: Studio Mockup vs FINAT Reel */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <button
                onClick={() => setStudioView('mockup')}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                  studioView === 'mockup'
                    ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>3D Container Studio</span>
              </button>

              <button
                onClick={() => setStudioView('finat')}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                  studioView === 'finat'
                    ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>FINAT 1–8 Rewind Standard</span>
              </button>
            </div>

            {studioView === 'mockup' ? (
              <StudioMockupViewer
                selectedContainer={selectedContainer}
                setSelectedContainer={setSelectedContainer}
                containerImages={containerImages}
                substrate={substrate}
                substratesList={substratesList}
                widthMm={widthMm}
                heightMm={heightMm}
                rollOrSheet={rollOrSheet}
                coreMm={coreMm}
                finatDirection={finatDirection}
                finatStandards={finatStandards}
                embellishments={embellishments}
              />
            ) : (
              <FinatReelViewer
                finatDirection={finatDirection}
                setFinatDirection={setFinatDirection}
                finatStandards={finatStandards}
              />
            )}

          </div>

          {/* Right Column: 5-Step Configurator Wizard (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <ConfiguratorSteps
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              category={category}
              setCategory={setCategory}
              widthMm={widthMm}
              setWidthMm={setWidthMm}
              heightMm={heightMm}
              setHeightMm={setHeightMm}
              quantity={quantity}
              setQuantity={setQuantity}
              substrate={substrate}
              setSubstrate={setSubstrate}
              substratesList={substratesList}
              applicationMethod={applicationMethod}
              setApplicationMethod={setApplicationMethod}
              rollOrSheet={rollOrSheet}
              setRollOrSheet={setRollOrSheet}
              coreMm={coreMm}
              setCoreMm={setCoreMm}
              finatDirection={finatDirection}
              setFinatDirection={setFinatDirection}
              embellishments={embellishments}
              toggleEmbellishment={toggleEmbellishment}
              companyName={companyName}
              setCompanyName={setCompanyName}
              contactName={contactName}
              setContactName={setContactName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              industry={industry}
              setIndustry={setIndustry}
              notes={notes}
              setNotes={setNotes}
              artworkFile={artworkFile}
              handleArtworkFileChange={handleArtworkFileChange}
              submitting={submitting}
              submitError={submitError}
              onSubmit={handleSubmitRfq}
            />
          </div>

        </div>
      )}

    </div>
  );
};
