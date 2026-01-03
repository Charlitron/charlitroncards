
import React from 'react';
import { Shield, FileText, X } from 'lucide-react';

interface LegalPageProps {
  onClose: () => void;
}

const LegalPage: React.FC<LegalPageProps> = ({ onClose }) => {
  return (
    <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in duration-300">
      <div className="bg-slate-900 text-white p-10 md:p-16 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Legal Charlitron</h1>
              <p className="text-slate-400 text-lg font-medium italic">Aviso de Privacidad y Términos de Uso</p>
            </div>
            <button 
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 p-4 rounded-full backdrop-blur-md transition-all active:scale-90"
            >
              <X className="w-8 h-8 text-white" />
            </button>
          </div>
        </div>
        <Shield className="absolute -bottom-10 -right-10 w-64 h-64 text-slate-800/50" />
      </div>

      <div className="p-8 md:p-20 space-y-12 leading-relaxed bg-white">
        {/* Section: Privacy */}
        <section className="space-y-8">
          <h2 className="text-3xl font-black text-blue-600 flex items-center gap-4">
            <Shield className="w-10 h-10" /> Aviso de Privacidad
          </h2>
          <div className="space-y-6 text-slate-600 text-lg">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <p className="font-black text-slate-900 mb-2">1. Responsable del tratamiento</p>
              <p>Charlitron, con domicilio en Lanzagorta 330, colonia San Sebastián, San Luis Potosí, S.L.P., México, es responsable del tratamiento de los datos personales recabados a través del sitio web y plataforma “Charlitron Cards”.</p>
              <p className="mt-4">Contacto: <span className="text-blue-600 font-black">ventas@charlitron.com</span></p>
            </div>

            <div className="space-y-4">
              <p className="font-black text-slate-900">2. Datos personales que se recaban</p>
              <ul className="list-disc pl-8 space-y-3 font-medium">
                <li><b className="text-slate-900">De negocios:</b> Nombre comercial, contacto, correo, teléfono, giro, ubicación.</li>
                <li><b className="text-slate-900">De clientes:</b> Nombre, correo electrónico, teléfono y datos de uso de la tarjeta.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <p className="font-black text-slate-900">3. Finalidades del tratamiento</p>
              <p>Administrar cuentas de negocio, emitir tarjetas digitales, enviar notificaciones geolocalizadas y generar estadísticas de uso para optimizar tus campañas BTL.</p>
            </div>
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* Section: Terms */}
        <section className="space-y-8">
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4">
            <FileText className="w-10 h-10 text-blue-600" /> Términos y Condiciones
          </h2>
          <div className="space-y-6 text-slate-600 text-lg">
            <div className="space-y-4">
              <p className="font-black text-slate-900">1. Objeto de la Plataforma</p>
              <p>Charlitron Cards es una herramienta tecnológica para que negocios migren sus volantes físicos a tarjetas digitales inteligentes.</p>
            </div>

            <div className="space-y-4">
              <p className="font-black text-slate-900">4. Responsabilidad del negocio</p>
              <p>Cada negocio es responsable único de sus promociones, descuentos y reglas de lealtad ofrecidas. Charlitron solo provee la infraestructura técnica.</p>
            </div>
          </div>
        </section>
        
        <div className="pt-10">
          <button 
            onClick={onClose}
            className="w-full bg-slate-900 text-white font-black py-6 rounded-3xl hover:bg-black transition-all shadow-xl active:scale-95 uppercase tracking-widest"
          >
            ENTENDIDO Y CERRAR
          </button>
        </div>
      </div>

      <div className="p-10 bg-slate-50 text-center border-t border-slate-100">
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.5em]">Charlitron Ecosystem • 2025</p>
      </div>
    </div>
  );
};

export default LegalPage;
