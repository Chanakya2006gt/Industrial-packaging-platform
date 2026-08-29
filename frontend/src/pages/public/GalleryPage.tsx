import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCorporateMotion } from '../../lib/motion';

export const GalleryPage: React.FC = () => {
  useCorporateMotion();
  const [filter, setFilter] = useState('all');

  const items = [
    {
      id: 1,
      category: 'flexo',
      title: 'White Gloss Waterproof Film (BOPP 60μm)',
      tag1: 'SYNTHETIC FILM',
      tag2: '8C FLEXO',
      badge: 'WATERPROOF BOPP',
      img: '/assets/img/press-flexo-8c.jpg',
      desc: 'Tear-proof, oil-proof, and water-resistant synthetic label film. High optical opacity for direct application on colored PET and HDPE containers.',
      apps: 'Bottled water, soft drinks, edible oil bottles, lubricants, and shampoos.'
    },
    {
      id: 2,
      category: 'flexo',
      title: 'Crystal Clear Film (No-Look Transparent)',
      tag1: 'CLEAR FILM',
      tag2: '8C FLEXO',
      badge: 'CLEAR FILM',
      img: '/assets/img/hero-packaging.jpg',
      desc: 'Ultra-transparent polypropylene film creating the seamless visual appearance of direct bottle screen-printing at high-speed flexographic run rates.',
      apps: 'Clear spirit bottles, luxury cosmetics, clear beverage bottles, and sanitizer dispensers.'
    },
    {
      id: 3,
      category: 'flexo',
      title: 'Silver Metallized Film BOPP',
      tag1: 'METALLIC FOIL',
      tag2: '8C FLEXO',
      badge: 'METALLIC FOIL',
      img: '/assets/img/hero-packaging.jpg',
      desc: 'High-reflectance metallic substrate allowing selective translucent ink printing to create multi-color metallic luster and anti-counterfeiting sheen.',
      apps: 'Premium energy drinks, spirits, agrochemical drums, and automotive performance fluids.'
    },
    {
      id: 4,
      category: 'cartons',
      title: 'Folding Boxboard (FBB 250–450gsm)',
      tag1: 'FBB BOARD',
      tag2: 'HEIDELBERG 6C',
      badge: 'FBB BOXBOARD',
      img: '/assets/img/cartons-packaging.jpg',
      desc: 'Multi-ply virgin fiber board featuring high stiffness, smooth top coating for high-fidelity litho dot reproduction, and clean score-line creasing.',
      apps: 'Pharmaceutical syrup cartons, blister card outers, food & confectionery boxes.'
    },
    {
      id: 5,
      category: 'finishing',
      title: 'Rotary Cold Foil & Spot UV Embellishment',
      tag1: 'METALLIC ACCENTS',
      tag2: 'FINISHING',
      badge: 'COLD FOIL / UV',
      img: '/assets/img/press-flexo-8c.jpg',
      desc: 'Inline metallic gold, silver, and holographic cold foil stamping integrated directly on flexographic converting lines without separate tooling delay.',
      apps: 'Luxury spirit labels, pharmaceutical seals, security cosmetics cartons.'
    },
    {
      id: 6,
      category: 'commercial',
      title: 'High-Definition Gloss & Matt Art Papers',
      tag1: 'COMMERCIAL LITHO',
      tag2: 'HEIDELBERG 6C',
      badge: 'ART PAPER',
      img: '/assets/img/prepress-ctp.jpg',
      desc: 'Double-coated high-brightness art papers (115–350 gsm) engineered for Heidelberg offset press printing with razor-sharp micro-dot ink holdout.',
      apps: 'Annual reports, product catalogues, full-color marketing brochures, security certificates.'
    }
  ];

  const filteredItems = filter === 'all' ? items : items.filter(item => item.category === filter);

  return (
    <div className="space-y-12 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Page Header */}
      <section className="pt-10 text-center space-y-3 max-w-3xl mx-auto">
        <div className="tech-tag tech-tag-crimson">TECHNICAL SUBSTRATES</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-tight">
          Substrates, Films & Finishing Guide
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          We convert international-standard certified substrates engineered for high-speed automated applicators, extreme refrigeration, and durable retail shelf appeal.
        </p>
      </section>

      {/* Filter Tabs */}
      <div className="flex justify-center flex-wrap gap-2 mb-8">
        {[
          { label: 'All Materials', value: 'all' },
          { label: 'Label Films & Paper', value: 'flexo' },
          { label: 'Packaging Boxboard', value: 'cartons' },
          { label: 'Foil & Finishes', value: 'finishing' },
          { label: 'Commercial Papers', value: 'commercial' }
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all ${
              filter === tab.value
                ? 'bg-[#E00019] text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Gallery Double-Bezel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map(item => (
          <div key={item.id} className="double-bezel">
            <div className="double-bezel-inner p-6 h-full flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="h-48 rounded-xl overflow-hidden bg-slate-900 relative border border-slate-200 dark:border-slate-800">
                  <img src={item.img} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 tech-tag tech-tag-cyan">{item.badge}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="tech-tag tech-tag-neutral text-[10px]">{item.tag1}</span>
                  <span className="tech-tag tech-tag-crimson text-[10px]">{item.tag2}</span>
                </div>
                <h3 className="text-base font-bold text-slate-950 dark:text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-700 dark:text-slate-300">Applications:</strong> {item.apps}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <Link to="/configurator" className="btn-pill btn-pill-outline text-xs w-full justify-center">
                  <span>Configure in Quote</span>
                  <span className="btn-pill-icon"><ArrowRight className="w-3.5 h-3.5" /></span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
