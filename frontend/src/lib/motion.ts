import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function useCorporateMotion() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. CMYK Bar entrance
      const cmykSpans = document.querySelectorAll('.cmyk-bar span');
      if (cmykSpans.length > 0) {
        gsap.from(cmykSpans, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'all'
        });
      }

      // 2. Hero entrance
      const heroSection = document.querySelector('.hero');
      if (heroSection) {
        const heroElements = [
          heroSection.querySelector('.section-tag'),
          heroSection.querySelector('.hero-title'),
          heroSection.querySelector('.hero-desc'),
          heroSection.querySelector('.hero-actions')
        ].filter(Boolean);

        if (heroElements.length > 0) {
          gsap.from(heroElements, {
            y: 30,
            opacity: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            clearProps: 'all'
          });
        }
      }

      // 3. Section Headers Reveal
      const sectionHeaders = document.querySelectorAll('.section-header');
      sectionHeaders.forEach(header => {
        if (header.closest('.hero')) return;
        const children = Array.from(header.children);
        if (children.length > 0) {
          gsap.from(children, {
            scrollTrigger: {
              trigger: header,
              start: 'top 88%',
              once: true
            },
            y: 22,
            opacity: 0,
            duration: 0.75,
            stagger: 0.09,
            ease: 'power2.out',
            clearProps: 'all'
          });
        }
      });

      // 4. Cards & Grids Stagger
      const cardGrids = document.querySelectorAll('.grid-2, .grid-3, .grid-4');
      cardGrids.forEach(grid => {
        if (grid.closest('.hero')) return;
        const cards = grid.querySelectorAll(':scope > .card, :scope > .gallery-item');
        if (cards.length > 0) {
          gsap.from(cards, {
            scrollTrigger: {
              trigger: grid,
              start: 'top 85%',
              once: true
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            clearProps: 'all'
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);
}
