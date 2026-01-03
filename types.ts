
export type BusinessCategory = 'pollería' | 'café' | 'gimnasio' | 'estética' | 'retail' | 'restaurante' | 'otro';
export type SubscriptionStatus = 'active' | 'trial' | 'past_due' | 'expired' | 'suspended' | 'pending_payment';

export interface Business {
  id: string;
  name: string;
  category: BusinessCategory;
  contact_person: string;
  email: string;
  password?: string;
  phone: string;
  address?: string;
  website?: string;
  logo_url: string;
  plan_id: string;
  status: SubscriptionStatus;
  created_at: string;
  expiry_date?: string;
  payment_receipt?: string; // URL de la ficha de depósito
}

export type CardType = 'PROMO' | 'STAMPS' | 'POINTS' | 'DISCOUNT';

export interface Card {
  id: string;
  business_id: string;
  name: string;
  type: CardType;
  config: {
    primary_color: string;
    text_color: string;
    emoji: string;
    hero_url?: string;
    logo_url?: string;
  };
  reward_config: {
    goal: number;
    reward_title: string;
  };
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  level: 'Basic' | 'Pro' | 'Elite';
}
