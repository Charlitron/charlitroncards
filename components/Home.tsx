
import React from 'react';
import { ArrowRight, Smartphone, Zap, MousePointer2, Megaphone, Palette, MessageSquare, Code, ShieldCheck, CreditCard } from 'lucide-react';
import { Plan } from '../types';
import Pricing from './Pricing';

interface HomeProps {
  onStart: () => void;
  onOpenLegal: () => void;
  onOpenArchitecture: () => void;
  plans: Plan[];
  background: string;
}

const Home: React.FC<HomeProps> = ({ onStart, onOpenLegal, onOpenArchitecture, plans, background }) => {
  const WHATSAPP_LINK = "https://wa.me/5214444237092?text=Hola,%20necesito%20ayuda%20con%20Charlitron%20Cards";

  return (
    <div className="flex flex-col">
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 overflow-hidden">
        <div className="absolute inset-0 z-0"><img src={background} className="w-full h-full object-cover" alt="Background" /><div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/40 md:bg-gradient-to-r md:from-white md:via-white/90 md:to-transparent" /></div>
        <div className="max-w-6xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-10 border border-blue-100 shadow-sm shadow-blue-50">
              <Zap className="w-3.5 h-3.5 fill-current" /> MARKETING PHYGITAL
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
              Charlitron Cards:<br />
              <span className="text-blue-600 drop-shadow-sm">tu volante digital.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 mb-12 max-w-xl font-medium leading-relaxed">
              Crea tarjetas de lealtad inteligentes que viven en el celular de tus clientes. Olvida el papel, migra al futuro.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-16">
              <button onClick={onStart} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-14 py-6 rounded-[2.5rem] text-xl font-black shadow-2xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3 group">
                REGISTRARME AHORA <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition" />
              </button>
            </div>
            
            {/* Wallet Badges - CSS/SVG Version to fix broken images */}
            <div className="flex flex-wrap items-center gap-4 opacity-80">
              <div className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-xl border border-white/10 group cursor-default">
                <div className="bg-white/20 p-1.5 rounded-lg"><Smartphone className="w-5 h-5" /></div>
                <div className="leading-none text-left">
                  <p className="text-[8px] uppercase tracking-widest opacity-60">Add to</p>
                  <p className="text-sm font-black tracking-tight">Apple Wallet</p>
                </div>
              </div>
              <div className="bg-white text-slate-900 px-6 py-3 rounded-xl flex items-center gap-3 shadow-xl border border-slate-100 group cursor-default">
                <div className="bg-blue-600 text-white p-1.5 rounded-lg"><CreditCard className="w-5 h-5" /></div>
                <div className="leading-none text-left">
                  <p className="text-[8px] uppercase tracking-widest opacity-40">Add to</p>
                  <p className="text-sm font-black tracking-tight text-slate-900">Google Wallet</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-center animate-in zoom-in duration-1000">
            <div className="bg-slate-900/5 backdrop-blur-2xl p-6 rounded-[5rem] border border-white/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] rotate-3">
              <div className="bg-white rounded-[4.5rem] w-80 aspect-[9/18.5] shadow-2xl border-[14px] border-slate-900 overflow-hidden relative">
                <div className="absolute top-0 w-full h-1/2 bg-blue-600 p-10 flex flex-col justify-between">
                  <div className="flex justify-between items-center"><div className="w-10 h-10 bg-white/20 rounded-xl" /><div className="w-5 h-5 bg-white/20 rounded-full" /></div>
                  <div><p className="text-[11px] font-black text-white/50 uppercase tracking-[0.3em] mb-1">Pollería Don Juan</p><h4 className="text-white font-black text-2xl tracking-tight">Cliente VIP</h4></div>
                </div>
                <div className="absolute bottom-0 w-full h-1/2 bg-white p-10 flex flex-col items-center justify-center gap-5">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CH-1992" className="w-36 h-36 drop-shadow-lg" alt="Demo QR" />
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">ESCANEADO EN CAJA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-32 px-6 border-y border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-10 leading-[1.1] tracking-tighter">Adiós a los volantes de papel.</h2>
          <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed mb-16">
            Con Charlitron Cards tus promociones no terminan en la basura. Viven en la billetera digital de tus clientes, recordándoles volver con notificaciones geolocalizadas.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner"><Smartphone className="w-6 h-6" /></div>
              <h4 className="text-xl font-black mb-3">Siempre a la mano</h4>
              <p className="text-slate-500 text-sm font-bold leading-relaxed uppercase tracking-wide">Nunca se pierde ni se arruga. Está en su Apple o Google Wallet.</p>
            </div>
            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner"><Zap className="w-6 h-6" /></div>
              <h4 className="text-xl font-black mb-3">Push Inteligente</h4>
              <p className="text-slate-500 text-sm font-bold leading-relaxed uppercase tracking-wide">Envía ofertas directas sin pagar publicidad en Meta o Google.</p>
            </div>
            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner"><ShieldCheck className="w-6 h-6" /></div>
              <h4 className="text-xl font-black mb-3">Data Real</h4>
              <p className="text-slate-500 text-sm font-bold leading-relaxed uppercase tracking-wide">Mide exactamente cuántas personas tienen tu tarjeta y cuántas regresan.</p>
            </div>
          </div>
        </div>
      </section>

      <Pricing onSelectPlan={() => onStart()} plans={plans} />
      
      <footer className="bg-slate-900 py-20 px-6 text-center text-white overflow-hidden relative">
         <div className="max-w-5xl mx-auto flex flex-col items-center gap-10 relative z-10">
            <div className="flex items-center gap-4 grayscale brightness-200 opacity-30">
              <img src="https://static.wixstatic.com/media/7fb206_893f39bbcc1d4a469839dce707985bf7~mv2.png/v1/fill/w_314,h_314,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/charlitron-logo.png" className="w-10" alt="Logo Footer" />
              <span className="font-black text-xl tracking-tight">Charlitron Ecosystem</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
               <button onClick={(e) => { e.preventDefault(); onOpenLegal(); }} className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition">Privacidad</button>
               <button onClick={(e) => { e.preventDefault(); onOpenArchitecture(); }} className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition flex items-center gap-2"><Code className="w-3 h-3"/> API Docs</button>
               <a href={WHATSAPP_LINK} target="_blank" className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-400 hover:text-emerald-300 transition flex items-center gap-2 underline decoration-2 underline-offset-8">Ventas WhatsApp</a>
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.8em] text-slate-700 mt-8">The Smart Way to Flyer • © 2025</p>
         </div>
      </footer>
    </div>
  );
};

export default Home;
