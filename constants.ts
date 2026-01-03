
import { Plan, Business } from './types';

export const CATEGORIES = [
  'pollería', 'café', 'gimnasio', 'estética', 'retail', 'restaurante', 'otro'
];

export const PLANS: Plan[] = [
  {
    id: 'plan_basic',
    name: 'Volante Digital Básico',
    price: '$99',
    level: 'Basic',
    // Added missing description property to satisfy Plan interface
    description: 'Ideal para pequeños negocios que inician su digitalización con una sucursal.',
    features: [
      '1 negocio / 1 sucursal',
      '1 tipo de tarjeta',
      'Campañas limitadas',
      'Estadísticas básicas'
    ]
  },
  {
    id: 'plan_pro',
    name: 'Volante Digital Pro',
    price: '$299',
    level: 'Pro',
    // Added missing description property to satisfy Plan interface
    description: 'Para negocios en crecimiento que buscan automatización con IA y geolocalización.',
    features: [
      'Multi-sucursal',
      'Múltiples tipos de tarjetas',
      'Notificaciones geolocalizadas',
      'IA para sugerencias de texto',
      'Descuento en Charlitron Maps'
    ]
  },
  {
    id: 'plan_elite',
    name: 'Volante Digital Elite BTL',
    price: '$999',
    level: 'Elite',
    // Added missing description property to satisfy Plan interface
    description: 'La solución total para marcas que requieren presencia física (BTL) y digital.',
    features: [
      'Todo lo del plan Pro',
      'Servicios BTL (Perifoneo/Activaciones)',
      'Impresión de soporte físico',
      'Asesoría estratégica 1-on-1',
      'Soporte prioritario'
    ]
  }
];

export const MOCK_BUSINESSES: Business[] = []; // Limpiamos los negocios fantasma

export const MOCK_BUSINESS = null;
