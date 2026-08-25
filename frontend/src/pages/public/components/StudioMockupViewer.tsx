import React from 'react';
import { ShieldCheck, Eye, Layers } from 'lucide-react';

interface StudioMockupViewerProps {
  selectedContainer: string;
  setSelectedContainer: (c: string) => void;
  containerImages: Record<string, string>;
  substrate: string;
  substratesList: { id: string; name: string; badge: string; desc: string }[];
  widthMm: number;
  heightMm: number;
  rollOrSheet: 'roll' | 'sheet';
  coreMm: number;
  finatDirection: number;
  finatStandards: Record<number, any>;
  embellishments: string[];
}

export const StudioMockupViewer: React.FC<StudioMockupViewerProps> = ({
  selectedContainer,
  setSelectedContainer,
  containerImages,
  substrate,
  substratesList,
  widthMm,
  heightMm,
  rollOrSheet,
  coreMm,
  finatDirection,
  finatStandards,
  embellishments
}) => {
  const currentSubstrate = substratesList.find(s => s.id === substrate) || substratesList[0];

  return (
    <div className="double-bezel">
      <div className="double-bezel-inner p-6 space-y-5 bg-white dark:bg-slate-900">
        
        {/* Studio Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white font-mono">
              3D Container Virtual Prototyping Studio
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">8K Render Calibration</span>
        </div>

        {/* Container Selection Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          {[
            { id: 'bottle', label: 'Beverage Bottle', category: 'Beverage & Spirits' },
            { id: 'jug', label: '5L Jerry Can', category: 'Edible Oils & Chem' },
            { id: 'jar', label: 'Glass Honey Jar', category: 'Food & Gourmet' },
            { id: 'vial', label: 'Pharma Vial', category: 'Medical & Health' },
            { id: 'carton', label: 'Folding Box', category: 'FBB Retail Carton' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedContainer(item.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                selectedContainer === item.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Photorealistic Container Stage with Flush Label + 3D Hover Pop-out */}
        <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center group select-none">
          
          {/* Background Studio Lighting & Image */}
          <img
            src={containerImages[selectedContainer]}
            alt={`${selectedContainer} Photorealistic Studio Mockup`}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-90 transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none" />

          {/* Calibrated Flush Cylindrical Label with 3D Hover Pop-Out */}
          <div
            style={{
              top: selectedContainer === 'bottle' ? '67%' :
                   selectedContainer === 'jug' ? '60%' :
                   selectedContainer === 'jar' ? '54%' :
                   selectedContainer === 'vial' ? '52%' : '48%',
              left: selectedContainer === 'bottle' ? '50%' :
                    selectedContainer === 'jug' ? '49%' :
                    selectedContainer === 'jar' ? '50%' :
                    selectedContainer === 'vial' ? '50%' : '50%',
              transform: 'translate(-50%, -50%)',
              width: selectedContainer === 'carton' ? '44%' : '38%',
              aspectRatio: `${widthMm} / ${heightMm}`
            }}
            className={`absolute z-10 transition-all duration-300 ease-out cursor-pointer rounded-sm border ${
              substrate.includes('clear')
                ? 'bg-white/30 backdrop-blur-xs border-white/40 shadow-sm'
                : substrate.includes('silver')
                ? 'bg-gradient-to-tr from-slate-300 via-slate-100 to-slate-400 border-slate-300 text-slate-900 shadow-md'
                : 'bg-white border-slate-200 text-slate-900 shadow-lg'
            } hover:scale-[1.3] hover:-translate-y-6 hover:shadow-2xl hover:ring-2 hover:ring-rose-500 hover:z-30 flex flex-col justify-between p-2`}
          >
            {/* Label Content Header */}
            <div className="flex items-center justify-between border-b border-black/10 pb-0.5">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E00019]" />
                <span className="text-[8px] font-extrabold font-mono tracking-tighter uppercase text-slate-900">
                  PRINTFAST
                </span>
              </div>
              <span className="text-[7px] font-mono text-slate-500">
                {widthMm}×{heightMm}mm
              </span>
            </div>

            {/* Label Center Art */}
            <div className="text-center my-auto py-1">
              <div className="text-[9px] font-black tracking-tight uppercase leading-tight text-slate-950">
                PREMIUM PACKAGING
              </div>
              <div className="text-[7px] font-mono text-slate-600 uppercase tracking-widest mt-0.5">
                {currentSubstrate.name.split(' ')[0]} {currentSubstrate.badge}
              </div>
            </div>

            {/* Label Footer */}
            <div className="border-t border-black/10 pt-0.5 flex items-center justify-between text-[6px] font-mono text-slate-500">
              <span>LUSAKA PLANT</span>
              <span>{rollOrSheet === 'roll' ? `FINAT #${finatDirection}` : 'SHEETS'}</span>
            </div>

            {/* Hover Tooltip Helper */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/90 text-white text-[8px] font-mono px-2 py-0.5 rounded shadow whitespace-nowrap pointer-events-none">
              🔍 Hover to Pop-Out & Inspect Substrate
            </div>
          </div>

          {/* Studio Watermark & Overlay Indicators */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-white/80 pointer-events-none">
            <span className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Calibrated: {widthMm}mm × {heightMm}mm</span>
            </span>

            <span className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
              {currentSubstrate.name}
            </span>
          </div>

        </div>

        {/* Technical Specification Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400 block text-[10px]">SUBSTRATE</span>
            <strong className="text-slate-900 dark:text-white text-xs truncate block">{currentSubstrate.name}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400 block text-[10px]">ROLL CORE</span>
            <strong className="text-slate-900 dark:text-white text-xs">{rollOrSheet === 'roll' ? `${coreMm}mm (${(coreMm / 25.4).toFixed(0)}")` : 'N/A'}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400 block text-[10px]">WINDING DIRECTION</span>
            <strong className="text-slate-900 dark:text-white text-xs">{rollOrSheet === 'roll' ? `FINAT #${finatDirection}` : 'Flat Sheets'}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400 block text-[10px]">COATINGS</span>
            <strong className="text-slate-900 dark:text-white text-xs">{embellishments.length > 0 ? `${embellishments.length} Special Finish` : 'Standard UV'}</strong>
          </div>
        </div>

      </div>
    </div>
  );
};
