# Product Requirements Document (PRD) — PrintFast Zambia Cloud Platform

**Version:** 2.0  
**Date:** 2026-08-25  
**Owner:** PrintFast Zambia Limited Management  
**Status:** Approved & Shipped  

---

## 1. Product Scope & Vision

PrintFast Zambia Limited (PZL) is Lusaka's premier industrial printing and label converting press (operating 24/7 with 8-colour flexo lines and Heidelberg Speedmaster offset machinery).

The digital platform bridges commercial packaging buyers with plant manufacturing workflows through:
1. **High-Fidelity Public Interface**: Instant specification configuration for procurement and brand managers without artificial login walls.
2. **Hidden Sales Console (`/sales`)**: Streamlined pipeline management, CAD dieline inspection, Quote PDF attachment, and Trelio-style Decision Gates.
3. **Executive Management Hub (`/admin`)**: Ownership telemetry, sales staff account CRUD & deactivation, dynamic plant settings, and live media asset management.

---

## 2. Key Functional Requirements

### 2.1 Public B2B Interface
* **FR-1 (5-Step Configurator)**: Multi-step interactive RFQ builder with dynamic substrate specifications, volume tiers, FINAT 1–8 unwind selectors, and CAD dieline uploader.
* **FR-2 (Sample Kit Logistics)**: Free physical sample swatch pack request form with direct dispatch tracking.
* **FR-3 (Machine Telemetry)**: Live 8-station flexo deck status (`Cyan`, `Mag`, `Yel`, `Black`, `Spot 1`, `Spot 2`, `Gold Foil`, `UV Varnish`), turnaround notice, and phone/WhatsApp links.
* **FR-4 (Zero Visual Drift)**: 100% adherence to Swiss 60-30-10 palette, Fraunces/Libre Franklin typography, and GSAP industrial motion curves.

### 2.2 Hidden Sales Console (`/sales` — Direct URL)
* **FR-5 (Pipeline Tracking)**: Real-time filtering by `Pending Review`, `Quoted`, `In Production`, `Dispatched`, and `Settled`.
* **FR-6 (Quote PDF Attachment)**: Estimators can upload official generated quote documents (`.pdf`) directly to the RFQ record.
* **FR-7 (Trelio-Style Decision Gates)**: Status progression operates through human decision gates, including the manual **`[Mark as Settled]`** confirmation of offline payment.

### 2.3 Executive Management Hub (`/admin` — Direct URL)
* **FR-8 (Staff Management)**: Create, monitor, and deactivate Sales Estimator accounts.
* **FR-9 (Plant Settings & Media)**: Live update of operational notices, phone numbers, and all 6 site media slots (including primary vector brand logo).
* **FR-10 (Security Audit Trail)**: Cryptographic logging of logins, media updates, and decision gate advancements.

---

## 3. Commercial Reality & Non-Goals

* **Zero In-App Payment Gateways**: Commercial prices, volume discounts, and payment methods (net-30, cash, bank TT, mobile transfer) are negotiated 100% offline. No credit card or live price engines exist inside the app.
* **Hidden Staff Consoles**: Public navigation shows zero links or mentions of `/sales` or `/admin`. Access is strictly via direct URL address bar entry.
