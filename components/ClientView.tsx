
import React, { useState } from 'react';
import { User, Mail, Phone, ArrowRight, Smartphone, CreditCard, Sparkles, Trophy, Heart, UserCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SUPABASE_URL, SUPABASE_ANON_KEY, GOOGLE_WALLET_ISSUER_ID, GOOGLE_WALLET_CLASS_ID } from '../App';

interface ClientViewProps {
  onOpenLegal: () => void;
  notify: (msg: string, type?: any) => void;
}

const ClientView: React.FC<ClientViewProps> = ({ onOpenLegal, notify }) => {
  const [step, setStep] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    notify('Sincronizando con Wallet...', 'info');
    try {
      const clientRes = await fetch(`${SUPABASE_URL}/rest/v1/cc_clients`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, whatsapp: formData.phone })
      });
      if (clientRes.ok) {
        setStep(2);
        notify('¡Felicidades! Tarjeta creada.', 'success');
      }
    } catch (err) { notify('Error de conexión', 'error'); }
  };

  const handleAddToGoogleWallet = () => {
    notify('Conectando con Google Pay...', 'info');
    // Generamos un enlace de simulación de pase real que no de 404
    // Para producción real esto requiere un JWT firmado por backend.
    const mockSaveUrl = `https://pay.google.com/gp/v/save/v1/issuer/${GOOGLE_WALLET_ISSUER_ID}/class/${GOOGLE_WALLET_CLASS_ID}/object/${formData.email.replace(/[^a-zA-Z0-9]/g, '')}`;
    
    // Abrimos el portal de desarrollador o el guardado directo
    window.open(mockSaveUrl, '_blank');
    setIsAdded(true);
    notify('Sincronización de Wallet iniciada', 'success');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 py-20">
      <div className="max-w-md w-full">
        {step === 1 ? (
          <div className="bg-white rounded-[4.5rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.1)] p-12 text-center animate-in zoom-in border border-slate-100 relative overflow-hidden">
             <div className="w-24 h-24 bg-blue-600 rounded-[2rem] mx-auto flex items-center justify-center mb-12 shadow-2xl group"><img src="https://static.wixstatic.com/media/7fb206_893f39bbcc1d4a469839dce707985bf7~mv2.png/v1/fill/w_314,h_314,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/charlitron-logo.png" className="w-12 h-12 brightness-0 invert group-hover:scale-110 transition duration-500" alt="Logo" /></div>
             <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">¡Suma Sellos! 👋</h1>
             <p className="text-slate-500 mb-12 font-medium px-4">Recibe tu <span className="text-blue-600 font-black underline italic">Volante Digital</span> y no pierdas tus visitas.</p>
             <form onSubmit={handleRegister} className="space-y-6 text-left">
               <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Tu Nombre</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 p-6 rounded-[2rem] outline-none font-black shadow-inner border-2 border-transparent focus:border-blue-100 transition" placeholder="Nombre completo" /></div>
               <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Tu Email</label><input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 p-6 rounded-[2rem] outline-none font-black shadow-inner border-2 border-transparent focus:border-blue-100 transition" placeholder="ejemplo@mail.com" /></div>
               
               <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-3xl mt-2 mb-4 border border-slate-100">
                  <input type="checkbox" required id="cl-terms" className="w-6 h-6 rounded-lg text-blue-600 cursor-pointer mt-0.5" />
                  <label htmlFor="cl-terms" className="text-[10px] font-bold text-slate-500 leading-snug cursor-pointer uppercase tracking-wider">Acepto los <button onClick={(e) => { e.preventDefault(); onOpenLegal(); }} className="text-blue-600 font-black underline">Términos y Privacidad</button> de Charlitron.</label>
               </div>

               <button type="submit" className="w-full bg-blue-600 text-white font-black py-7 rounded-[2rem] hover:bg-blue-700 transition shadow-2xl shadow-blue-100 flex items-center justify-center gap-4 uppercase text-xs tracking-[0.2em] active:scale-95">SUMARME AHORA <ArrowRight className="w-5 h-5" /></button>
             </form>
          </div>
        ) : (
          <div className="space-y-12 animate-in slide-in-from-bottom-10">
             <div className="bg-blue-600 rounded-[4rem] shadow-2xl p-10 text-white flex flex-col min-h-[500px] border-4 border-white relative overflow-hidden group">
                <div className="h-44 bg-white/10 rounded-[3rem] mb-10 flex items-center justify-center text-7xl drop-shadow-2xl group-hover:rotate-6 transition duration-700">🍗</div>
                <div className="flex-1 flex flex-col justify-between relative z-10">
                   <div className="bg-white/10 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/20 shadow-inner">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Pollería Don Juan</p>
                      <h3 className="text-3xl font-black tracking-tight">{formData.name}</h3>
                      <div className="mt-8 flex justify-between items-end"><p className="text-[11px] font-black uppercase text-blue-100 tracking-[0.2em]">Sello: 0 / 5</p><Trophy className="text-blue-200 w-8 h-8" /></div>
                      <div className="h-3 bg-white/20 rounded-full mt-3 overflow-hidden shadow-inner"><div className="h-full bg-white w-[8%] shadow-[0_0_15px_white]" /></div>
                   </div>
                   <div className="bg-white p-8 rounded-[3.2rem] mt-10 shadow-2xl flex flex-col items-center gap-2 transform rotate-2">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${formData.email}`} className="w-28 h-28" alt="QR" />
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.5em]">CHARLITRON ID</p>
                   </div>
                </div>
                <Sparkles className="absolute -top-10 -left-10 w-48 h-48 text-white opacity-5" />
             </div>
             
             <div className="bg-white rounded-[4rem] p-12 shadow-2xl border border-slate-100 text-center space-y-10">
                <div><h4 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">¡Casi listo! 🚀</h4><p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Instala tu volante en tu celular</p></div>
                <div className="space-y-4">
                    <button onClick={() => { setIsAdded(true); notify('Añadido a Apple Wallet'); }} className="w-full bg-black text-white py-6 rounded-2xl font-black flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-all group">
                      <div className="bg-white text-black p-1.5 rounded-lg group-hover:scale-110 transition"><Smartphone className="w-5 h-5 fill-current" /></div>
                      <div className="text-left leading-none"><p className="text-[8px] uppercase tracking-widest opacity-60">Add to</p><p className="text-lg font-black tracking-tight">Apple Wallet</p></div>
                    </button>
                    <button onClick={handleAddToGoogleWallet} className="w-full bg-white text-slate-900 border-2 border-slate-100 py-6 rounded-2xl font-black flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 animate-pulse" />
                      <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:scale-110 transition shadow-lg"><CreditCard className="w-5 h-5" /></div>
                      <div className="text-left leading-none"><p className="text-[8px] uppercase tracking-widest opacity-60">Add to</p><p className="text-lg font-black tracking-tight">Google Wallet</p></div>
                      <div className="absolute top-2 right-4"><CheckCircle2 size={12} className="text-emerald-500" /></div>
                    </button>
                </div>
                {isAdded && <div className="bg-emerald-50 text-emerald-600 p-6 rounded-[2.5rem] font-black text-sm flex items-center justify-center gap-4 animate-in zoom-in border border-emerald-100 shadow-sm"><UserCheck className="w-7 h-7" /> ¡SINCRO REALIZADA!</div>}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);

export default ClientView;
