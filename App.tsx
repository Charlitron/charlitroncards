
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCw, Building2 } from 'lucide-react';
import { PLANS as INITIAL_PLANS } from './constants';
import Home from './components/Home';
import BusinessDashboard from './components/BusinessDashboard';
import ClientView from './components/ClientView';
import SuperAdmin from './components/SuperAdmin';
import LegalPage from './components/LegalPage';
import SignUp from './components/SignUp';
import DataArchitecture from './components/DataArchitecture';
import { Plan, Business } from './types';

export const SUPABASE_URL = "https://hqkdonphhccezwwbssyy.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxa2RvbnBoaGNjZXp3d2Jzc3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NTc2NTcsImV4cCI6MjA4MDAzMzY1N30.tEyTgEEeHazc8uhcFI7Qc3J76B5a1_sRr52JD4ETg7Y";

export const GOOGLE_WALLET_ISSUER_ID = "3388000000023057236";
export const GOOGLE_WALLET_CLASS_ID = "loyalty_class_v1";

type View = 'landing' | 'auth_choice' | 'auth' | 'signup' | 'business_dashboard' | 'client_flow' | 'super_admin' | 'architecture';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'delete';
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);
  
  const [plans, setPlans] = useState<Plan[]>(() => {
    try {
      const saved = localStorage.getItem('cc_plans');
      if (!saved) return INITIAL_PLANS;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PLANS;
    } catch (e) {
      return INITIAL_PLANS;
    }
  });

  const [landingBg, setLandingBg] = useState<string>(() => {
    try {
      return localStorage.getItem('cc_master_bg') || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2000';
    } catch (e) {
      return 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2000';
    }
  });

  const [logoClicks, setLogoClicks] = useState(0);
  const clickTimeout = useRef<any>(null);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showLegal, setShowLegal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    if (plans && Array.isArray(plans)) {
      localStorage.setItem('cc_plans', JSON.stringify(plans));
    }
  }, [plans]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('biz') || params.get('card')) {
      setCurrentView('client_flow');
    } else {
      const saved = localStorage.getItem('cc_active_business');
      if (saved) {
        try {
          const parsedBiz = JSON.parse(saved);
          if (parsedBiz && parsedBiz.id) {
            setActiveBusiness(parsedBiz);
            setCurrentView('business_dashboard');
          }
        } catch (e) {
          localStorage.removeItem('cc_active_business');
        }
      }
    }
  }, []);

  const notify = useCallback((message: string, type: 'success' | 'error' | 'info' | 'delete' = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  }, []);

  const handleLogoClick = () => {
    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    if (newCount >= 5) { setIsAdminAuthModalOpen(true); setLogoClicks(0); }
    else { clickTimeout.current = setTimeout(() => setLogoClicks(0), 2000); }
  };

  const handleGoHome = () => {
    // 1. Limpieza de URL con blindaje para evitar errores de seguridad (Uncaught SecurityError)
    try {
      if (window.history.pushState) {
        window.history.pushState({}, '', window.location.pathname);
      }
    } catch (e) {
      console.warn("Navigation state restricted");
    }
    
    // 2. Cerrar todos los posibles modales y estados globales
    setIsAdminAuthModalOpen(false);
    setShowLegal(false);
    setAdminPassword('');
    setAuthEmail('');
    setAuthPass('');
    
    // 3. Resetear vista a la landing
    setCurrentView('landing');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/cc_businesses?email=eq.${authEmail.toLowerCase()}&password=eq.${authPass}&select=*`, {
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
      });
      if (!res.ok) throw new Error("Auth failed");
      const data = await res.json();
      if (data && Array.isArray(data) && data.length > 0) {
        setActiveBusiness(data[0]);
        localStorage.setItem('cc_active_business', JSON.stringify(data[0]));
        setCurrentView('business_dashboard');
        notify('¡Bienvenido!', 'success');
      } else { notify('Credenciales incorrectas', 'error'); }
    } catch (err) { notify('Error de conexión', 'error'); }
    finally { setIsAuthenticating(false); }
  };

  const handleLogout = () => {
    setActiveBusiness(null);
    localStorage.removeItem('cc_active_business');
    setCurrentView('landing');
    notify('Sesión cerrada', 'info');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans relative overflow-x-hidden">
      {/* Notificaciones - Prioridad absoluta */}
      <div className="fixed top-24 right-6 z-[3000] flex flex-col gap-3 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className={`pointer-events-auto min-w-[280px] p-6 rounded-[2rem] shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 ${n.type === 'error' ? 'bg-rose-600' : 'bg-blue-600'} text-white font-black text-xs uppercase tracking-widest`}>
            {n.message}
          </div>
        ))}
      </div>

      {/* Navegación - Z-Index 2000 para estar siempre por encima de modales */}
      <nav className="sticky top-0 z-[2000] bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 py-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={handleLogoClick}>
          <img src="https://static.wixstatic.com/media/7fb206_893f39bbcc1d4a469839dce707985bf7~mv2.png/v1/fill/w_314,h_314,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/charlitron-logo.png" alt="Logo" className="w-8 h-8 md:w-10 md:h-10" />
          <span className="font-extrabold text-lg md:text-2xl tracking-tight text-blue-600">Charlitron <span className="text-slate-900">Cards</span></span>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={(e) => { e.preventDefault(); handleGoHome(); }} 
            className="px-6 py-3 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-blue-600 transition flex items-center justify-center bg-transparent border-0 cursor-pointer active:scale-90"
          >
            Inicio
          </button>
          <button onClick={() => activeBusiness ? setCurrentView('business_dashboard') : setCurrentView('auth_choice')} className="bg-blue-600 text-white px-5 md:px-9 py-2 md:py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-900 transition active:scale-95">
            {activeBusiness ? 'Mi Panel' : 'Acceso'}
          </button>
        </div>
      </nav>

      <main className="flex-1">
        {currentView === 'landing' && <Home onStart={() => setCurrentView('auth_choice')} onOpenLegal={() => setShowLegal(true)} onOpenArchitecture={() => setCurrentView('architecture')} plans={plans} background={landingBg} />}
        {currentView === 'client_flow' && <ClientView onOpenLegal={() => setShowLegal(true)} notify={notify} />}
        {currentView === 'architecture' && <DataArchitecture />}
        {currentView === 'super_admin' && <SuperAdmin plans={plans} setPlans={setPlans} landingBg={landingBg} setLandingBg={setLandingBg} notify={notify} />}
        {currentView === 'auth' && (
          <div className="max-w-md mx-auto py-12 md:py-24 px-6">
            <div className="bg-white rounded-[3.5rem] shadow-2xl p-10 md:p-14 border border-slate-100 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
              <h2 className="text-3xl font-black mb-10 italic tracking-tighter">Acceso <span className="text-blue-600">Comercial</span></h2>
              <form onSubmit={handleAuth} className="space-y-6 text-left">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Email Registrado</label>
                   <input type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="w-full bg-slate-50 p-6 rounded-[1.8rem] outline-none font-black shadow-inner border-2 border-transparent focus:border-blue-100 transition" placeholder="ventas@negocio.com" required />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Tu Contraseña</label>
                   <input type="password" value={authPass} onChange={e => setAuthPass(e.target.value)} className="w-full bg-slate-50 p-6 rounded-[1.8rem] outline-none font-black shadow-inner border-2 border-transparent focus:border-blue-100 transition" placeholder="••••••••" required />
                </div>
                <button type="submit" disabled={isAuthenticating} className="w-full bg-blue-600 text-white font-black py-7 rounded-[1.8rem] shadow-2xl flex items-center justify-center gap-3 hover:bg-slate-900 transition active:scale-95 mt-4 uppercase text-xs tracking-widest">
                  {isAuthenticating ? <RefreshCw className="animate-spin" /> : 'Sincronizar Panel'}
                </button>
              </form>
            </div>
          </div>
        )}
        {currentView === 'business_dashboard' && activeBusiness && (
          <BusinessDashboard business={activeBusiness} plans={plans} notify={notify} onLogout={handleLogout} onUpdateBusiness={(d) => setActiveBusiness(prev => prev ? {...prev, ...d} : null)} />
        )}
        {currentView === 'signup' && <SignUp onSuccess={(biz) => { setActiveBusiness(biz); setCurrentView('business_dashboard'); }} onBack={() => setCurrentView('landing')} notify={notify} onOpenLegal={() => setShowLegal(true)} />}
        {currentView === 'auth_choice' && (
          <div className="max-w-5xl mx-auto py-12 md:py-24 px-6 flex flex-col md:flex-row gap-10">
            <div onClick={() => setCurrentView('auth')} className="flex-1 bg-slate-900 p-14 rounded-[4rem] text-white cursor-pointer hover:scale-[1.02] transition shadow-2xl group border-b-[12px] border-blue-600">
               <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 transition"><RefreshCw className="w-7 h-7" /></div>
               <h2 className="text-4xl font-black mb-3 italic tracking-tighter leading-none">Ya soy <br/><span className="text-blue-500">Locatario</span></h2>
               <p className="opacity-40 font-bold italic text-sm">Gestiona tus volantes y mide el impacto de tus campañas.</p>
            </div>
            <div onClick={() => setCurrentView('signup')} className="flex-1 bg-white p-14 rounded-[4rem] border-2 border-slate-100 cursor-pointer hover:scale-[1.02] transition shadow-xl group border-b-[12px] border-slate-100 hover:border-blue-100">
               <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition"><Building2 className="w-7 h-7" /></div>
               <h2 className="text-4xl font-black mb-3 text-slate-900 italic tracking-tighter leading-none">Abrir mi <br/><span className="text-blue-600">Sucursal Digital</span></h2>
               <p className="text-slate-400 font-bold italic text-sm">Empieza tu digitalización hoy con 7 días de prueba.</p>
            </div>
          </div>
        )}
      </main>

      {showLegal && (
        <div className="fixed inset-0 z-[2500] bg-slate-900/80 backdrop-blur-xl p-4 overflow-y-auto flex items-center justify-center">
          <div className="w-full max-w-5xl"><LegalPage onClose={() => setShowLegal(false)} /></div>
        </div>
      )}

      {isAdminAuthModalOpen && (
        <div className="fixed inset-0 z-[2600] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-xl">
          <div className="bg-white rounded-[4rem] p-12 md:p-16 max-w-md w-full shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-3 bg-blue-600" />
            <div className="absolute top-6 right-6">
              <button onClick={() => setIsAdminAuthModalOpen(false)} className="text-slate-300 hover:text-rose-500 transition"><RefreshCw className="rotate-45" /></button>
            </div>
            <h2 className="text-3xl font-black mb-12 text-blue-600 uppercase tracking-tighter italic leading-none">Acceso <br/>Maestro Global</h2>
            <form onSubmit={(e) => { e.preventDefault(); if(adminPassword==='2003') { setCurrentView('super_admin'); setIsAdminAuthModalOpen(false); setAdminPassword(''); } else { notify('PIN Maestro incorrecto', 'error'); } }}>
              <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="w-full bg-slate-50 p-10 rounded-3xl mb-12 text-center text-6xl font-black outline-none border-2 border-blue-100 shadow-inner" autoFocus />
              <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Auth Pin Required</p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
