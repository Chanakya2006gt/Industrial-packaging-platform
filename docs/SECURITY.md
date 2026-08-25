# SECURITY — Industrial Packaging & Operations Platform

**Version:** 2.0  
**Date:** 2026-08-25  
**Classification:** Technical Security Architecture  

---

## 1. Security Architecture & Threat Model

The cloud operations platform enforces Defense-in-Depth across every layer:

```
[ Edge WAF / Cloudflare ] ──► [ Vercel Edge Headers ] ──► [ React Router Guards ] ──► [ Supabase RLS Policies ]
```

---

## 2. Row Level Security (RLS) Matrix on Supabase

| Table | Public Access | Sales Staff (`role: 'sales'`) | SuperAdmin (`role: 'superadmin'`) |
| :--- | :--- | :--- | :--- |
| `profiles` | Read active profiles (minimal) | Read active profiles | **FULL CRUD** (Create, edit, deactivate staff) |
| `rfq_inquiries` | **INSERT ONLY** (Submit RFQ) | **SELECT & UPDATE** (Advance decision gates, attach PDF) | **FULL CRUD** (Override status, delete records) |
| `sample_kit_requests` | **INSERT ONLY** (Request swatch) | **SELECT & UPDATE** (Update tracking number) | **FULL CRUD** |
| `plant_settings` | **SELECT ONLY** (View notices/phone) | **SELECT ONLY** | **FULL CRUD** (Update notices, phone, media slots) |
| `audit_logs` | None | **INSERT ONLY** (Log operator actions) | **SELECT ONLY** (Inspect audit trails) |

---

## 3. Storage Security & File Ingestion

1. **Bucket `rfq-dielines`**:
   * Accepts CAD dieline vector formats (`.pdf`, `.ai`, `.eps`, `.svg`, `.zip`).
   * Rate limited per IP address.
2. **Bucket `quote-attachments`**:
   * Restricted upload strictly to authenticated `sales` and `superadmin` roles.
   * Accepts official generated PDF documents only.
3. **Bucket `site-media`**:
   * Restricted upload strictly to authenticated `superadmin` role.

---

## 4. Edge & Network Security Headers (`vercel.json`)

* **X-Frame-Options:** `DENY` (Prevents clickjacking).
* **X-Content-Type-Options:** `nosniff` (Blocks MIME-type sniffing).
* **Referrer-Policy:** `strict-origin-when-cross-origin`.
* **Permissions-Policy:** `camera=(), microphone=(), geolocation=()`.
