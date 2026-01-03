
import React, { useState } from 'react';
import { ArrowLeft, Building2, User, Mail, Phone, MapPin, Globe, Upload, CheckCircle2, Key, Eye, EyeOff, Shield, ArrowRight, RefreshCw } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../App';
import { Business } from '../types';

interface SignUpProps {
  onSuccess: (biz: Business) => void;
  onBack: () => void;
  notify: (msg: string, type?: any) => void;
  onOpenLegal: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSuccess, onBack, notify, onOpenLegal }) => {
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    contact_person: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    website: ''
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        notify('Imagen demasiado grande (máx 2MB)', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setLogoFile(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      notify('Debes aceptar los términos y privacidad', 'error');
      return;
    }
    setLoading(true);
    notify('Sincronizando con la red Charlitron...', 'info');

    try {
      let finalLogoUrl = 'https://via.placeholder.com/150';
      
      if (logoFile && logoFile.startsWith('data:')) {
        const base64Data = logoFile.split(',')[1];
        const binary = atob(base64Data);
        const array = [];
        for (let i = 0; i < binary.length; i++) array.push(binary.charCodeAt(i));
        const blob = new Blob([new Uint8Array(array)], { type: 'image/png' });

        const path = `logos/${Date.now()}-biz.png`;
        const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/images/${path}`, {
          method: 'POST',
          headers: { 
            'apikey': SUPABASE_ANON_KEY, 
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'image/png'
          },
          body: blob
        });
        if (uploadRes.ok) finalLogoUrl = `${SUPABASE_URL}/storage/v1/object/public/images/${path}`;
      }

      const businessData = {
        name: formData.name,
        category: formData.category,
        contact_person: formData.contact_person,
        email: formData.email.toLowerCase(),
        password: formData.password,
        phone: formData.phone,
        address: formData.address || null,
        website: formData.website || null,
        logo_url: finalLogoUrl,
        plan_id: 'plan_basic',
        status: 'trial',
        created_at: new Date().toISOString(),
        expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      const res = await fetch(`${SUPABASE_URL}/rest/v1/cc_businesses`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(businessData)
      });

      const data = await res.json();
      
      if (res.ok && Array.isArray(data) && data.length > 0) {
        // Enviar correo de bienvenida automático usando la nueva Edge Function mejorada
        try {
          fetch(`${SUPABASE_URL}/functions/v1/send-welcome-email`, {
            method: 'POST',
            headers: { 
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
              email: formData.email.toLowerCase(),
              name: formData.contact_person,
              business_name: formData.name
            })
          });
        } catch(e) { console.error("Welcome email trigger failed", e); }

        onSuccess(data[0]);
        notify('¡Bienvenido! Revisa tu correo de bienvenida.', 'success');
      } else {
        notify(data.message || 'Error al procesar el registro', 'error');
      }
    } catch (err) {
      notify('Fallo de conexión.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in slide-in-from-bottom-10">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest mb-10 hover:text-blue-600 transition"><ArrowLeft className="w-4 h-4" /> Volver</button>
      
      <div className="bg-white rounded-[4rem] shadow-2xl p-10 md:p-16 border border-slate-100">
        <div className="flex items-center gap-6 mb-12">
           <div className="bg-blue-600 text-white p-5 rounded-3xl shadow-xl"><Building2 className="w-8 h-8" /></div>
           <div><h2 className="text-4xl font-black tracking-tight text-slate-900">Registro Comercial</h2><p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">7 DÍAS DE PRUEBA GRATIS EN PLAN BÁSICO</p></div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-6">
              <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-4">Nombre Comercial</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 p-5 rounded-2xl outline-none border-2 border-transparent focus:border-blue-100 font-bold transition" placeholder="Nombre de tu negocio" /></div>
              <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-4">Giro / Categoría</label><select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full bg-slate-50 p-5 rounded-2xl outline-none border-2 border-transparent focus:border-blue-100 font-bold capitalize transition">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-4">Email de acceso</label><input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value.toLowerCase()})} className="w-full bg-slate-50 p-5 rounded-2xl outline-none border-2 border-transparent focus:border-blue-100 font-bold transition" placeholder="ventas@negocio.com" /></div>
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Crear Contraseña</label>
                <input type={showPass ? 'text' : 'password'} required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 p-5 rounded-2xl outline-none border-2 border-transparent focus:border-blue-100 font-bold transition" placeholder="Contraseña de acceso" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 bottom-5 text-slate-300 hover:text-blue-600 transition">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
           </div>

           <div className="space-y-6">
              <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-4">Persona de Contacto</label><input type="text" required value={formData.contact_person} onChange={e => setFormData({...formData, contact_person: e.target.value})} className="w-full bg-slate-50 p-5 rounded-2xl outline-none border-2 border-transparent focus:border-blue-100 font-bold transition" placeholder="Nombre del dueño o gerente" /></div>
              <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-4">Teléfono WhatsApp</label><input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 p-5 rounded-2xl outline-none border-2 border-transparent focus:border-blue-100 font-bold transition" placeholder="Ej. 4444237092" /></div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Subir Logo (Marca)</label>
                 <div className="relative group aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition hover:border-blue-400">
                    {logoFile ? <img src={logoFile} className="w-full h-full object-contain p-4 transition duration-500 group-hover:scale-105" alt="Preview" /> : <><Upload className="w-8 h-8 text-slate-300 mb-2 transition group-hover:scale-110" /><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Haz clic para elegir archivo</p></>}
                    <input type="file" accept="image/*" onChange={handleLogoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                 </div>
              </div>
           </div>

           <div className="md:col-span-2 pt-8 space-y-6">
              <div className="flex items-center gap-4 bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 cursor-pointer transition hover:bg-blue-50" onClick={() => setAcceptTerms(!acceptTerms)}>
                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${acceptTerms ? 'bg-blue-600 border-blue-600 scale-110 shadow-lg' : 'bg-white border-slate-200'}`}>
                  {acceptTerms && <CheckCircle2 className="w-5 h-5 text-white" />}
                </div>
                <p className="text-xs font-bold text-slate-600 leading-tight">Acepto los <span onClick={(e) => { e.stopPropagation(); onOpenLegal(); }} className="text-blue-600 underline cursor-pointer">Términos de Uso y Privacidad</span>.</p>
              </div>

              <button type="submit" disabled={loading || !acceptTerms} className="w-full bg-blue-600 text-white font-black py-7 rounded-[2rem] hover:bg-blue-700 transition shadow-2xl shadow-blue-100 flex items-center justify-center gap-4 uppercase text-xs tracking-[0.2em] active:scale-95 disabled:opacity-40">
                {loading ? <RefreshCw className="animate-spin" /> : null}
                {loading ? 'Sincronizando...' : <>INICIAR MI PRUEBA DE 7 DÍAS <ArrowRight className="w-5 h-5" /></>}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
