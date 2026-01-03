
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Search, RefreshCw, Building2, Megaphone, Settings, ListChecks, Edit3, Save, X, Trash2, Send, Download, Upload, Image as ImageIcon, Users, Mail, Bell, CheckCircle2, AlertTriangle, CreditCard, DollarSign
} from 'lucide-react';
import { Plan, Business } from '../types';
import { SUPABASE_URL, SUPABASE_ANON_KEY, GOOGLE_WALLET_ISSUER_ID } from '../App';
import { PLANS as DEFAULT_PLANS } from '../constants';

interface SuperAdminProps {
  plans: Plan[];
  setPlans: (plans: Plan[]) => void;
  landingBg: string;
  setLandingBg: (url: string) => void;
  notify: (msg: string, type?: any) => void;
}

const SuperAdmin: React.FC<SuperAdminProps> = ({ plans, setPlans, landingBg, setLandingBg, notify }) => {
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'plans' | 'marketing' | 'settings'>('directory');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingBiz, setEditingBiz] = useState<Business | null>(null);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  
  // Marketing States
  const [broadcastTarget, setBroadcastTarget] = useState<'all' | 'active' | 'trial'>('all');
  const [broadcastData, setBroadcastData] = useState({ subject: '', message: '' });

  useEffect(() => { fetchMasterData(); }, [activeSubTab]);

  const fetchMasterData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/cc_businesses?select=*&order=created_at.desc`, {
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setBusinesses(data);
    } catch (err) { notify("Error al sincronizar datos maestros", "error"); }
    finally { setLoading(false); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    notify('Subiendo imagen maestra...', 'info');
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        const binary = atob(base64Data);
        const array = [];
        for (let i = 0; i < binary.length; i++) array.push(binary.charCodeAt(i));
        const blob = new Blob([new Uint8Array(array)], { type: file.type });
        
        const path = `master/bg-${Date.now()}.png`;
        const res = await fetch(`${SUPABASE_URL}/storage/v1/object/images/${path}`, {
          method: 'POST',
          headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': file.type },
          body: blob
        });
        
        if (res.ok) {
          const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/images/${path}`;
          setLandingBg(publicUrl);
          localStorage.setItem('cc_master_bg', publicUrl);
          notify('Fondo de Landing actualizado con éxito', 'success');
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      notify('Error al subir archivo', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    const newPlans = plans.map(p => p.id === editingPlan.id ? editingPlan : p);
    setPlans(newPlans);
    setEditingPlan(null);
    notify('Reglas del plan actualizadas globalmente', 'success');
  };

  const loadTemplate = (type: 'promo' | 'maint' | 'feature') => {
    const templates = {
      promo: { subject: '¡Nueva promoción global disponible!', message: 'Hola locatario, hemos activado una nueva herramienta de descuentos...' },
      maint: { subject: 'Mantenimiento Programado Charlitron', message: 'Estimado socio, el día de mañana realizaremos mejoras en el servidor...' },
      feature: { subject: '¡Ya puedes subir fotos desde tu PC!', message: 'Hemos actualizado el panel para que gestiones mejor tus imágenes...' }
    };
    setBroadcastData(templates[type]);
  };

  const filteredBusinesses = businesses.filter(b => {
    if (broadcastTarget === 'active') return b.status === 'active';
    if (broadcastTarget === 'trial') return b.status === 'trial';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 space-y-12 animate-in fade-in">
      {/* BANNER MAESTRO ACTUALIZADO CON GOOGLE WALLET STATUS */}
      <div className="bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-14 text-white shadow-2xl border-b-[15px] border-emerald-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
           <div className="text-center md:text-left">
             <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <ShieldCheck className="text-emerald-500 w-6 h-6 md:w-8 md:h-8" />
                <span className="text-emerald-500 font-black uppercase text-[8px] md:text-[10px] tracking-[0.4em]">Google Wallet Integrated</span>
             </div>
             <h1 className="text-3xl md:text-6xl font-black tracking-tighter italic">Charlitron <span className="text-blue-500">Maestro</span></h1>
           </div>
           <div className="flex flex-wrap justify-center md:justify-end gap-3 md:gap-4">
              <div className="bg-white/5 px-6 py-4 md:px-8 md:py-5 rounded-[2rem] border border-white/5 text-center min-w-[140px] md:min-w-[180px] backdrop-blur-md">
                 <p className="text-[8px] md:text-[9px] font-black uppercase opacity-40 mb-1">Locatarios</p>
                 <p className="text-2xl md:text-4xl font-black text-blue-400">{businesses.length}</p>
              </div>
              <div className="bg-emerald-500/10 px-6 py-4 md:px-8 md:py-5 rounded-[2rem] border border-emerald-500/20 text-center min-w-[140px] md:min-w-[180px] backdrop-blur-md">
                 <p className="text-[8px] md:text-[9px] font-black uppercase text-emerald-400 mb-1 tracking-widest">Google API</p>
                 <p className="text-sm md:text-xl font-black text-white flex items-center justify-center gap-2"><CreditCard size={16} className="text-emerald-400" /> ACTIVA</p>
              </div>
              <button onClick={fetchMasterData} className="bg-blue-600 p-4 md:p-6 rounded-2xl md:rounded-3xl hover:bg-blue-500 transition shadow-xl active:scale-90"><RefreshCw size={24} className={loading ? 'animate-spin' : ''}/></button>
           </div>
        </div>
      </div>

      {/* NAV MAESTRA - Scroll horizontal en móvil */}
      <div className="flex gap-2 bg-slate-100 p-2 rounded-[2rem] md:rounded-[2.8rem] border border-slate-200 shadow-inner overflow-x-auto no-scrollbar">
         <SubTabButton active={activeSubTab === 'directory'} onClick={() => setActiveSubTab('directory')} icon={Building2} label="Directorio" />
         <SubTabButton active={activeSubTab === 'plans'} onClick={() => setActiveSubTab('plans')} icon={ListChecks} label="Planes" />
         <SubTabButton active={activeSubTab === 'marketing'} onClick={() => setActiveSubTab('marketing')} icon={Megaphone} label="Broadcast" />
         <SubTabButton active={activeSubTab === 'settings'} onClick={() => setActiveSubTab('settings')} icon={Settings} label="Ajustes" />
      </div>

      <div className="min-h-[500px]">
        {activeSubTab === 'directory' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-5">
             <div className="relative group">
               <Search className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition" size={20} />
               <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Buscar por negocio, email..." className="w-full bg-white border-2 border-slate-50 p-6 md:p-8 pl-16 md:pl-20 rounded-[2rem] md:rounded-[3rem] shadow-xl outline-none font-bold focus:border-blue-600 transition" />
             </div>
             <div className="bg-white rounded-[2rem] md:rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[600px]">
                     <thead className="bg-slate-50 border-b text-[10px] font-black uppercase text-slate-400 tracking-widest"><tr className="px-10 py-6"><th className="px-6 md:px-10 py-6 md:py-8">Sucursal / Dueño</th><th className="px-6 md:px-10 py-6 md:py-8">Nivel Plan</th><th className="px-6 md:px-10 py-6 md:py-8">Suscripción</th><th className="px-6 md:px-10 py-6 md:py-8 text-right">Gestión</th></tr></thead>
                     <tbody className="divide-y">
                        {businesses.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.email.toLowerCase().includes(searchQuery.toLowerCase())).map(biz => (
                           <tr key={biz.id} className="hover:bg-blue-50/20 transition group">
                              <td className="px-6 md:px-10 py-6 md:py-10">
                                <div className="flex items-center gap-4">
                                  <img src={biz.logo_url} className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl object-cover shadow-md" />
                                  <div className="max-w-[150px] md:max-w-none truncate">
                                    <p className="font-black text-sm md:text-lg truncate">{biz.name}</p>
                                    <p className="text-[8px] md:text-[10px] opacity-40 font-bold tracking-tight truncate">{biz.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 md:px-10 py-6 md:py-10 font-black text-blue-600 uppercase text-[10px] md:text-xs tracking-widest">{biz.plan_id.replace('plan_','')}</td>
                              <td className="px-6 md:px-10 py-6 md:py-10"><StatusBadge status={biz.status} /></td>
                              <td className="px-6 md:px-10 py-6 md:py-10 text-right"><button onClick={() => setEditingBiz(biz)} className="bg-slate-900 text-white p-3 md:p-5 rounded-xl md:rounded-2xl hover:bg-blue-600 transition shadow-md active:scale-90"><Edit3 size={18}/></button></td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
                </div>
             </div>
          </div>
        )}

        {activeSubTab === 'plans' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 animate-in zoom-in">
             {Array.isArray(plans) && plans.map(p => (
               <div key={p.id} className="bg-white p-10 md:p-14 rounded-[3rem] md:rounded-[4.5rem] border border-slate-100 shadow-2xl text-center flex flex-col items-center group hover:-translate-y-2 transition-all">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-50 text-blue-600 rounded-3xl md:rounded-[2.5rem] flex items-center justify-center mb-6 md:mb-8 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500"><ListChecks size={32}/></div>
                  <h3 className="text-2xl md:text-3xl font-black mb-2 italic tracking-tighter uppercase">{p.name}</h3>
                  <div className="text-4xl md:text-6xl font-black text-blue-600 mb-8 md:mb-10 tracking-tighter">{p.price}</div>
                  <button onClick={() => setEditingPlan(p)} className="w-full bg-slate-900 text-white py-5 md:py-6 rounded-2xl md:rounded-3xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-blue-600 transition shadow-xl cursor-pointer">EDITAR REGLAS</button>
               </div>
             ))}
          </div>
        )}

        {activeSubTab === 'marketing' && (
          <div className="space-y-10 animate-in fade-in">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 shadow-2xl space-y-8">
                   <h3 className="text-xl font-black italic tracking-tighter flex items-center gap-3"><Users className="text-blue-600"/> Audiencia</h3>
                   <div className="space-y-3">
                      <TargetButton active={broadcastTarget === 'all'} onClick={() => setBroadcastTarget('all')} label="Todos" count={businesses.length} />
                      <TargetButton active={broadcastTarget === 'active'} onClick={() => setBroadcastTarget('active')} label="Suscritos" count={businesses.filter(b => b.status === 'active').length} color="emerald" />
                      <TargetButton active={broadcastTarget === 'trial'} onClick={() => setBroadcastTarget('trial')} label="En Prueba" count={businesses.filter(b => b.status === 'trial').length} color="amber" />
                   </div>
                   <div className="pt-6 border-t border-slate-50">
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Atajos</p>
                      <div className="flex flex-wrap gap-2">
                         <button onClick={() => loadTemplate('promo')} className="px-4 py-2 bg-slate-50 rounded-full text-[9px] font-black uppercase hover:bg-blue-100 transition">Promo</button>
                         <button onClick={() => loadTemplate('maint')} className="px-4 py-2 bg-slate-50 rounded-full text-[9px] font-black uppercase hover:bg-rose-100 transition">Soporte</button>
                         <button onClick={() => loadTemplate('feature')} className="px-4 py-2 bg-slate-50 rounded-full text-[9px] font-black uppercase hover:bg-emerald-100 transition">Update</button>
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-slate-100 shadow-2xl space-y-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5"><Megaphone size={120} /></div>
                   <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter">Command <span className="text-blue-600">Center</span></h2>
                   <div className="space-y-6 relative z-10">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Asunto</label>
                        <input value={broadcastData.subject} onChange={e => setBroadcastData({...broadcastData, subject: e.target.value})} placeholder="Ej: Actualización Importante" className="w-full bg-slate-50 p-6 md:p-7 rounded-2xl md:rounded-3xl font-black shadow-inner border-2 border-transparent focus:border-blue-400 outline-none transition" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Mensaje</label>
                        <textarea value={broadcastData.message} onChange={e => setBroadcastData({...broadcastData, message: e.target.value})} placeholder="Mensaje para los locatarios..." className="w-full bg-slate-50 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] font-bold h-48 md:h-60 resize-none shadow-inner border-2 border-transparent focus:border-blue-400 outline-none transition" />
                      </div>
                      <button className="w-full bg-blue-600 text-white py-6 md:py-8 rounded-[2rem] md:rounded-[2.5rem] font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 hover:bg-slate-900 transition active:scale-95">
                        <Send size={18} /> DISPARAR CAMPAÑA
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeSubTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in">
             <div className="bg-white p-10 md:p-14 rounded-[3rem] md:rounded-[4.5rem] border border-slate-100 shadow-2xl text-center space-y-12">
                <div className="w-20 h-20 md:w-28 md:h-28 bg-slate-50 text-slate-300 rounded-3xl md:rounded-[2.5rem] mx-auto flex items-center justify-center shadow-inner"><Settings className="w-10 h-10 md:w-14 md:h-14" /></div>
                <div>
                   <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter mb-4">Ajustes <span className="text-blue-600">Estructurales</span></h2>
                </div>
                
                <div className="max-w-xl mx-auto space-y-10 text-left">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Fondo Maestra (Desktop)</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="aspect-video bg-slate-50 rounded-[1.5rem] md:rounded-3xl overflow-hidden border-2 border-slate-100 shadow-inner group relative">
                            <img src={landingBg} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" alt="Preview" />
                         </div>
                         <div className="flex flex-col justify-center gap-3">
                            <div className="relative overflow-hidden group">
                               <button disabled={isUploading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-blue-700 transition">
                                  {isUploading ? <RefreshCw className="animate-spin" /> : <Upload size={16}/>} SUBIR PC
                               </button>
                               <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                            </div>
                            <button onClick={() => setLandingBg('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2000')} className="w-full bg-slate-100 text-slate-500 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition">DEFAULT</button>
                         </div>
                      </div>
                   </div>
                   
                   <div className="pt-10 border-t border-slate-100">
                      <div className="flex items-center gap-4 bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                         <CheckCircle2 className="text-emerald-600 shrink-0" />
                         <div className="truncate">
                            <p className="font-black text-emerald-900 text-sm italic">Google Wallet Sync: Activo</p>
                            <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest truncate">ID: {GOOGLE_WALLET_ISSUER_ID}</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* MODAL DE EDICIÓN DE NEGOCIO (MAESTRO) */}
      {editingBiz && (
        <div className="fixed inset-0 z-[2000] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-6 animate-in fade-in">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] md:rounded-[4.5rem] p-8 md:p-14 shadow-2xl space-y-8 md:y-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-3 bg-blue-600" />
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter">Locatario</h3>
                </div>
                <button onClick={() => setEditingBiz(null)} className="p-3 bg-slate-50 rounded-full hover:bg-rose-50 hover:text-rose-500 transition"><X size={24}/></button>
              </div>
              
              <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex items-center gap-4 md:gap-6">
                 <img src={editingBiz.logo_url} className="w-12 h-12 md:w-16 md:h-16 rounded-xl object-cover shadow-lg border-2 border-white" />
                 <div className="truncate"><p className="text-[10px] font-black uppercase text-blue-600 mb-1 tracking-widest">Sucursal</p><p className="font-black text-xl md:text-2xl tracking-tighter truncate">{editingBiz.name}</p></div>
              </div>

              <form onSubmit={async (e) => { e.preventDefault(); if(!editingBiz) return; const res = await fetch(`${SUPABASE_URL}/rest/v1/cc_businesses?id=eq.${editingBiz.id}`, { method: 'PATCH', headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ status: editingBiz.status, plan_id: editingBiz.plan_id }) }); if(res.ok) { notify('Cambios guardados', 'success'); setEditingBiz(null); fetchMasterData(); } }} className="space-y-6 md:space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest flex items-center gap-2">Suscripción</label>
                    <select value={editingBiz.status} onChange={e => setEditingBiz({...editingBiz, status: e.target.value as any})} className="w-full bg-slate-50 p-5 rounded-2xl font-black shadow-inner outline-none border-2 border-transparent focus:border-blue-400 transition cursor-pointer">
                      <option value="active">ACTIVO</option>
                      <option value="trial">PRUEBA</option>
                      <option value="expired">VENCIDO</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest flex items-center gap-2">Plan Maestro</label>
                    <select value={editingBiz.plan_id} onChange={e => setEditingBiz({...editingBiz, plan_id: e.target.value})} className="w-full bg-slate-50 p-5 rounded-2xl font-black shadow-inner outline-none border-2 border-transparent focus:border-blue-400 transition cursor-pointer">
                      {DEFAULT_PLANS.map(p => <option key={p.id} value={p.id}>{p.name.toUpperCase()}</option>)}
                    </select>
                 </div>
                 <button type="submit" className="w-full bg-slate-900 text-white py-6 md:py-8 rounded-[1.5rem] md:rounded-[2.5rem] font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-2xl hover:bg-blue-600 transition active:scale-95">RECALIBRAR ACCESO</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

const TargetButton = ({ active, onClick, label, count, color = 'blue' }: any) => {
  const colors = {
    blue: active ? 'bg-blue-600 text-white shadow-lg border-blue-500' : 'bg-slate-50 text-slate-600 hover:bg-blue-50',
    emerald: active ? 'bg-emerald-600 text-white shadow-lg border-emerald-500' : 'bg-slate-50 text-slate-600 hover:bg-emerald-50',
    amber: active ? 'bg-amber-500 text-white shadow-lg border-amber-400' : 'bg-slate-50 text-slate-600 hover:bg-amber-50',
  };
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-4 md:p-5 rounded-2xl transition-all border-2 border-transparent ${colors[color as keyof typeof colors]}`}>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      <span className={`px-3 py-1 rounded-full font-black text-[10px] ${active ? 'bg-white/20' : 'bg-slate-200 text-slate-500'}`}>{count}</span>
    </button>
  );
};

const SubTabButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-[1.5rem] md:rounded-[2.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${active ? 'bg-white text-blue-600 shadow-xl border border-slate-100 scale-105' : 'text-slate-400 hover:text-slate-600 whitespace-nowrap'}`}><Icon size={16}/> {label}</button>
);

const StatusBadge = ({ status }: any) => {
  const st = { 
    active: 'bg-emerald-50 text-emerald-600 border-emerald-100', 
    trial: 'bg-blue-50 text-blue-600 border-blue-100', 
    expired: 'bg-rose-50 text-rose-600 border-rose-100' 
  };
  return <span className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full font-black text-[8px] md:text-[9px] uppercase tracking-[0.2em] border ${st[status as keyof typeof st] || 'bg-slate-100'}`}>{status}</span>;
};

export default SuperAdmin;
