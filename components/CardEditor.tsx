
import React, { useState, useEffect } from 'react';
import { X, Palette, Image as ImageIcon, Upload, Gift, Target, Smartphone, Trophy, MapPin, RefreshCw } from 'lucide-react';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../App';

interface CardEditorProps {
  businessId?: string;
  businessName?: string;
  address?: string;
  existingCard?: any; // Añadido para edición
  onClose: () => void;
  notify: (msg: string, type?: any) => void;
}

const CardEditor: React.FC<CardEditorProps> = ({ businessId, businessName, address, existingCard, onClose, notify }) => {
  const [step, setStep] = useState(1);
  const [logoFile, setLogoFile] = useState<string | null>(existingCard?.config?.logo_url || null);
  const [heroFile, setHeroFile] = useState<string | null>(existingCard?.config?.hero_url || null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: existingCard?.name || 'Cliente Frecuente',
    type: existingCard?.type || 'STAMPS' as 'STAMPS' | 'POINTS',
    goal: existingCard?.reward_config?.goal || 5,
    rewardTitle: existingCard?.reward_config?.reward_title || '1 Pollo Gratis',
    primaryColor: existingCard?.config?.primary_color || '#2563eb',
    textColor: existingCard?.config?.text_color || '#ffffff',
    emoji: existingCard?.config?.emoji || '🍗'
  });

  const uploadFile = async (base64: string, name: string) => {
    try {
      const base64Data = base64.split(',')[1];
      const binary = atob(base64Data);
      const array = [];
      for (let i = 0; i < binary.length; i++) array.push(binary.charCodeAt(i));
      const blob = new Blob([new Uint8Array(array)], { type: 'image/png' });
      const path = `cards/${businessId}/${Date.now()}-${name}.png`;
      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/images/${path}`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'image/png' },
        body: blob
      });
      if (res.ok) return `${SUPABASE_URL}/storage/v1/object/public/images/${path}`;
      return null;
    } catch (err) { return null; }
  };

  const handleFinish = async () => {
    setLoading(true);
    notify(existingCard ? 'Actualizando volante digital...' : 'Publicando tu volante digital...', 'info');
    let finalLogo = logoFile;
    let finalHero = heroFile;
    
    if (logoFile?.startsWith('data:')) finalLogo = await uploadFile(logoFile, 'logo');
    if (heroFile?.startsWith('data:')) finalHero = await uploadFile(heroFile, 'hero');

    const cardData = {
      business_id: businessId,
      name: formData.name,
      type: formData.type,
      config: { primary_color: formData.primaryColor, text_color: formData.textColor, emoji: formData.emoji, hero_url: finalHero, logo_url: finalLogo },
      reward_config: { goal: formData.goal, reward_title: formData.rewardTitle }
    };

    try {
      const url = existingCard ? `${SUPABASE_URL}/rest/v1/cc_cards?id=eq.${existingCard.id}` : `${SUPABASE_URL}/rest/v1/cc_cards`;
      const method = existingCard ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(cardData)
      });

      if (res.ok) { 
        notify(existingCard ? '¡Éxito! Volante actualizado.' : '¡Éxito! Volante publicado y listo para usar.', 'success'); 
        onClose(); 
      }
      else notify('Error al procesar el volante.', 'error');
    } catch (err) { notify('Error de red.', 'error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-2xl flex justify-end">
      <div className="w-full max-w-5xl bg-white h-full flex flex-col animate-in slide-in-from-right duration-500 shadow-[-50px_0_100px_rgba(0,0,0,0.2)]">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
           <div><h2 className="text-3xl font-black tracking-tighter">Editor Pro Charlitron</h2><p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Paso {step} de 2 • {existingCard ? 'Modificar' : 'Configuración'} Visual</p></div>
           <button onClick={onClose} className="p-4 hover:bg-white rounded-full transition shadow-sm"><X size={32} className="text-slate-300"/></button>
        </div>

        <div className="flex-1 overflow-auto flex">
           <div className="flex-1 p-12 space-y-12 max-w-xl bg-white shadow-2xl overflow-y-auto border-r border-slate-50">
              {step === 1 && (
                <div className="space-y-10 animate-in fade-in">
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Logo Negocio</label><div className="aspect-square bg-slate-50 border-4 border-dashed rounded-[2.5rem] flex items-center justify-center relative overflow-hidden group hover:border-blue-400 transition">{logoFile ? <img src={logoFile} className="w-full h-full object-contain p-4" /> : <Upload className="text-slate-200 group-hover:scale-110 transition" />}<input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => { const f = e.target.files?.[0]; if(f){ const r = new FileReader(); r.onloadend = () => setLogoFile(r.result as string); r.readAsDataURL(f); } }} /></div></div>
                      <div className="space-y-3"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Imagen Banner</label><div className="aspect-square bg-slate-50 border-4 border-dashed rounded-[2.5rem] flex items-center justify-center relative overflow-hidden group hover:border-blue-400 transition">{heroFile ? <img src={heroFile} className="w-full h-full object-cover" /> : <ImageIcon className="text-slate-200 group-hover:scale-110 transition" />}<input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => { const f = e.target.files?.[0]; if(f){ const r = new FileReader(); r.onloadend = () => setHeroFile(r.result as string); r.readAsDataURL(f); } }} /></div></div>
                   </div>
                   <div className="space-y-6">
                      <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-4">Nombre de la Campaña</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 p-6 rounded-[2rem] font-black border-2 border-transparent focus:border-blue-500 shadow-inner" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-4">Color de Marca</label><input type="color" value={formData.primaryColor} onChange={e => setFormData({...formData, primaryColor: e.target.value})} className="w-full h-16 bg-white p-2 rounded-[1.5rem] cursor-pointer shadow-sm" /></div>
                   </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-10 animate-in fade-in">
                   <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl border-b-8 border-blue-600"><h4 className="font-black text-2xl mb-8 flex items-center gap-3"><Trophy className="text-blue-400"/> Lógica de Lealtad</h4><button onClick={() => setFormData({...formData, type: 'STAMPS'})} className={`w-full p-8 rounded-[2.5rem] border-2 flex items-center gap-6 transition-all ${formData.type === 'STAMPS' ? 'bg-blue-600 border-blue-400 shadow-xl' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}><span className="text-4xl">{formData.emoji}</span><span className="font-black text-xl">Sello por Visita</span></button></div>
                   <div className="space-y-6"><label className="text-[10px] font-black uppercase text-slate-400 ml-4">Premio / Recompensa Final</label><input type="text" value={formData.rewardTitle} onChange={e => setFormData({...formData, rewardTitle: e.target.value})} className="w-full bg-slate-50 p-8 rounded-[2.5rem] font-black text-xl outline-none shadow-inner border-2 border-transparent focus:border-blue-100" placeholder="Ej: 1 Pollo Gratis" /></div>
                   <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-4">Meta de Visitas</label><input type="range" min="3" max="15" value={formData.goal} onChange={e => setFormData({...formData, goal: parseInt(e.target.value)})} className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600" /><div className="flex justify-between font-black text-xs text-slate-400 px-2 uppercase"><span>3 Visitas</span><span>{formData.goal} Visitas</span><span>15 Visitas</span></div></div>
                </div>
              )}
           </div>

           <div className="flex-1 p-12 flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
              <div className="w-full max-w-sm relative z-10 animate-in slide-in-from-bottom-10">
                <div className="rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden min-h-[620px] border-[14px] border-slate-900 flex flex-col transition-colors duration-500" style={{ backgroundColor: formData.primaryColor, color: formData.textColor }}>
                  <div className="h-64 relative overflow-hidden group">
                    {heroFile ? <img src={heroFile} className="w-full h-full object-cover transition group-hover:scale-110" /> : <div className="w-full h-full bg-black/40" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-8 left-8 flex items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-2xl overflow-hidden border-2 border-white/20">
                        {logoFile ? <img src={logoFile} className="w-full h-full object-contain p-2" /> : formData.emoji}
                      </div>
                      <div className="text-white drop-shadow-lg">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-80 leading-none mb-1">{businessName || 'Charlitron Biz'}</p>
                        <h3 className="text-xl font-black leading-none">{formData.name}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-10 flex-1 flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="bg-white/10 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-inner">
                        <p className="text-[10px] font-black uppercase opacity-60 mb-2">Estado Actual</p>
                        <p className="text-4xl font-black tracking-tight">0 / {formData.goal}</p>
                        <div className="h-2.5 bg-white/20 rounded-full mt-5 overflow-hidden"><div className="h-full bg-white w-[8%]" /></div>
                      </div>
                      <div className="flex items-start gap-2 opacity-60 px-2"><MapPin size={12} className="shrink-0 mt-0.5" /><p className="text-[10px] font-bold leading-tight uppercase tracking-widest">{address || 'Sin ubicación registrada'}</p></div>
                    </div>
                    <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-2 mt-8 transform rotate-1">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PREVIEW" className="w-28 h-28" alt="QR" />
                      <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.6em]">CARD ID</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/5 rounded-full blur-[120px] -z-10" />
           </div>
        </div>

        <div className="p-8 border-t border-slate-100 flex justify-end gap-6 bg-slate-50">
           <button onClick={onClose} className="px-10 py-4 font-black text-rose-500 uppercase text-xs tracking-widest hover:bg-rose-50 rounded-2xl transition">CERRAR EDITOR</button>
           <button onClick={() => step < 2 ? setStep(2) : handleFinish()} disabled={loading} className="bg-blue-600 text-white px-16 py-5 rounded-[2rem] font-black shadow-2xl uppercase text-xs tracking-widest transition-all hover:bg-blue-700 active:scale-95 flex items-center gap-3">
              {loading ? <RefreshCw className="animate-spin w-4 h-4"/> : null}
              {loading ? 'PROCESANDO...' : (step < 2 ? 'Continuar' : (existingCard ? 'Actualizar Ahora' : 'Publicar Ahora'))}
           </button>
        </div>
      </div>
    </div>
  );
};

export default CardEditor;
