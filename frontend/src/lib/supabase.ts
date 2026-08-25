import { createClient } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: 'superadmin' | 'sales';
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export interface RfqInquiry {
  id: string;
  reference_no: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  industry: string;
  category: string;
  substrate: string;
  dimensions_mm: string;
  quantity: number;
  roll_or_sheet: 'roll' | 'sheet';
  roll_core_mm?: number;
  rewind_direction?: number;
  embellishments: string[];
  artwork_file_url?: string;
  artwork_original_name?: string;
  artwork_size_bytes?: number;
  quote_pdf_url?: string;
  quote_pdf_name?: string;
  notes?: string;
  internal_notes?: string;
  assigned_estimator?: string;
  status: 'pending' | 'reviewing' | 'quoted' | 'confirmed' | 'in_production' | 'dispatched' | 'settled' | 'cancelled';
  settled_at?: string;
  settled_by?: string;
  created_at: string;
  updated_at: string;
}

export interface SampleKitRequest {
  id: string;
  reference_no: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  industry: string;
  sample_categories: string[];
  delivery_address: string;
  status: 'pending' | 'dispatched' | 'delivered';
  tracking_number?: string;
  notes?: string;
  created_at: string;
}

export interface PlantSetting {
  key: string;
  value: string;
  description?: string;
  updated_at?: string;
}

export interface CatalogProduct {
  id: string;
  slug: string;
  category: string;
  title: string;
  tagline: string;
  description: string;
  substrate_specs: string[];
  finish_options: string[];
  typical_lead_time: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface AuditLog {
  id: string;
  admin_id?: string;
  action: string;
  ip_address: string;
  user_agent?: string;
  payload_summary?: string;
  created_at: string;
}

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://mock-printfast-supabase.co';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'mock-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
