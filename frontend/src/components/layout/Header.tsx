import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Moon, Sun, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem('app_theme') || localStorage.getItem('pzl_theme') || 'light';
    setTheme(saved as any);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('app_theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Capabilities', path: '/services' },
    { label: 'Substrates & Works', path: '/gallery' },
    { label: 'Plant & Equipment', path: '/about' },
    { label: 'Contact Desk', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-3 pb-2 transition-all">
      {/* Accessible Keyboard Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-slate-950 focus:text-white focus:rounded-xl focus:shadow-xl focus:border focus:border-rose-500 text-xs font-mono font-bold"
      >
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto glass-nav rounded-full px-5 py-2.5 flex items-center justify-between transition-all">
        
        {/* Brand Logo & Telemetry Indicator */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1 rounded-md transition-transform group-hover:scale-105">
              <img src="/assets/logo.svg" alt="Apex Packaging & Converting" className="h-7 sm:h-8 w-auto object-contain" />
            </div>
          </Link>

          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>24/7 CONVERTING PLANT ACTIVE</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 font-sans text-xs font-semibold text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-sm'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions (Theme + Button-in-Button CTA) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          <Link to="/configurator" className="btn-pill btn-pill-primary text-xs tracking-tight">
            <span>Configure B2B Quote</span>
            <span className="btn-pill-icon">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
            className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden max-w-7xl mx-auto mt-2 p-4 rounded-2xl glass-nav space-y-2 font-sans text-sm font-semibold">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <Link
              to="/configurator"
              onClick={() => setMobileOpen(false)}
              className="btn-pill btn-pill-primary w-full justify-between"
            >
              <span>Interactive Quote Configurator</span>
              <span className="btn-pill-icon">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
