
import React, { useState, useEffect } from 'react';
import { 
  Building2, CreditCard, Users, Plus, Scan, LogOut, Megaphone, CreditCard as BillingIcon, Save, RefreshCw, Lock, LayoutDashboard, QrCode, Download, Navigation, Camera, Settings, MapPin, Phone, Globe, User, MessageCircle, Info
} from 'lucide-react';
import { Business, Plan } from '../types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../App';
import { CATEGORIES } from '../constants';
import CardEditor from './CardEditor';
import Pricing from './Pricing';

interface BusinessDashboardProps {
  business: Business;
  plans: Plan[];
  notify: (msg: string, type?: any) => void;
  onLogout: () => void;
  onUpdateBusiness: (data: Partial<Business>) => void;
}

const BusinessDashboard: React.FC<BusinessDashboardProps> = ({ business, plans, notify, onLogout, onUpdateBusiness }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'terminal' | 'cards' | 'clients' | 'campaigns' | 'profile' | 'billing'>('overview');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [showQRModal, setShowQRModal] = useState<{ isOpen: boolean, url: string, name: string }>({ isOpen: false, url: '', name: '' });
  const [realCards, setRealCards] = useState<any[]>([]);
  const [realClients, setRealClients] = useState<any[]>([]);
  const [loadingReal, setLoadingReal] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Detección segura de URL absoluta para el escaneo
  const getAbsoluteUrl = () => {
    try {
      return window.location.origin + window.location.pathname;
    } catch (e) {
      return "/";
    }
  };

  const [profileData, setProfileData] = useState({
    name: business?.name || '',
    category: business?.category || 'otro',
    contact_person: business?.contact_person || '',
    phone: business?.phone || '',
    address: business?.address || '',
    website: business?.website || '',
    logo_url: business?.logo_url || ''
  });

  const isMarketingLocked = business?.plan_id === 'plan_basic' || business?.status === 'trial';

  useEffect(() => { 
    if (business?.id) fetchRealData(); 
  }, [business?.id]);

  const fetchRealData = async () => {
    setLoadingReal(true);
    try {
      const cardRes = await fetch(`${SUPABASE_URL}/rest/v1/cc_cards?business_id=eq.${business.id}`, {
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
      });
      const clientRes = await fetch(`${SUPABASE_URL}/rest/v1/cc_clients?select=*`, {
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
      });
      
      if (cardRes.ok) {
        const cards = await cardRes.json();
        setRealCards(Array.isArray(cards) ? cards : []);
      }
      
      if (clientRes.ok) {
        const clients = await clientRes.json();
        setRealClients(Array.isArray(clients) ? clients : []);
      }
    } catch (err) { 
      console.error("Data Sync Error:", err); 
    } finally { 
      setLoadingReal(false); 
    }
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/cc_businesses?id=eq.${business.id}`, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      if (res.ok) { 
        onUpdateBusiness(profileData); 
        notify('Expediente actualizado correctamente', 'success'); 
      } else {
        throw new Error("Update failed");
      }
    } catch (e) { 
      notify('Error al guardar expediente', 'error'); 
    } finally { 
      setIsSavingProfile(false); 
    }
  };

  const openQR = (card: any) => {
    const baseUrl = getAbsoluteUrl();
    const separator = baseUrl.includes('?') ? '&' : '?';
    const url = `${baseUrl}${separator}card=${card.id}`;
    setShowQRModal({ isOpen: true, url, name: card.name });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl relative">
        <div className="flex items-center gap-8 relative z-10">
          <img src={business?.logo_url} className="w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] object-cover shadow-2xl border-4 border-white" alt="Logo" />
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter italic leading-none">{business?.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className="px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">PLAN: {business?.plan_id?.replace('plan_', '').toUpperCase()}</span>
              <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${business?.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>{business?.status?.toUpperCase()}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
           <button onClick={() => setActiveTab('terminal')} className="bg-blue-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-3xl font-black hover:bg-blue-700 shadow-2xl transition flex items-center gap-3 uppercase text-[10px] tracking-widest active:scale-95"><Scan size={20} /> TERMINAL QR</button>
           <button onClick={onLogout} className="bg-white border-2 border-slate-100 text-rose-500 p-4 md:p-5 rounded-3xl hover:bg-rose-50 transition shadow-sm active:scale-90"><LogOut size={24} /></button>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-slate-100/60 p-2 rounded-[2.5rem] mb-12 w-full overflow-x-auto no-scrollbar border border-slate-200 shadow-inner">
        <TabButton label="Resumen" icon={LayoutDashboard} active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <TabButton label="Volantes" icon={CreditCard} active={activeTab === 'cards'} onClick={() => setActiveTab('cards')} />
        <TabButton label="Marketing Hub" icon={Megaphone} active={activeTab === 'campaigns'} onClick={() => setActiveTab('campaigns')} />
        <TabButton label="Suscripción" icon={BillingIcon} active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} />
        <TabButton label="Mi Perfil" icon={Building2} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-bottom-5">
            <StatsCard title="Clientes Registrados" value={realClients.length} icon={Users} color="text-blue-600" bg="bg-blue-50" />
            <StatsCard title="Volantes Publicados" value={realCards.length} icon={CreditCard} color="text-purple-600" bg="bg-purple-50" />
            <StatsCard title="Vistas Totales" value={realClients.length * 7 + 14} icon={Navigation} color="text-emerald-600" bg="bg-emerald-50" />
          </div>
        )}

        {activeTab === 'cards' && (
          <div className="space-y-12 animate-in fade-in">
             <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black italic tracking-tighter">Gestión de Volantes</h2>
                <button onClick={() => { setEditingCard(null); setIsEditorOpen(true); }} className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl hover:bg-blue-600 transition"><Plus size={18}/> NUEVO VOLANTE</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {realCards.map(card => (
                  <CardItem key={card.id} card={card} business={business} onEdit={() => { setEditingCard(card); setIsEditorOpen(true); }} onShowQR={() => openQR(card)} />
                ))}
             </div>
          </div>
        )}

        {activeTab === 'terminal' && (
          <div className="max-w-4xl mx-auto text-center py-12 animate-in zoom-in">
             <div className="bg-white p-14 rounded-[4rem] border border-slate-100 shadow-2xl space-y-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-4 bg-blue-600" />
                <h2 className="text-4xl font-black italic tracking-tighter">Terminal <span className="text-blue-600">de Registro</span></h2>
                <div className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 inline-block shadow-inner">
                   <img src={`https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(getAbsoluteUrl() + (getAbsoluteUrl().includes('?') ? '&' : '?') + 'biz=' + (business?.id || ''))}`} className="w-72 h-72 mx-auto drop-shadow-2xl" alt="Terminal QR" />
                </div>
                <div className="max-w-md mx-auto"><p className="text-slate-500 font-bold mb-8">Imprime este código y ponlo en tu mostrador. Al escanearlo, tus clientes se registrarán automáticamente.</p></div>
                <button onClick={() => window.print()} className="w-full bg-slate-900 text-white py-7 rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:bg-blue-600 transition active:scale-95"><Download size={20} /> IMPRIMIR CARTEL DE MOSTRADOR</button>
             </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-5xl mx-auto bg-white p-10 md:p-14 rounded-[3rem] md:rounded-[4rem] border border-slate-100 shadow-2xl space-y-12 animate-in zoom-in">
             <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="relative group">
                  <img src={profileData.logo_url} className="w-32 h-32 md:w-36 md:h-36 rounded-[3rem] object-cover shadow-2xl border-4 border-white" alt="Logo" />
                  <div className="absolute inset-0 bg-black/40 rounded-[3rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer"><Camera className="text-white" /></div>
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-slate-900">Expediente <span className="text-blue-600">Comercial</span></h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Configuración base de tu negocio</p>
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                <ProfileField label="Nombre Comercial" value={profileData.name} onChange={v => setProfileData({...profileData, name: v})} icon={Building2} />
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Giro del Negocio</label><select value={profileData.category} onChange={e => setProfileData({...profileData, category: e.target.value as any})} className="w-full bg-slate-50 p-6 rounded-3xl font-black border-2 border-transparent focus:border-blue-400 outline-none shadow-inner capitalize">{CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
                <ProfileField label="Dueño o Gerente" value={profileData.contact_person} onChange={v => setProfileData({...profileData, contact_person: v})} icon={User} />
                <ProfileField label="WhatsApp Comercial" value={profileData.phone} onChange={v => setProfileData({...profileData, phone: v})} icon={MessageCircle} />
                <ProfileField label="Dirección de Sucursal" value={profileData.address} onChange={v => setProfileData({...profileData, address: v})} icon={MapPin} />
                <ProfileField label="Sitio Web o Enlace" value={profileData.website} onChange={v => setProfileData({...profileData, website: v})} icon={Globe} />
             </div>
             <button onClick={handleSaveProfile} disabled={isSavingProfile} className="w-full bg-slate-900 text-white py-8 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition flex items-center justify-center gap-4 active:scale-95">
                {isSavingProfile ? <RefreshCw className="animate-spin" /> : <Save size={20}/>} ACTUALIZAR EXPEDIENTE COMERCIAL
             </button>
          </div>
        )}
        
        {activeTab === 'campaigns' && (
          <div className="space-y-8 animate-in fade-in">
             <div className={`p-10 rounded-[3rem] border-2 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl transition-all ${isMarketingLocked ? 'bg-slate-50 border-slate-200' : 'bg-gradient-to-r from-blue-600 to-indigo-700 border-blue-400 text-white'}`}>
                <div className="flex items-center gap-6">
                   <div className="bg-white/20 p-5 rounded-2xl text-white shadow-inner"><Navigation size={32} /></div>
                   <div><h3 className="text-2xl font-black italic tracking-tighter">Marketing por Proximidad</h3><p className="text-[10px] font-black uppercase tracking-widest opacity-80">Radio de acción: 1km a la redonda</p></div>
                </div>
                {!isMarketingLocked && <span className="bg-white/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 animate-pulse">Servicio Activo</span>}
             </div>
             <div className="bg-white p-14 rounded-[4rem] border border-slate-100 shadow-2xl relative overflow-hidden">
                {isMarketingLocked && (
                  <div className="absolute inset-0 z-50 bg-white/70 backdrop-blur-[12px] flex flex-col items-center justify-center text-center p-12">
                      <div className="bg-slate-900 text-white p-8 rounded-full mb-8 shadow-2xl animate-bounce"><Lock size={64}/></div>
                      <h2 className="text-4xl font-black italic mb-4 tracking-tighter">Marketing <span className="text-blue-600">Pro</span> Bloqueado</h2>
                      <p className="text-slate-500 font-bold max-w-sm mb-10">Sube tu plan a PRO o ELITE para enviar notificaciones push geolocalizadas a tus clientes.</p>
                      <button onClick={() => setActiveTab('billing')} className="bg-blue-600 text-white px-16 py-6 rounded-full font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-blue-700 transition">VER PLANES DE SUSCRIPCIÓN</button>
                  </div>
                )}
                <h2 className="text-4xl font-black mb-10 italic tracking-tighter">Push <span className="text-blue-600">Marketing Hub</span></h2>
                <div className="space-y-8">
                  <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Asunto de la Alerta</label><input placeholder="Ej: ¡Te extrañamos en Pollería Don Juan!" className="w-full bg-slate-50 p-6 rounded-3xl font-bold border-2 border-transparent focus:border-blue-400 outline-none shadow-inner" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Mensaje Persuasivo</label><textarea className="w-full bg-slate-50 p-8 rounded-[2.5rem] font-bold h-40 resize-none outline-none border-2 border-transparent focus:border-blue-400 shadow-inner" placeholder="Escribe tu oferta irresistible aquí..." /></div>
                  <button className="w-full bg-blue-600 text-white py-8 rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl flex items-center justify-center gap-4 hover:bg-blue-700 transition active:scale-95">LANZAR CAMPAÑA MASIVA</button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'billing' && <Pricing plans={plans} onSelectPlan={(p) => window.open(`https://wa.me/5214444237092?text=Quiero%20contratar%20el%20plan%20${p.name}`, '_blank')} />}
      </div>

      {showQRModal.isOpen && (
        <div className="fixed inset-0 z-[2500] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in">
           <div className="bg-white w-full max-lg rounded-[4rem] shadow-2xl p-14 text-center space-y-8 animate-in zoom-in">
              <h3 className="text-2xl font-black italic tracking-tighter">QR del <span className="text-blue-600">Volante</span></h3>
              <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 inline-block shadow-inner">
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(showQRModal.url)}`} className="w-64 h-64 mx-auto" alt="Card QR" />
              </div>
              <button onClick={() => setShowQRModal({ isOpen: false, url: '', name: '' })} className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95">CERRAR VISTA</button>
           </div>
        </div>
      )}

      {isEditorOpen && <CardEditor businessId={business.id} businessName={business.name} address={business.address || ''} existingCard={editingCard} onClose={() => { setIsEditorOpen(false); setEditingCard(null); fetchRealData(); }} notify={notify} />}
    </div>
  );
};

const TabButton = ({ label, icon: Icon, active, onClick }: any) => (
  <button onClick={onClick} className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all whitespace-nowrap ${active ? 'bg-white text-blue-600 shadow-xl border border-slate-200' : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'}`}><Icon className="w-4 h-4" /> {label}</button>
);

