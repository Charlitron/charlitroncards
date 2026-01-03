
import React from 'react';
import { Check, Star } from 'lucide-react';
import { Plan } from '../types';

interface PricingProps {
  onSelectPlan: (plan: Plan) => void;
  plans: Plan[];
}

const Pricing: React.FC<PricingProps> = ({ onSelectPlan, plans }) => {
  return (
    <div className="bg-slate-50 py-32 px-6">
      <div className="max-w-7xl mx-auto text-center mb-24">
        <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-none">
          Planes diseñados para <br /><span className="text-blue-600">tu crecimiento</span>
        </h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium italic">
          Sin contratos forzosos. Elige el nivel de impacto que tu negocio necesita hoy.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative flex flex-col p-12 rounded-[4rem] border-2 bg-white shadow-sm transition-all hover:shadow-3xl hover:-translate-y-2 ${plan.level === 'Pro' ? 'border-orange-500 ring-8 ring-orange-50' : 'border-slate-100'}`}
          >
            {plan.level === 'Pro' && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
                <Star className="w-3.5 h-3.5 inline-block mr-2 mb-0.5 fill-current" /> Recomendado
              </div>
            )}
            
            <div className="mb-12 text-center">
              <h3 className="text-2xl font-black mb-6 text-slate-900 uppercase tracking-tighter">{plan.name}</h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                <span className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">/ mes</span>
              </div>
            </div>

            <div className="flex-1 space-y-4 mb-14">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-4 mb-6 text-center">Beneficios Incluidos</p>
              <p className="text-xs font-bold text-slate-600 leading-relaxed text-center whitespace-pre-line px-2">
                {plan.description}
              </p>
            </div>

            <button 
              onClick={() => onSelectPlan(plan)}
              className={`w-full py-6 rounded-[2.5rem] font-black transition-all shadow-2xl active:scale-95 uppercase text-xs tracking-widest ${
                plan.level === 'Pro' 
                  ? 'bg-orange-500 text-white hover:bg-orange-600' 
                  : 'bg-slate-900 text-white hover:bg-blue-600'
              }`}
            >
              ¡Comenzar Gratis Ahora!
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
