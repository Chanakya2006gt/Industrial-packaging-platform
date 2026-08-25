import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Settings, Image, ShieldCheck, FileText, Package, 
  Plus, Trash2, CheckCircle, RefreshCw, Upload, LogOut, Check,
  AlertCircle, ArrowRight
} from 'lucide-react';
import { supabase, PlantSetting, Profile, SampleKitRequest, RfqInquiry } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';

export const AdminDashboardPage: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'rfqs' | 'samples' | 'staff' | 'settings' | 'media' | 'audit'>('rfqs');
  const [rfqs, setRfqs] = useState<RfqInquiry[]>([]);
  const [settings, setSettings] = useState<PlantSetting[]>([]);
  const [staffList, setStaffList] = useState<Profile[]>([]);
  const [samples, setSamples] = useState<SampleKitRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  
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

      // 2. Settings
      const { data: setData } = await supabase.from('plant_settings').select('*');
      if (setData) setSettings(setData);

      // 3. Profiles / Staff
      const { data: staffData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (staffData) setStaffList(staffData as any);

      // 4. Sample Kits
      const { data: smpData } = await supabase.from('sample_kit_requests').select('*').order('created_at', { ascending: false });
      if (smpData) setSamples(smpData as any);

      // 5. Audit Logs
      const { data: auditData } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(20);
      if (auditData) setAuditLogs(auditData);
    } catch (err: any) {
      setDbError(`Error loading admin data: ${err.message}`);
    } finally {
      setLoading(false);
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

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
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

  return (
    <div className="min-h-screen bg-[#060910] text-slate-200 font-sans">
      
      {/* Header */}
      <header className="bg-[#0C1220] border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white p-1.5 rounded-xl border border-slate-700 shadow-sm">
            <img src="/assets/logo.svg" alt="Apex Packaging & Converting" className="h-6 w-auto object-contain" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-rose-400">EXECUTIVE MASTER CONSOLE</div>
            <div className="text-xs text-slate-400 font-mono">Logged in as: {profile?.full_name || user?.email} (SuperAdmin)</div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="btn-pill btn-pill-outline text-xs font-mono py-1.5 px-3 flex items-center gap-1.5 text-rose-400 border-rose-900/50 hover:bg-rose-950/40"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Hub</span>
        </button>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-[#0C1220]/70 border-b border-slate-800 px-6 overflow-x-auto">
        <div className="flex gap-4 text-xs font-mono">
          {[
            { id: 'rfqs', label: 'RFQ Pipeline & Overrides', icon: FileText, count: rfqs.length },
            { id: 'samples', label: 'Sample Kit Logistics', icon: Package, count: samples.length },
            { id: 'staff', label: 'Staff & Roles', icon: Users, count: staffList.length },
            { id: 'settings', label: 'Plant Settings', icon: Settings },
            { id: 'media', label: 'Media Assets', icon: Image },
            { id: 'audit', label: 'Security Audit Logs', icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-3 flex items-center gap-2 border-b-2 font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#E00019] text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
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
        <div className="max-w-7xl mx-auto p-4 m-6 rounded-xl bg-rose-950/80 border border-rose-800 text-xs font-mono text-rose-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{dbError}</span>
        </div>
      )}

      {/* Main Tab Views */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* TAB 1: RFQ OVERVIEW & OVERRIDES */}
        {activeTab === 'rfqs' && (
          <div className="double-bezel">
            <div className="double-bezel-inner p-6 space-y-4 bg-[#0C1220]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-base text-white">Full Plant RFQ Pipeline (Executive View)</h3>
                  <p className="text-xs text-slate-400">All customer manufacturing inquiries across 8C Flexo, Heidelberg 6C, and Commercial lines.</p>
                </div>
                <span className="tech-tag tech-tag-crimson text-[10px]">{rfqs.length} Total Inquiries</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Ref No</th>
                      <th className="p-3">Company</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Specs</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Executive Override</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {rfqs.map(r => (
                      <tr key={r.id} className="hover:bg-slate-900/40">
                        <td className="p-3 font-bold text-[#E00019]">{r.reference_no}</td>
                        <td className="p-3 font-bold text-white">{r.company_name} ({r.contact_name})</td>
                        <td className="p-3 text-slate-400">{r.category}</td>
                        <td className="p-3 text-slate-400">{r.dimensions_mm}mm • {r.quantity.toLocaleString()} units</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            r.status === 'settled' ? 'bg-emerald-950 text-emerald-300' :
                            r.status === 'in_production' ? 'bg-cyan-950 text-cyan-300' : 'bg-rose-950 text-rose-300'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={r.status}
                            onChange={(e) => handleUpdateRfqStatus(r.id, e.target.value)}
                            className="p-1.5 rounded bg-slate-900 border border-slate-700 text-[11px] text-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="quoted">Quoted</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="in_production">In Production</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="settled">Settled (Paid)</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SAMPLES */}
        {activeTab === 'samples' && (
          <div className="double-bezel">
            <div className="double-bezel-inner p-6 space-y-4 bg-[#0C1220]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white">Physical Sample Swatch Kit Requests</h3>
                <span className="tech-tag tech-tag-amber text-[10px]">{samples.length} Requests</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Ref No</th>
                      <th className="p-3">Company</th>
                      <th className="p-3">Delivery Address</th>
                      <th className="p-3">Sample Swatches</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {samples.map(s => (
                      <tr key={s.id} className="hover:bg-slate-900/40">
                        <td className="p-3 font-bold text-slate-200">{s.reference_no}</td>
                        <td className="p-3 font-bold text-slate-100">{s.company_name} ({s.contact_name})</td>
                        <td className="p-3 text-slate-400">{s.delivery_address}</td>
                        <td className="p-3 text-slate-400">{Array.isArray(s.sample_categories) ? s.sample_categories.join(', ') : s.sample_categories}</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 uppercase text-[10px]">{s.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STAFF & SALES TEAM */}
        {activeTab === 'staff' && (
          <div className="double-bezel">
            <div className="double-bezel-inner p-6 space-y-6 bg-[#0C1220]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-base text-white">Staff Accounts & Estimator Roles</h3>
                  <p className="text-xs text-slate-400">Manage internal sales and estimator accounts with Supabase RLS profiles.</p>
                </div>
                <span className="tech-tag tech-tag-emerald text-[10px]">{staffList.length} Accounts</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {staffList.map(staff => (
                      <tr key={staff.id} className="hover:bg-slate-900/40">
                        <td className="p-3 font-bold text-white">{staff.full_name}</td>
                        <td className="p-3 text-slate-300">{staff.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            staff.role === 'superadmin' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          }`}>
                            {staff.role}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            staff.is_active ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-500'
                          }`}>
                            {staff.is_active ? 'ACTIVE' : 'DEACTIVATED'}
                          </span>
                        </td>
                        <td className="p-3">
                          {staff.role !== 'superadmin' && (
                            <button
                              onClick={() => handleToggleStaffActive(staff.id, staff.is_active)}
                              className="text-xs text-slate-400 hover:text-white underline"
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
          </div>
        )}

        {/* TAB 4: PLANT SETTINGS */}
        {activeTab === 'settings' && (
          <div className="double-bezel">
            <div className="double-bezel-inner p-6 space-y-6 bg-[#0C1220]">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white">Plant Operational Settings</h3>
                <p className="text-xs text-slate-400">Updates here reflect across the live website and telemetry bar.</p>
              </div>

              <div className="space-y-4 max-w-2xl text-xs font-mono">
                <div>
                  <label className="block text-slate-400 mb-1">Top Bar Operational Notice</label>
                  <input
                    type="text"
                    defaultValue="Plant Status: 24/7 Continuous Shifts • Industrial Packaging Facility"
                    onBlur={(e) => handleUpdateSetting('plant_status_notice', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Estimating Sales Phone</label>
                  <input
                    type="text"
                    defaultValue="+1 (555) 019-2834"
                    onBlur={(e) => handleUpdateSetting('sales_phone', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Plant Location Address</label>
                  <input
                    type="text"
                    defaultValue="1000 Industrial Parkway, Westgate Logistics Park, Metro City"
                    onBlur={(e) => handleUpdateSetting('factory_location', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MEDIA & BRAND LOGO ASSET MANAGER */}
        {activeTab === 'media' && (
          <div className="double-bezel">
            <div className="double-bezel-inner p-6 space-y-6 bg-[#0C1220]">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white">Site Media & Equipment Photography</h3>
                <p className="text-xs text-slate-400">Live production equipment photography and vectors deployed across the plant portal.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { tag: 'PRIMARY LOGO', title: 'Official Brand Vector Logo', src: '/assets/logo.svg', isLogo: true },
                  { tag: '8C UV FLEXO', title: '8-Colour Flexo UV Press', src: '/assets/img/press-flexo-8c.jpg' },
                  { tag: 'HEIDELBERG 6C', title: 'Speedmaster 6C Offset', src: '/assets/img/press-heidelberg-6c.jpg' },
                  { tag: 'CTP CLEANROOM', title: 'Heidelberg Suprasetter CTP', src: '/assets/img/prepress-ctp.jpg' },
                  { tag: '3D BOTTLE', title: '3D Studio Bottle Mockup', src: '/assets/img/mockups/bottle_studio.jpg' },
                  { tag: '3D CARTON', title: '3D Studio Folding Carton', src: '/assets/img/mockups/carton_studio.jpg' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <span className="tech-tag tech-tag-crimson text-[10px]">{item.tag}</span>
                    <div className={`h-32 rounded flex items-center justify-center p-2 border border-slate-700 ${item.isLogo ? 'bg-white' : 'bg-slate-950 overflow-hidden'}`}>
                      <img src={item.src} alt={item.title} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="text-xs font-mono font-bold text-white">{item.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="double-bezel">
            <div className="double-bezel-inner p-6 space-y-4 bg-[#0C1220]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white">Security & Operational Audit Trail</h3>
                <span className="tech-tag tech-tag-cyan text-[10px]">Active</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Operator</th>
                      <th className="p-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {auditLogs.length > 0 ? (
                      auditLogs.map((log, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/40">
                          <td className="p-3 text-slate-400">{new Date(log.created_at).toLocaleString()}</td>
                          <td className="p-3 font-bold text-white">{log.action}</td>
                          <td className="p-3 text-slate-300">{log.operator_email || 'System'}</td>
                          <td className="p-3 text-slate-400">{log.details || 'Standard transaction'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-slate-500">
                          No audit warnings. All system operations operating within normal parameters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
