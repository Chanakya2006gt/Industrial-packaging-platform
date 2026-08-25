import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Settings, Image, ShieldCheck, FileText, Package, 
  Plus, Trash2, CheckCircle, RefreshCw, Upload, LogOut, Check,
  AlertCircle, ArrowRight, Calculator, FileSpreadsheet, Download,
  Layers, Shield, DollarSign
} from 'lucide-react';
import { supabase, PlantSetting, Profile, SampleKitRequest, RfqInquiry } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { calculatePackagingEstimate, DEFAULT_RATES } from '../../lib/calculator';

// Modular Child Components
import { PipelineList } from '../sales/components/PipelineList';
import { CpqEstimatorPanel } from '../sales/components/CpqEstimatorPanel';
import { RateCardsTab } from '../sales/components/RateCardsTab';
import { PaymentClearanceModal } from '../sales/components/PaymentClearanceModal';
import { QuickIntakeModal } from '../sales/components/QuickIntakeModal';

export const AdminDashboardPage: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'rfqs' | 'estimator' | 'rate_cards' | 'samples' | 'staff' | 'settings' | 'media' | 'audit'>('rfqs');
  const [rfqs, setRfqs] = useState<RfqInquiry[]>([]);
  const [settings, setSettings] = useState<PlantSetting[]>([]);
  const [staffList, setStaffList] = useState<Profile[]>([]);
  const [samples, setSamples] = useState<SampleKitRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [supplierRates, setSupplierRates] = useState(DEFAULT_RATES);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  
  // Estimator State
  const [selectedRfq, setSelectedRfq] = useState<RfqInquiry | null>(null);
  const [calcCategory, setCalcCategory] = useState<'flexo_labels' | 'offset_packaging' | 'commercial_print'>('flexo_labels');
  const [calcSubstrate, setCalcSubstrate] = useState('polypropylene_white');
  const [calcWidthMm, setCalcWidthMm] = useState(85);
  const [calcHeightMm, setCalcHeightMm] = useState(120);
  const [calcQuantity, setCalcQuantity] = useState(50000);
  const [calcMarginPercent, setCalcMarginPercent] = useState(25);
  const [calcWaiveTooling, setCalcWaiveTooling] = useState(false);
  const [calcEmbellishments, setCalcEmbellishments] = useState<string[]>(['uv_varnish']);
  const [calcCompanyName, setCalcCompanyName] = useState('');
  const [calcPhone, setCalcPhone] = useState('');

  // Payment Clearance Modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRfq, setPaymentRfq] = useState<RfqInquiry | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stanbic_wire' | 'zanaco_wire' | 'cheque' | 'cash'>('stanbic_wire');
  const [paymentRefNo, setPaymentRefNo] = useState('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  // Quick Intake Modal Form
  const [showQuickIntakeModal, setShowQuickIntakeModal] = useState(false);
  const [intakeCompany, setIntakeCompany] = useState('');
  const [intakeContact, setIntakeContact] = useState('');
  const [intakePhone, setIntakePhone] = useState('');
  const [intakeCategory, setIntakeCategory] = useState<'flexo_labels' | 'offset_packaging'>('flexo_labels');
  const [intakeSubmitting, setIntakeSubmitting] = useState(false);

  // New Staff Modal Form
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'sales' | 'superadmin'>('sales');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setDbError(null);
    try {
      // 1. RFQs
      const { data: rfqData } = await supabase
        .from('rfq_inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (rfqData) setRfqs(rfqData as any);

      // 2. Rate Cards
      const { data: rateData } = await supabase
        .from('supplier_rate_cards')
        .select('*')
        .eq('is_active', true);

      if (rateData && rateData.length > 0) {
        const loadedRates: Record<string, any> = { ...DEFAULT_RATES };
        rateData.forEach((row: any) => {
          if (loadedRates[row.material_key]) {
            loadedRates[row.material_key].pricePerSqm = Number(row.cost_per_sqm_zmw);
          } else {
            loadedRates[row.material_key] = {
              name: row.material_name,
              category: row.category,
              pricePerSqm: Number(row.cost_per_sqm_zmw)
            };
          }
        });
        setSupplierRates(loadedRates);
      }

      // 3. Settings
      const { data: setData } = await supabase.from('plant_settings').select('*');
      if (setData) setSettings(setData);

      // 4. Profiles / Staff
      const { data: staffData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (staffData) setStaffList(staffData as any);

      // 5. Sample Kits
      const { data: smpData } = await supabase.from('sample_kit_requests').select('*').order('created_at', { ascending: false });
      if (smpData) setSamples(smpData as any);

      // 6. Audit Logs
      const { data: auditData } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(25);
      if (auditData) setAuditLogs(auditData);
    } catch (err: any) {
      setDbError(`Error loading admin data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const customRatesLookup = Object.fromEntries(
    Object.entries(supplierRates).map(([k, v]) => [k, v.pricePerSqm])
  );

  const currentCalc = calculatePackagingEstimate({
    category: calcCategory,
    substrate: calcSubstrate,
    widthMm: calcWidthMm,
    heightMm: calcHeightMm,
    quantity: calcQuantity,
    marginPercent: calcMarginPercent,
    embellishments: calcEmbellishments,
    waiveTooling: calcWaiveTooling
  }, customRatesLookup);

  const handleLoadRfqToEstimator = (rfq: RfqInquiry) => {
    setSelectedRfq(rfq);
    setCalcCompanyName(rfq.company_name);
    setCalcPhone(rfq.phone || '');
    setCalcCategory(rfq.category as any || 'flexo_labels');
    setCalcQuantity(rfq.quantity || 50000);
    
    if (rfq.dimensions_mm) {
      const parts = rfq.dimensions_mm.split('x');
      if (parts.length >= 2) {
        setCalcWidthMm(Number(parts[0]) || 85);
        setCalcHeightMm(Number(parts[1]) || 120);
      }
    }
    setActiveTab('estimator');
  };

  const handleOpenWhatsAppQuote = (targetRfq?: RfqInquiry) => {
    const phone = targetRfq?.phone || calcPhone || selectedRfq?.phone || '';
    const company = targetRfq?.company_name || calcCompanyName || selectedRfq?.company_name || 'Client';
    const ref = targetRfq?.reference_no || selectedRfq?.reference_no || 'RFQ-QUOTE';
    const phoneClean = phone.replace(/[^0-9]/g, '');

    const message = encodeURIComponent(
      `*APEX PACKAGING & CONVERTING — OFFICIAL B2B ESTIMATE*\n` +
      `-------------------------------------------\n` +
      `*Client:* ${company}\n` +
      `*Category:* ${calcCategory === 'flexo_labels' ? '8C UV Flexo Labels' : 'Offset Folding Cartons'}\n` +
      `*Specs:* ${calcWidthMm}mm × ${calcHeightMm}mm (${calcQuantity.toLocaleString()} units)\n` +
      `*Substrate:* ${supplierRates[calcSubstrate]?.name}\n` +
      `*Production:* ~${currentCalc.linearMeters.toLocaleString()}m (~${currentCalc.numberOfRolls} rolls)\n` +
      `-------------------------------------------\n` +
      `*Net Manufacturing Total:* ZMW ${currentCalc.netPriceZMW.toLocaleString()}\n` +
      `*VAT (16%):* ZMW ${currentCalc.vatZMW.toLocaleString()}\n` +
      `*FINAL GROSS QUOTE:* *ZMW ${currentCalc.finalGrossPriceZMW.toLocaleString()}*\n` +
      `*Unit Price:* *ZMW ${currentCalc.unitPriceZMW.toFixed(4)} / unit*\n` +
      `-------------------------------------------\n` +
      `*Turnaround:* 3–5 working days (24/7 continuous shift)\n` +
      `*Plant Location:* 1000 Industrial Parkway, Westgate Logistics Park\n` +
      `*Official Ref:* ${ref}`
    );

    window.open(`https://wa.me/${phoneClean || '15550192834'}?text=${message}`, '_blank');
  };

  const handleOpenPaymentModal = (rfq: RfqInquiry) => {
    setPaymentRfq(rfq);
    setPaymentRefNo(`PAY-${Date.now().toString().slice(-6)}`);
    setPaymentAmount(calculatePackagingEstimate({
      category: rfq.category as any || 'flexo_labels',
      substrate: rfq.substrate || 'polypropylene_white',
      widthMm: 85,
      heightMm: 120,
      quantity: rfq.quantity || 50000
    }, customRatesLookup).finalGrossPriceZMW);
    setShowPaymentModal(true);
  };

  const handleSubmitPaymentClearance = async () => {
    if (!paymentRfq) return;

    setPaymentSubmitting(true);
    try {
      const { error: clearErr } = await supabase
        .from('offline_payment_clearances')
        .insert([{
          rfq_id: paymentRfq.id,
          reference_no: paymentRfq.reference_no,
          company_name: paymentRfq.company_name,
          payment_method: paymentMethod,
          payment_reference: paymentRefNo,
          amount_zmw: paymentAmount,
          cleared_by: profile?.full_name || user?.email || 'SuperAdmin'
        }]);

      await supabase
        .from('rfq_inquiries')
        .update({ status: 'settled', updated_at: new Date().toISOString() })
        .eq('id', paymentRfq.id);

      setRfqs(rfqs.map(r => r.id === paymentRfq.id ? { ...r, status: 'settled' } : r));
      setShowPaymentModal(false);
    } catch (err: any) {
      setDbError(`Failed to record clearance: ${err.message}`);
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const handleQuickIntakeSubmit = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    setIntakeSubmitting(true);
    try {
      const newRefNo = `RFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newInquiryPayload = {
        reference_no: newRefNo,
        company_name: intakeCompany,
        contact_name: intakeContact,
        phone: intakePhone,
        category: intakeCategory,
        quantity: 50000,
        dimensions_mm: '85x120',
        status: 'pending',
        notes: 'Walk-in phone intake entered via Executive Admin Console'
      };

      const { data, error } = await supabase
        .from('rfq_inquiries')
        .insert([newInquiryPayload])
        .select()
        .single();

      if (!error && data) {
        setRfqs([data as RfqInquiry, ...rfqs]);
        setShowQuickIntakeModal(false);
        setIntakeCompany('');
        setIntakeContact('');
        setIntakePhone('');
        handleLoadRfqToEstimator(data as RfqInquiry);
      }
    } catch (err: any) {
      setDbError(`Intake error: ${err.message}`);
    } finally {
      setIntakeSubmitting(false);
    }
  };

  const handleUpdateSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase.from('plant_settings').upsert({ key, value });
      if (!error) {
        setSettings(settings.map(s => s.key === key ? { ...s, value } : s));
      }
    } catch {}
  };

  const handleToggleStaffActive = async (staffId: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentActive })
        .eq('id', staffId);

      if (!error) {
        setStaffList(staffList.map(s => s.id === staffId ? { ...s, is_active: !currentActive } : s));
      }
    } catch {}
  };

  const handleUpdateRfqStatus = async (rfqId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('rfq_inquiries')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', rfqId);

      if (!error) {
        setRfqs(rfqs.map(r => r.id === rfqId ? { ...r, status: newStatus as any } : r));
      }
    } catch {}
  };

  const handleUpdateSingleRate = async (key: string, newRate: number) => {
    try {
      const { error } = await supabase
        .from('supplier_rate_cards')
        .upsert({
          material_key: key,
          material_name: supplierRates[key]?.name || key,
          category: supplierRates[key]?.category || 'General',
          cost_per_sqm_zmw: newRate,
          updated_at: new Date().toISOString()
        }, { onConflict: 'material_key' });

      if (!error) {
        setSupplierRates({
          ...supplierRates,
          [key]: { ...supplierRates[key], pricePerSqm: newRate }
        });
      }
    } catch {}
  };

  const handleRateCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target?.result as string;
      const lines = content.split('\n').filter(l => l.trim().length > 0);
      const updatedMap = { ...supplierRates };

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.replace(/"/g, '').trim());
        if (parts.length >= 3) {
          const [key, name, rateStr, category] = parts;
          const rateNum = parseFloat(rateStr);
          if (key && !isNaN(rateNum)) {
            updatedMap[key] = {
              name: name || key,
              category: category || 'Raw Material',
              pricePerSqm: rateNum
            };
            await supabase.from('supplier_rate_cards').upsert({
              material_key: key,
              material_name: name || key,
              category: category || 'Raw Material',
              cost_per_sqm_zmw: rateNum,
              updated_at: new Date().toISOString()
            }, { onConflict: 'material_key' });
          }
        }
      }
      setSupplierRates(updatedMap);
    };
    reader.readAsText(file);
  };

  const handleExportCsv = () => {
    const headers = ['Ref No', 'Company', 'Contact', 'Phone', 'Category', 'Quantity', 'Status', 'Date'];
    const rows = rfqs.map(r => [
      r.reference_no,
      r.company_name.startsWith('=') || r.company_name.startsWith('+') ? `'${r.company_name}` : r.company_name,
      r.contact_name,
      r.phone,
      r.category,
      r.quantity,
      r.status,
      new Date(r.created_at).toLocaleDateString()
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.map(c => `"${c || ''}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Apex_Executive_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B12] text-slate-900 dark:text-slate-100 font-sans transition-colors pb-16">
      
      {/* Top Header & Telemetry */}
      <header className="bg-white dark:bg-[#0C1220] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
            <img src="/assets/logo.svg" alt="Apex Packaging & Converting" className="h-7 w-auto object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-[10px] font-mono font-bold text-[#E00019] dark:text-rose-400">
                EXECUTIVE MASTER CONSOLE
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                SUPERADMIN
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Logged in: <strong className="text-slate-900 dark:text-white">{profile?.full_name || user?.email}</strong>
            </div>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowQuickIntakeModal(true)}
            className="btn-pill btn-pill-primary text-xs font-bold shadow-md cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Quick Walk-in Quote</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="btn-pill btn-pill-outline text-xs font-mono font-bold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => signOut()}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 hover:text-[#E00019] transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white/80 dark:bg-[#0C1220]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 overflow-x-auto sticky top-[73px] z-20">
        <div className="flex gap-2 text-xs font-mono">
          {[
            { id: 'rfqs', label: 'RFQ Pipeline & SLA', icon: FileText, count: rfqs.length },
            { id: 'estimator', label: 'CPQ Packaging Estimator', icon: Calculator },
            { id: 'rate_cards', label: 'Supplier Rate Cards', icon: DollarSign },
            { id: 'samples', label: 'Sample Kit Logistics', icon: Package, count: samples.length },
            { id: 'staff', label: 'Staff & Roles', icon: Users, count: staffList.length },
            { id: 'settings', label: 'Plant Settings', icon: Settings },
            { id: 'media', label: 'Media Assets', icon: Image },
            { id: 'audit', label: 'Security Audit Logs', icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-3 flex items-center gap-2 border-b-2 font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#E00019] text-[#E00019] dark:text-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-[#E00019] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Global Error Banner */}
      {dbError && (
        <div className="max-w-7xl mx-auto p-4 m-6 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-xs font-mono text-rose-800 dark:text-rose-200 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#E00019] dark:text-rose-400 shrink-0" />
            <span><strong>Database Notification:</strong> {dbError}</span>
          </div>
          <button onClick={() => setDbError(null)} className="underline hover:opacity-80">Dismiss</button>
        </div>
      )}

      {/* Main Tab Views */}
      <main className="max-w-7xl mx-auto p-4 sm:p-8 space-y-6">
        
        {/* TAB 1: RFQ OVERVIEW & SLA MONITOR */}
        {activeTab === 'rfqs' && (
          <div className="bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-950 dark:text-white tracking-tight">
                  Full Plant RFQ Pipeline (Executive SLA Monitor)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Live manufacturing inquiries with 4-hour countdown timers, dieline CAD inspection, and WhatsApp quote dispatch.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs font-mono font-bold text-[#E00019] dark:text-rose-400">
                {rfqs.length} Total Inquiries
              </span>
            </div>

            <PipelineList
              rfqs={rfqs}
              loading={loading}
              onEstimateRfq={handleLoadRfqToEstimator}
              onWhatsAppRfq={(rfq) => {
                setSelectedRfq(rfq);
                handleOpenWhatsAppQuote(rfq);
              }}
              onOpenPaymentModal={(rfq) => {
                setPaymentRfq(rfq);
                setPaymentRefNo(`PAY-${Date.now().toString().slice(-6)}`);
                setPaymentAmount(calculatePackagingEstimate({
                  category: rfq.category as any || 'flexo_labels',
                  substrate: rfq.substrate || 'polypropylene_white',
                  widthMm: 85,
                  heightMm: 120,
                  quantity: rfq.quantity || 50000
                }, customRatesLookup).finalGrossPriceZMW);
                setShowPaymentModal(true);
              }}
              onUpdateStatus={handleUpdateRfqStatus}
            />
          </div>
        )}

        {/* TAB 2: INTERACTIVE CPQ ESTIMATOR TOOL */}
        {activeTab === 'estimator' && (
          <div className="bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
            <CpqEstimatorPanel
              calcCompanyName={calcCompanyName}
              setCalcCompanyName={setCalcCompanyName}
              calcPhone={calcPhone}
              setCalcPhone={setCalcPhone}
              calcCategory={calcCategory}
              setCalcCategory={setCalcCategory}
              calcSubstrate={calcSubstrate}
              setCalcSubstrate={setCalcSubstrate}
              calcWidthMm={calcWidthMm}
              setCalcWidthMm={setCalcWidthMm}
              calcHeightMm={calcHeightMm}
              setCalcHeightMm={setCalcHeightMm}
              calcQuantity={calcQuantity}
              setCalcQuantity={setCalcQuantity}
              calcMarginPercent={calcMarginPercent}
              setCalcMarginPercent={setCalcMarginPercent}
              calcWaiveTooling={calcWaiveTooling}
              setCalcWaiveTooling={setCalcWaiveTooling}
              supplierRates={supplierRates}
              currentCalc={currentCalc}
              selectedRefNo={selectedRfq?.reference_no}
              onOpenWhatsApp={() => handleOpenWhatsAppQuote()}
            />
          </div>
        )}

        {/* TAB 3: SUPPLIER RATE CARDS */}
        {activeTab === 'rate_cards' && (
          <div className="bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
            <RateCardsTab
              supplierRates={supplierRates}
              csvUploadSuccess={null}
              onRateChange={handleUpdateSingleRate}
              onCsvUpload={handleRateCardUpload}
            />
          </div>
        )}

        {/* TAB 4: SAMPLES */}
        {activeTab === 'samples' && (
          <div className="bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-950 dark:text-white tracking-tight">
                  Physical Sample Swatch Kit Requests
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Courier dispatch tracking for prospective clients requesting physical substrate sample boxes.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                {samples.length} Requests
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Ref No</th>
                    <th className="p-3">Company</th>
                    <th className="p-3">Delivery Address</th>
                    <th className="p-3">Sample Swatches</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {samples.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-[#E00019]">{s.reference_no}</td>
                      <td className="p-3 font-bold text-slate-950 dark:text-white">{s.company_name} ({s.contact_name})</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{s.delivery_address}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{Array.isArray(s.sample_categories) ? s.sample_categories.join(', ') : s.sample_categories}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 uppercase text-[10px] font-bold">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: STAFF & SALES TEAM */}
        {activeTab === 'staff' && (
          <div className="bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-950 dark:text-white tracking-tight">
                  Staff Accounts & Estimator Roles
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Manage internal sales and estimator accounts with Supabase RLS profiles.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {staffList.length} Accounts
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {staffList.map(staff => (
                    <tr key={staff.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-slate-950 dark:text-white">{staff.full_name}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{staff.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          staff.role === 'superadmin' 
                            ? 'bg-rose-100 dark:bg-rose-950 text-[#E00019] dark:text-rose-300 border border-rose-200 dark:border-rose-800' 
                            : 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800'
                        }`}>
                          {staff.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          staff.is_active ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {staff.is_active ? 'ACTIVE' : 'DEACTIVATED'}
                        </span>
                      </td>
                      <td className="p-3">
                        {staff.role !== 'superadmin' && (
                          <button
                            onClick={() => handleToggleStaffActive(staff.id, staff.is_active)}
                            className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-[#E00019] underline cursor-pointer"
                          >
                            {staff.is_active ? 'Deactivate' : 'Reactivate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: PLANT SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="font-extrabold text-lg text-slate-950 dark:text-white tracking-tight">
                Plant Operational Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Updates here reflect immediately across the public telemetry banner, footer, and contact channels.
              </p>
            </div>

            <div className="space-y-4 max-w-2xl text-xs font-mono">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">Top Bar Operational Notice</label>
                <input
                  type="text"
                  defaultValue="Plant Status: 24/7 Continuous Shifts • Industrial Packaging Facility"
                  onBlur={(e) => handleUpdateSetting('plant_status_notice', e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">Estimating Sales Hotline</label>
                <input
                  type="text"
                  defaultValue="+1 (555) 019-2834"
                  onBlur={(e) => handleUpdateSetting('sales_phone', e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">Manufacturing Facility Address</label>
                <input
                  type="text"
                  defaultValue="1000 Industrial Parkway, Westgate Logistics Park, Metro City"
                  onBlur={(e) => handleUpdateSetting('factory_location', e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-950 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: MEDIA & BRAND ASSET MANAGER */}
        {activeTab === 'media' && (
          <div className="bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="font-extrabold text-lg text-slate-950 dark:text-white tracking-tight">
                Production Media & Machinery Photography
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Active equipment assets and vector diagrams deployed across the public portal and B2B configurator.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { tag: 'PRIMARY LOGO', title: 'Official Brand Vector Logo', src: '/assets/logo.svg', isLogo: true },
                { tag: '8C UV FLEXO', title: '8-Colour Flexo UV Press', src: '/assets/img/press-flexo-8c.jpg' },
                { tag: 'HEIDELBERG 6C', title: 'Speedmaster 6C Offset Press', src: '/assets/img/press-heidelberg-6c.jpg' },
                { tag: 'CTP CLEANROOM', title: 'Heidelberg Suprasetter CTP', src: '/assets/img/prepress-ctp.jpg' },
                { tag: '3D BOTTLE', title: '3D Studio Bottle Mockup', src: '/assets/img/mockups/bottle_studio.jpg' },
                { tag: '3D CARTON', title: '3D Studio Folding Box Carton', src: '/assets/img/mockups/carton_studio.jpg' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                  <span className="tech-tag tech-tag-crimson text-[10px]">{item.tag}</span>
                  <div className={`h-36 rounded-xl flex items-center justify-center p-3 border border-slate-200 dark:border-slate-800 ${item.isLogo ? 'bg-white' : 'bg-slate-950 overflow-hidden'}`}>
                    <img src={item.src} alt={item.title} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-950 dark:text-white tracking-tight">
                  Security & Operational Audit Trail
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Immutable chronological log of price updates, role assignments, and executive status overrides.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-900/60 text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400">
                Live Audit Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Operator</th>
                    <th className="p-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {auditLogs.length > 0 ? (
                    auditLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                        <td className="p-3 text-slate-500 dark:text-slate-400">{new Date(log.created_at).toLocaleString()}</td>
                        <td className="p-3 font-bold text-slate-950 dark:text-white">{log.action}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">{log.operator_email || 'System'}</td>
                        <td className="p-3 text-slate-500 dark:text-slate-400">{log.details || 'Standard transaction'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">
                        No critical security alerts. All plant operations operating within nominal parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Payment Clearance Modal */}
      {showPaymentModal && paymentRfq && (
        <PaymentClearanceModal
          rfq={paymentRfq}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          paymentRefNo={paymentRefNo}
          setPaymentRefNo={setPaymentRefNo}
          paymentAmount={paymentAmount}
          setPaymentAmount={setPaymentAmount}
          submitting={paymentSubmitting}
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handleSubmitPaymentClearance}
        />
      )}

      {/* Quick Intake Modal */}
      {showQuickIntakeModal && (
        <QuickIntakeModal
          intakeCompany={intakeCompany}
          setIntakeCompany={setIntakeCompany}
          intakeContact={intakeContact}
          setIntakeContact={setIntakeContact}
          intakePhone={intakePhone}
          setIntakePhone={setIntakePhone}
          intakeCategory={intakeCategory}
          setIntakeCategory={setIntakeCategory}
          submitting={intakeSubmitting}
          onClose={() => setShowQuickIntakeModal(false)}
          onSubmit={handleQuickIntakeSubmit}
        />
      )}

    </div>
  );
};

