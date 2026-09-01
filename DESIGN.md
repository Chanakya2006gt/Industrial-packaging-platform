# DESIGN SYSTEM SPECIFICATION — Apex Packaging & Converting

> **Brand:** Apex Packaging & Converting (`Apex Pack`)  
> **Aesthetic Archetype:** Swiss Industrial Modernist / Precision Engineering  
> **Distribution Rule:** Strict 60-30-10 calibrated color distribution  
> **Status:** Production Design Token Architecture  

---

## 1. Visual Identity & Brand Philosophy

Apex Packaging & Converting manufactures industrial flexographic roll labels and high-capacity folding box cartons. The visual language blends Swiss modernist typographic clarity with precision manufacturing telemetry.

### Core Visual Tenets:
1. **High Contrast & Data Legibility**: Extreme contrast ratios meeting WCAG 2.2 AA/AAA for factory floors and office workstations.
2. **Sub-millimeter Telemetry**: Technical accents, CMYK process registration marks, and monospace dimension callouts.
3. **Restrained Utility**: No decorative gradient fluff or ungrounded animations. Surfaces use crisp double-bezel borders and physical card elevation.

---

## 2. Color Palette & 60-30-10 Distribution

The palette is governed by a semantic HSL token architecture configured in [`frontend/src/styles/globals.css`](./frontend/src/styles/globals.css) and mapped in [`frontend/tailwind.config.js`](./frontend/tailwind.config.js).

```
┌────────────────────────────────────────────────────────────────────────┐
│ 60% Dominant Canvas & Surfaces                                         │
│ Light: hsl(240 20% 99%) #FAFAFC  │ Dark: hsl(222 47% 5%) #070B12       │
├──────────────────────────────────────┬─────────────────────────────────┤
│ 30% Structural Machinery Slate       │ 10% Laser Crimson Accent & CMYK │
│ Slate 900: hsl(222 47% 11%) #0F172A │ Primary: hsl(355 100% 44%) #E00 │
│ Borders: hsl(214 32% 91%)            │ Cyan: #00A3E0 | Magenta: #E6007E│
│ Muted Wells: hsl(210 40% 96.1%)      │ Yellow: #FFD100 | Black: #0F172A│
└──────────────────────────────────────┴─────────────────────────────────┘
```

### Semantic Token Scale:

| Token Name | Light Mode (HSL) | Dark Mode (HSL) | Purpose / Element |
| :--- | :--- | :--- | :--- |
| `--background` | `240 20% 99%` | `222 47% 5%` | Global body canvas |
| `--foreground` | `222 47% 11%` | `210 40% 98%` | Primary prose and titles |
| `--card` | `0 0% 100%` | `222 47% 8%` | Elevated cards & studio panels |
| `--card-foreground`| `222 47% 11%` | `210 40% 98%` | Text inside cards |
| `--primary` | `355 100% 44%` | `355 100% 50%` | Primary CTAs, active pills (`#E00019`) |
| `--primary-foreground`| `0 0% 100%` | `0 0% 100%` | Button text |
| `--secondary` | `210 40% 96.1%`| `217 33% 17%` | Filter buttons & tab backings |
| `--muted` | `210 40% 96.1%`| `217 33% 17%` | Subtle well backgrounds |
| `--muted-foreground` | `215 16% 47%`| `215 20% 65%` | Helper text & timestamps |
| `--accent` | `210 40% 96.1%`| `217 33% 17%` | Interactive hover states |
| `--destructive` | `0 84.2% 60.2%`| `0 62.8% 30.6%`| Error banners & SLA overdue alerts |
| `--border` | `214 32% 91%` | `217 33% 17%` | Structural framing borders |
| `--ring` | `355 100% 44%` | `355 100% 50%` | Focus outline rings |

### 4-Color Process CMYK Registration Marks:
* **Cyan**: `hsl(196 100% 44%)` (`#00A3E0`)
* **Magenta**: `hsl(327 100% 45%)` (`#E6007E`)
* **Yellow**: `hsl(49 100% 50%)` (`#FFD100`)
* **Key/Black**: `hsl(222 47% 11%)` (`#0F172A`)

---

## 3. Typography Hierarchy

The type system pairs structural geometric sans with monospaced machine gauges.

* **Primary Display & Headings:** `Plus Jakarta Sans`, system-ui, sans-serif.
  - Tracking: `-0.025em` to `-0.035em` tight leading.
  - Weights: `700` (Bold), `800` (ExtraBold), `900` (Black).
* **Body & Interface:** `Inter`, -apple-system, BlinkMacSystemFont, sans-serif.
  - Leading: `1.6` relaxed for technical readability.
  - Weights: `400` (Regular), `500` (Medium), `600` (SemiBold).
* **Technical Telemetry & Formulas:** `IBM Plex Mono`, SFMono-Regular, monospace.
  - Usage: Dimensions (`85x120mm`), FINAT codes, reference numbers (`RFQ-YYYY-XXXX`), currency breakdowns.
  - Weights: `500` (Medium), `700` (Bold).

---

## 4. UI Components & Radix Accessible Primitives

All modal overlays, dropdowns, and interactive tabs leverage accessible Radix UI primitives:

1. **Accessible Dialogs ([`components/ui/dialog.tsx`](./frontend/src/components/ui/dialog.tsx))**:
   - Focus trapped inside modal; `Escape` key dismisses cleanly.
   - Smooth animated overlay backdrop (`bg-black/60 backdrop-blur-sm`).
2. **Accessible Select Menus ([`components/ui/select.tsx`](./frontend/src/components/ui/select.tsx))**:
   - Keyboard accessible with `ArrowUp` / `ArrowDown` / `Enter`.
   - Replaces native OS `<select>` elements with tokenized popovers.
3. **Toast Notifications ([`components/ui/sonner.tsx`](./frontend/src/components/ui/sonner.tsx))**:
   - Root mounted Sonner engine supporting rich error, success, and info alerts.
4. **Accessible Focus Ring**:
   - Global `:where(a, button, input, select, textarea, [tabindex]):focus-visible` offset ring (`ring-2 ring-primary ring-offset-2`).

---

## 5. FINAT 1–8 Unwind & 3D Prototyping Geometry

The configurator features pixel-calibrated engineering diagrams:

* **FINAT 1–8 Unwind Matrix**: Standardized against European FINAT Handbook §2.8:
  - Directions 1–4: **Wound Out** (Top/Bottom/Right/Left lead edge).
  - Directions 5–8: **Wound In** (Top/Bottom/Right/Left lead edge).
* **Live Vector Diagrams**: 8-way mathematical SVG reel tiles with dynamic rotation of label letter `A`.
* **Container Calibrations**: 1:1 aspect-ratio studios for Beverage Bottles, 5L Jerry Cans, Food Jars, Pharma Vials, and Retail Cartons.

---

## 6. Motion & Accessibility Principles

* **GSAP 3.12 Industrial Curves**:
  - Entrances: `power3.out` and `power2.out` weighted deceleration.
  - ScrollTrigger pinning and scrubbed technical visualizers.
* **Prefers-Reduced-Motion Fallback**:
  - Global `@media (prefers-reduced-motion: reduce)` collapses transitions and animations to `0.01ms` for vestibular disorder compliance.
