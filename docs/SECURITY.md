# SECURITY — Industrial Packaging & Operations Platform

**Version:** 2.2  
**Date:** 2026-09-01  
**Classification:** Technical Security Architecture & Threat Model  

---

## 1. Security Architecture & Threat Model

The cloud operations platform enforces Defense-in-Depth across every layer:

```
[ Edge WAF / Cloudflare ] ──► [ Vercel Edge Headers ] ──► [ React Router Guards ] ──► [ Express API & Helmet CSP ] ──► [ Supabase RLS Policies ]
```

---

## 2. Row Level Security (RLS) Matrix on Supabase

| Table | Public Access | Sales Staff (`role: 'sales'`) | SuperAdmin (`role: 'superadmin'`) |
| :--- | :--- | :--- | :--- |
| `profiles` | Read active profiles (minimal) | Read active profiles | **FULL CRUD** (Create, edit, deactivate staff) |
| `rfq_inquiries` | **INSERT ONLY** (Submit RFQ) | **SELECT & UPDATE** (Advance decision gates, attach PDF) | **FULL CRUD** (Override status, delete records) |
| `sample_kit_requests` | **INSERT ONLY** (Request swatch) | **SELECT & UPDATE** (Update tracking number) | **FULL CRUD** |
| `supplier_rate_cards` | None | **SELECT ONLY** (View pricing matrix) | **FULL CRUD** (Update/Import CSV rate cards) |
| `offline_bank_clearances` | None | **INSERT & SELECT** (Log bank clearances) | **FULL CRUD** |
| `plant_settings` | **SELECT ONLY** (View notices/phone) | **SELECT ONLY** | **FULL CRUD** (Update notices, phone, media slots) |
| `audit_logs` | None | **INSERT ONLY** (Log operator actions) | **SELECT ONLY** (Inspect cryptographic audit trails) |

---

## 3. Storage Security & File Ingestion

1. **Bucket `rfq-dielines` & `artwork-uploads`**:
   * Accepts CAD dieline vector formats (`.pdf`, `.ai`, `.eps`, `.svg`, `.zip`).
   * Validated client-side and server-side via binary magic-byte inspection (`%PDF-`, `PNG`, `PK\x03\x04`).
   * Private storage policies enforce isolated upload access.
2. **Bucket `quote-attachments`**:
   * Restricted upload strictly to authenticated `sales` and `superadmin` roles.
   * Accepts official generated PDF documents only.
3. **Bucket `site-media`**:
   * Restricted upload strictly to authenticated `superadmin` role.

---

## 4. API Security, Helmet CSP & Rate Limiting (`server.js`)

1. **Helmet Content Security Policy (CSP)**:
   * `default-src: 'self'`
   * `script-src: 'self' 'unsafe-inline'`
   * `style-src: 'self' 'unsafe-inline' https://fonts.googleapis.com`
   * `font-src: 'self' https://fonts.gstatic.com`
   * `object-src: 'none'`
   * `frame-ancestors: 'none'`
2. **Multi-Tier Rate Limiting**:
   * Global tier: `300 requests / 15 minutes` per IP address.
   * Sensitive endpoint tier (`/api/estimator/calculate`, file uploads): `60 requests / 15 minutes`.
3. **Fail-Closed Authentication**:
   * Middleware strictly rejects requests without valid `Bearer <token>` with `401 Unauthorized`.
4. **CSV Formula Injection Sanitization (`csvSanitizer.js`)**:
   * Escapes leading dangerous characters (`=`, `+`, `-`, `@`, `\t`, `\r`) with a single quote prefix (`'`).

---

## 5. Edge & Network Security Headers (`vercel.json`)

* **Strict-Transport-Security:** `max-age=63072000; includeSubDomains; preload`
* **X-Frame-Options:** `DENY` (Prevents clickjacking).
* **X-Content-Type-Options:** `nosniff` (Blocks MIME-type sniffing).
* **Referrer-Policy:** `strict-origin-when-cross-origin`.
* **Permissions-Policy:** `camera=(), microphone=(), geolocation=()`.

