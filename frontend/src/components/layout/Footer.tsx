import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageSquare, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#05080E] text-slate-300 pt-16 pb-12 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info & Address */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <div className="bg-white p-2 rounded-xl border border-slate-700 shadow-sm inline-flex items-center">
                <img src="/assets/logo.svg" alt="PrintFast Zambia" className="h-7 w-auto object-contain" />
              </div>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              PrintFast Zambia Limited is Lusaka's premier industrial printing and label converting press. Operating 24/7 continuous production to deliver precision flexographic labels, Heidelberg packaging, and commercial print.
            </p>
            <div className="flex items-start gap-2.5 text-xs text-slate-400 font-mono pt-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>Plot 35288 Mwembeshi Road, Light Industrial Area, Lusaka, Zambia</span>
            </div>
          </div>

          {/* Capabilities Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100">Capabilities</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li><Link to="/services#flexo" className="hover:text-white transition-colors">Waterproof Roll Labels</Link></li>
              <li><Link to="/services#offset" className="hover:text-white transition-colors">Custom Packaging Boxes</Link></li>
              <li><Link to="/services#finishing" className="hover:text-white transition-colors">Metallic Foil & Finishes</Link></li>
              <li><Link to="/services#commercial" className="hover:text-white transition-colors">Company Reports & Books</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Substrates & Materials</Link></li>
            </ul>
          </div>

          {/* Customer Tools Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100">Customer Tools</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li><Link to="/configurator" className="hover:text-rose-400 transition-colors font-bold text-white">Interactive Quote Builder</Link></li>
              <li><Link to="/contact#sample-kit" className="hover:text-white transition-colors">Request Physical Sample Kit</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Machinery Specifications</Link></li>
              <li><Link to="/contact#plant-map" className="hover:text-white transition-colors">Plant Location & Directions</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Mwembeshi Plant</Link></li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100">Contact Estimating</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 font-mono">
              <li>
                <a href="tel:+260974423496" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span>+260 974 423 496</span>
                </a>
              </li>
              <li>
                <a href="mailto:sales@printfastzambia.com" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-rose-400" />
                  <span>sales@printfastzambia.com</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/260974423496" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors text-emerald-400">
                  <MessageSquare className="w-4 h-4" />
                  <span>+260 974 423 496</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar with CMYK Registration Process Marker */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <p>© 2026 PrintFast Zambia Limited. All rights reserved.</p>
          <div className="cmyk-bar max-w-xs opacity-70">
            <span className="cmyk-c"></span>
            <span className="cmyk-m"></span>
            <span className="cmyk-y"></span>
            <span className="cmyk-k"></span>
          </div>
          <p>Plot 35288 Mwembeshi Rd • FINAT Certified Process</p>
        </div>

      </div>
    </footer>
  );
};
