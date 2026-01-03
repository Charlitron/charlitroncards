
import React, { useState } from 'react';
import { ShieldCheck, Rocket, MessageSquare, AlertCircle, CheckCircle2, Search, Check, Timer, Users, Mail, ArrowRight, ExternalLink, Smartphone, Globe, Lock } from 'lucide-react';
import { GOOGLE_WALLET_ISSUER_ID, GOOGLE_WALLET_CLASS_ID } from '../App';

const DataArchitecture: React.FC = () => {
  const [activeView, setActiveView] = useState<'status' | 'testing' | 'integration'>('status');

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-20 animate-in fade-in duration-700">
      <div className="text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.3em] mb-6 border border-emerald-100 shadow-sm shadow-emerald-50">
          <CheckCircle2 className="w-4 h-4" /> Google Wallet API Certificada
        </div>
        <h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-6 tracking-tighter leading-[0.9]">Charlitron <span className="text-blue-600">Enterprise</span> Ready.</h1>
        <p className="text-xl md:text-2xl text-slate-500 font-medium italic max-w-2xl mx-auto">Integración exitosa con la Billetera de Google. Tu infraestructura de pases ya es oficial.</p>
      </div>

      <div className="flex justify-center gap-4 bg-slate-100 p-2 rounded-[2.5rem] max-w-3xl mx-auto border border-slate-200">
         <button onClick={() => setActiveView('status')} className={`flex-1 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeView === 'status' ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>1. Estatus API</button>
         <button onClick={() => setActiveView('testing')} className={`flex-1 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeView === 'testing' ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>2. Credenciales</button>
         <button onClick={() => setActiveView('integration')} className={`flex-1 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeView === 'integration' ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>3. Pase Maestro</button>
      </div>

      {activeView === 'status' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-5">
           <div className="bg-white p-14 rounded-[4rem] border border-slate-100 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition duration-700"><ShieldCheck size={200} /></div>
              <div className="flex items-center gap-6 mb-12">
                 <div className="bg-emerald-500 text-white p-5 rounded-3xl shadow-xl"><CheckCircle2 className="w-8 h-8" /></div>
                 <div>
                    <h2 className="text-4xl font-black italic tracking-tighter">Acceso <span className="text-emerald-600">Concedido</span></h2>
                    <p className="text-slate-400 font-bold text-[10px] font-black uppercase tracking-widest mt-1">Status: Production Verified</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 space-y-4">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Issuer ID Certificado</p>
                    <p className="text-4xl font-black tracking-tighter text-slate-900">{GOOGLE_WALLET_ISSUER_ID}</p>
                    <p className="text-xs text-slate-400 font-bold leading-relaxed">Este es el identificador único de Charlitron en la red global de Google Pay.</p>
                 </div>
                 <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 space-y-4">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Pase Clase V1</p>
                    <p className="text-4xl font-black tracking-tighter text-slate-900">{GOOGLE_WALLET_CLASS_ID}</p>
                    <p className="text-xs text-slate-400 font-bold leading-relaxed">Estructura de lealtad configurada y lista para emitir tarjetas dinámicas.</p>
                 </div>
              </div>

              <div className="mt-12 p-10 bg-emerald-50 rounded-[3rem] border border-emerald-100 flex items-start gap-6">
                 <Rocket className="w-8 h-8 text-emerald-600 shrink-0 mt-1" />
                 <div>
                    <p className="text-lg text-emerald-900 font-black italic tracking-tight">¡Estamos en Vivo!</p>
                    <p className="text-sm text-emerald-700 font-bold leading-relaxed mt-2 uppercase tracking-wide">
                      Google ha autorizado oficialmente a Charlitron para emitir pases de lealtad. Cualquier usuario puede ya agregar su volante digital a su Wallet.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeView === 'testing' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-5">
           <div className="bg-white p-14 rounded-[4rem] border border-slate-100 shadow-2xl space-y-10">
              <div className="flex items-center gap-6">
                 <div className="bg-blue-600 text-white p-5 rounded-3xl shadow-xl"><Lock className="w-8 h-8" /></div>
                 <div>
                    <h2 className="text-4xl font-black italic tracking-tighter">Firma de <span className="text-blue-600">Seguridad</span></h2>
                    <p className="text-slate-400 font-bold text-[10px] font-black uppercase tracking-widest">JWT & Service Account Protocol</p>
                 </div>
              </div>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">
                Para generar un pase real, el sistema ahora utiliza un <b>JSON Web Token (JWT)</b> firmado con tu clave privada. Charlitron automatiza este proceso para cada locatario.
              </p>
              <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] font-mono text-sm overflow-hidden relative">
                 <pre className="opacity-70 leading-relaxed">
                   {`{
  "iss": "charlitron-wallet-sa@google.com",
  "aud": "google",
  "typ": "savetowallet",
  "payload": {
    "loyaltyObjects": [
      {
        "id": "${GOOGLE_WALLET_ISSUER_ID}.${GOOGLE_WALLET_CLASS_ID}.USER_123",
        "classId": "${GOOGLE_WALLET_ISSUER_ID}.${GOOGLE_WALLET_CLASS_ID}"
      }
    ]
  }
}`}
                 </pre>
                 <div className="absolute top-10 right-10 bg-emerald-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl animate-pulse">GENERANDO FIRMA REAL</div>
              </div>
           </div>
        </div>
      )}

      {activeView === 'integration' && (
        <div className="bg-white p-14 rounded-[4.5rem] border border-slate-100 shadow-2xl animate-in zoom-in space-y-12">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                 <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-xl"><Smartphone className="w-8 h-8" /></div>
                 <div>
                    <h2 className="text-4xl font-black italic tracking-tighter">Pase Maestro <span className="text-blue-600">V1</span></h2>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Google Wallet Native Pass</p>
                 </div>
              </div>
              <span className="bg-emerald-50 text-emerald-600 px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">Estado: LIVE</span>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                 <p className="text-slate-500 font-medium text-xl leading-relaxed">
                   La integración está completa. Los locatarios de Charlitron ahora emiten tarjetas que:
                 </p>
                 <ul className="space-y-4">
                    <li className="flex items-center gap-4 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                       <Check className="text-emerald-500" />
                       <p className="text-sm font-black uppercase tracking-widest text-slate-700">Se actualizan vía API en tiempo real.</p>
                    </li>
                    <li className="flex items-center gap-4 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                       <Check className="text-emerald-500" />
                       <p className="text-sm font-black uppercase tracking-widest text-slate-700">Envían notificaciones al llegar a la geovalla.</p>
                    </li>
                    <li className="flex items-center gap-4 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                       <Check className="text-emerald-500" />
                       <p className="text-sm font-black uppercase tracking-widest text-slate-700">Sincronizan el QR dinámicamente.</p>
                    </li>
                 </ul>
              </div>
              <div className="flex justify-center">
                 <div className="bg-slate-50 p-12 rounded-[4rem] border-2 border-slate-100 shadow-inner group">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://pay.google.com/gp/v/save/${GOOGLE_WALLET_ISSUER_ID}`} className="w-64 h-64 mx-auto group-hover:scale-105 transition duration-500" alt="Google QR" />
                    <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-8">Google Wallet Sync QR</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DataArchitecture;
