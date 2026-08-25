import React, { useState, useEffect, useMemo } from 'react';
import { 
  Download, LogOut, Layers, Calculator, FileSpreadsheet, 
  DollarSign, Plus, AlertCircle, RefreshCw, BarChart3 
} from 'lucide-react';
import { supabase, RfqInquiry } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { useCorporateMotion } from '../../lib/motion';
import { calculatePackagingEstimate, DEFAULT_RATES } from '../../lib/calculator';
import { computeCrmAnalytics } from '../../lib/crmAnalytics';

// Modular Child Components
import { PipelineList } from './components/PipelineList';
import { CpqEstimatorPanel } from './components/CpqEstimatorPanel';
import { RateCardsTab } from './components/RateCardsTab';
import { OfflineClearanceTab, ClearanceRecord } from './components/OfflineClearanceTab';
import { PaymentClearanceModal } from './components/PaymentClearanceModal';
import { QuickIntakeModal } from './components/QuickIntakeModal';
import { CrmAnalyticsOverview } from './components/CrmAnalyticsOverview';

export const SalesDashboardPage: React.FC = () => {
  useCorporateMotion();
  const { user, profile, signOut } = useAuth();

  // Navigation Tab
  const [activeTab, setActiveTab] = useState<'analytics' | 'pipeline' | 'estimator' | 'rate_cards' | 'offline_clearance'>('analytics');
  
  // Data State
  const [rfqs, setRfqs] = useState<RfqInquiry[]>([]);
  const [clearances, setClearances] = useState<ClearanceRecord[]>([]);
  const [loadingRfqs, setLoadingRfqs] = useState(true);
  const [loadingClearances, setLoadingClearances] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [selectedRfq, setSelectedRfq] = useState<RfqInquiry | null>(null);
  const [supplierRates, setSupplierRates] = useState(DEFAULT_RATES);

  // Estimator State
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

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRfq, setPaymentRfq] = useState<RfqInquiry | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stanbic_wire' | 'zanaco_wire' | 'cheque' | 'cash'>('stanbic_wire');
  const [paymentRefNo, setPaymentRefNo] = useState('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  // Quick Intake Modal State
  const [showQuickIntakeModal, setShowQuickIntakeModal] = useState(false);
  const [intakeCompany, setIntakeCompany] = useState('');
  const [intakeContact, setIntakeContact] = useState('');
  const [intakePhone, setIntakePhone] = useState('');
  const [intakeCategory, setIntakeCategory] = useState<'flexo_labels' | 'offset_packaging'>('flexo_labels');
  const [intakeSubmitting, setIntakeSubmitting] = useState(false);

  // Rate Card CSV Import Message
  const [csvUploadSuccess, setCsvUploadSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoadingRfqs(true);
    setDbError(null);
    try {
      // 1. Query RFQ Inquiries
      const { data: rfqData, error: rfqErr } = await supabase
        .from('rfq_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (rfqErr) {
        setDbError(`Failed to load RFQs: ${rfqErr.message}`);
      } else if (rfqData) {
        setRfqs(rfqData as any);
      }

      // 2. Query Supplier Rate Cards
      const { data: rateData, error: rateErr } = await supabase
        .from('supplier_rate_cards')
        .select('*')
        .eq('is_active', true);

      if (!rateErr && rateData && rateData.length > 0) {
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

      // 3. Query Offline Bank Clearances
      loadClearances();
    } catch (err: any) {
      setDbError(`Network error: ${err.message}`);
    } finally {
      setLoadingRfqs(false);
    }
  };

  const loadClearances = async () => {
    setLoadingClearances(true);
    try {
      const { data, error } = await supabase
        .from('offline_bank_clearances')
        .select('*')
        .order('cleared_at', { ascending: false });

      if (!error && data) {
        setClearances(data as ClearanceRecord[]);
      }
    } catch {
      // Offline fallback
    } finally {
      setLoadingClearances(false);
    }
  };

  // Convert supplierRates map to customRates format for calculator
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

  // Fail-Closed Status Transition Gate
  const handleUpdateStatus = async (rfqId: string, newStatus: string) => {
    setDbError(null);
    try {
      const { error } = await supabase
        .from('rfq_inquiries')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', rfqId);

      if (error) {
        setDbError(`Failed to transition RFQ status: ${error.message}`);
        return;
      }

      setRfqs(rfqs.map(r => r.id === rfqId ? { ...r, status: newStatus as any } : r));
    } catch (err: any) {
      setDbError(`Status transition error: ${err.message}`);
    }
  };

  // Fail-Closed Rate Card Persistence (Triggered on Blur)
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

      if (error) {
        setDbError(`Failed to save rate to database: ${error.message}`);
        return;
      }

      setSupplierRates({
        ...supplierRates,
        [key]: { ...supplierRates[key], pricePerSqm: newRate }
      });
      setDbError(null);
    } catch (err: any) {
      setDbError(`Rate update error: ${err.message}`);
    }
  };

  // Drag-and-Drop CSV Import with Database Persistence
  const handleRateCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        const lines = text.split('\n');
        const upsertRows: any[] = [];
        const localUpdated = { ...supplierRates };

        lines.forEach(line => {
          const parts = line.split(',');
          if (parts.length >= 2) {
            const key = parts[0].trim().toLowerCase().replace(/\s+/g, '_');
            const rate = parseFloat(parts[1].trim());
            if (localUpdated[key] && !isNaN(rate)) {
              localUpdated[key].pricePerSqm = rate;
              upsertRows.push({
                material_key: key,
                material_name: localUpdated[key].name,
                category: localUpdated[key].category,
                cost_per_sqm_zmw: rate,
                updated_at: new Date().toISOString()
              });
            }
          }
        });

        if (upsertRows.length > 0) {
          const { error } = await supabase
            .from('supplier_rate_cards')
            .upsert(upsertRows, { onConflict: 'material_key' });

          if (error) {
            setDbError(`CSV Rate Import DB error: ${error.message}`);
            return;
          }

          setSupplierRates(localUpdated);
          setCsvUploadSuccess(`✓ Successfully updated & persisted ${upsertRows.length} material rate(s) to Supabase`);
          setTimeout(() => setCsvUploadSuccess(null), 5000);
        }
      }
    };
    reader.readAsText(file);
  };

  // Sequential Fail-Closed Offline Bank Payment Clearance
  const handleRecordOfflinePayment = async () => {
    if (!paymentRfq || !paymentRefNo) return;
    setPaymentSubmitting(true);
    setDbError(null);

    try {
      // Step 1: Insert into offline_bank_clearances
      const { error: clearanceErr } = await supabase
        .from('offline_bank_clearances')
        .insert([
          {
            rfq_reference_no: paymentRfq.reference_no,
            company_name: paymentRfq.company_name,
            payment_method: paymentMethod,
            bank_reference_no: paymentRefNo.trim(),
            amount_zmw: paymentAmount,
            cleared_by: profile?.full_name || user?.email || 'Sales Estimator'
          }
        ]);

      if (clearanceErr) {
        setDbError(`Failed to record bank clearance: ${clearanceErr.message}`);
        setPaymentSubmitting(false);
        return;
      }

      // Step 2: Update rfq_inquiries status to settled
      const { error: updateErr } = await supabase
        .from('rfq_inquiries')
        .update({
          status: 'settled',
          settled_at: new Date().toISOString(),
          settled_by: user?.id || null
        })
        .eq('id', paymentRfq.id);

      if (updateErr) {
        setDbError(`Clearance recorded, but failed to update RFQ status: ${updateErr.message}`);
        setPaymentSubmitting(false);
        return;
      }

      // Step 3: Update local state only on confirmed write success
      setRfqs(rfqs.map(r => r.id === paymentRfq.id ? {
        ...r,
        status: 'settled' as any,
        settled_at: new Date().toISOString(),
        settled_by: `${profile?.full_name || 'Staff'} (${paymentMethod.toUpperCase()}: ${paymentRefNo})` as any
      } : r));

      await loadClearances();
      setShowPaymentModal(false);
      setPaymentRefNo('');
      setPaymentSubmitting(false);
    } catch (err: any) {
      setDbError(`Payment recording error: ${err.message}`);
      setPaymentSubmitting(false);
    }
  };

  // Fail-Closed Quick Walk-In Intake Submission
  const handleQuickIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIntakeSubmitting(true);
    setDbError(null);

    const newRef = `RFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInquiryPayload = {
      reference_no: newRef,
      company_name: intakeCompany.trim(),
      contact_name: intakeContact.trim(),
      email: 'walkin@apexconverting.demo',
      phone: intakePhone.trim(),
      industry: 'Commercial / Walk-in',
      category: intakeCategory,
      substrate: 'polypropylene_white',
      dimensions_mm: '85x120',
      quantity: 25000,
      roll_or_sheet: 'roll',
      embellishments: ['uv_varnish'],
      status: 'pending'
    };

    try {
      const { data, error } = await supabase
        .from('rfq_inquiries')
        .insert([newInquiryPayload])
        .select()
        .single();

      if (error) {
        setDbError(`Unable to save walk-in intake: ${error.message}`);
        setIntakeSubmitting(false);
        return;
      }

      const createdRow = data as RfqInquiry;
      setRfqs([createdRow, ...rfqs]);
      setShowQuickIntakeModal(false);
      setIntakeCompany('');
      setIntakeContact('');
      setIntakePhone('');
      setIntakeSubmitting(false);
      handleLoadRfqToEstimator(createdRow);
    } catch (err: any) {
      setDbError(`Intake submission failed: ${err.message}`);
      setIntakeSubmitting(false);
    }
  };

  // CSV Formula-Sanitized Export
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
    a.download = `Apex_Sales_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const crmAnalytics = useMemo(() => {
    return computeCrmAnalytics(rfqs, clearances, customRatesLookup);
  }, [rfqs, clearances, customRatesLookup]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-900/60 text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-400">
              SALES PORTAL
            </span>
            <span className="text-xs font-mono text-slate-500">
              Logged in: <strong className="text-slate-900 dark:text-white">{profile?.full_name || user?.email}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight mt-1">
            Sales & Customer Quotes
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Create custom packaging estimates, track conversion funnels, send quotes via WhatsApp, and manage order payments.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowQuickIntakeModal(true)}
            className="btn-pill btn-pill-primary text-xs font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Quote</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="btn-pill btn-pill-outline text-xs font-mono font-bold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Spreadsheet</span>
          </button>
          <button
            onClick={() => signOut()}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      {dbError && (
        <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-800 text-xs font-mono text-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span><strong>Notice:</strong> {dbError}</span>
          </div>
          <button onClick={() => setDbError(null)} className="text-xs underline hover:text-white cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto text-xs font-mono font-bold">
        {[
          { id: 'analytics', label: 'CRM Analytics', icon: BarChart3 },
          { id: 'pipeline', label: 'Customer Quotes', icon: Layers, count: rfqs.filter(r => r.status === 'pending').length },
          { id: 'estimator', label: 'Price Calculator', icon: Calculator },
          { id: 'rate_cards', label: 'Material Prices', icon: FileSpreadsheet },
          { id: 'offline_clearance', label: 'Payment History', icon: DollarSign, count: clearances.length }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#E00019] text-white text-[10px]">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 0: EXECUTIVE CRM ANALYTICS & INTELLIGENCE */}
      {activeTab === 'analytics' && (
        <CrmAnalyticsOverview
          analytics={crmAnalytics}
          onSelectAccount={(acc) => {
            setCalcCompanyName(acc.companyName);
            setCalcPhone(acc.phone);
            setActiveTab('estimator');
          }}
          onRefresh={loadData}
          loading={loadingRfqs || loadingClearances}
        />
      )}

      {/* TAB 1: PIPELINE & LIVE INQUIRIES DESK */}
      {activeTab === 'pipeline' && (
        <PipelineList
          rfqs={rfqs}
          loading={loadingRfqs}
          onEstimateRfq={handleLoadRfqToEstimator}
          onWhatsAppRfq={(rfq) => {
            setSelectedRfq(rfq);
            handleOpenWhatsAppQuote(rfq);
          }}
          onOpenPaymentModal={(rfq) => {
            setPaymentRfq(rfq);
            setPaymentAmount(calculatePackagingEstimate({
              category: rfq.category as any || 'flexo_labels',
              substrate: rfq.substrate || 'polypropylene_white',
              widthMm: 85,
              heightMm: 120,
              quantity: rfq.quantity || 50000
            }, customRatesLookup).finalGrossPriceZMW);
            setShowPaymentModal(true);
          }}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* TAB 2: PACKAGING CPQ INTERACTIVE ESTIMATOR */}
      {activeTab === 'estimator' && (
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
      )}

      {/* TAB 3: SUPPLIER RATE CARDS */}
      {activeTab === 'rate_cards' && (
        <RateCardsTab
          supplierRates={supplierRates}
          csvUploadSuccess={csvUploadSuccess}
          onRateChange={handleUpdateSingleRate}
          onCsvUpload={handleRateCardUpload}
        />
      )}

      {/* TAB 4: OFFLINE BANK PAYMENT CLEARANCE GATEWAY */}
      {activeTab === 'offline_clearance' && (
        <OfflineClearanceTab
          clearances={clearances}
          loading={loadingClearances}
        />
      )}

      {/* MODAL 1: RECORD OFFLINE BANK PAYMENT MODAL */}
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
          onConfirm={handleRecordOfflinePayment}
        />
      )}

      {/* MODAL 2: QUICK WALK-IN / PHONE INTAKE MODAL */}
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