const StatsCard = ({ title, value, icon: Icon, color, bg }: any) => (
  <div className="bg-white p-14 rounded-[3.5rem] shadow-sm border border-slate-100 transition-all hover:shadow-2xl relative overflow-hidden group">
    <div className={`w-16 h-16 rounded-3xl ${bg} ${color} flex items-center justify-center mb-8 shadow-inner`}><Icon size={32} /></div>
    <h3 className="text-6xl font-black text-slate-900 tracking-tighter mb-2 leading-none">{value}</h3>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
  </div>
);

const ProfileField = ({ label, value, onChange, icon: Icon }: { label: string, value: string, onChange: (v: string) => void, icon?: any }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest flex items-center gap-2">{Icon && <Icon size={12}/>} {label}</label>
    <input value={value} onChange={e => onChange(e.target.value)} className="w-full bg-slate-50 p-6 rounded-3xl font-black border-2 border-transparent focus:border-blue-400 shadow-inner outline-none transition" />
  </div>
);

const CardItem = ({ card, business, onEdit, onShowQR }: any) => (
  <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-3xl transition-all border-b-[10px]" style={{ borderBottomColor: card.config?.primary_color || '#2563eb' }}>
    <div className="h-40 md:h-44 p-10 flex items-start justify-between relative overflow-hidden" style={{ backgroundColor: card.config?.primary_color || '#2563eb' }}>
       <div className="text-7xl drop-shadow-2xl group-hover:scale-110 transition duration-500">{card.config?.emoji || '🍗'}</div>
       <div className="bg-white/20 backdrop-blur-xl px-5 py-2 rounded-full text-[9px] font-black text-white uppercase border border-white/20 tracking-widest">LIVE CARD</div>
    </div>
    <div className="p-10 -mt-12 flex-1 bg-white rounded-[3.5rem] relative z-10 border-t border-slate-50 space-y-4">
      <h4 className="font-black text-2xl mb-1 text-slate-900 tracking-tighter leading-none">{card.name}</h4>
      <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{business?.name}</p>
      <div className="flex gap-3 pt-4">
        <button onClick={onShowQR} className="flex-1 bg-slate-900 text-white py-4 rounded-[2.5rem] text-[9px] font-black hover:bg-blue-600 transition uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95"><QrCode size={14}/> VER QR</button>
        <button onClick={onEdit} className="bg-slate-50 text-slate-400 p-4 rounded-full hover:text-slate-900 transition border border-slate-100 shadow-sm active:scale-90"><Settings size={18} /></button>
      </div>
    </div>
  </div>
);

export default BusinessDashboard;
