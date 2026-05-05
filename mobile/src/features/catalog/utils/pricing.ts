import { PricingTier, PricingType } from '@/shared/types';

export const PRICING_TIERS: Record<PricingType, PricingTier[]> = {
  salgado: [
    { qty: 20, price: 7000 },
    { qty: 30, price: 10000 },
    { qty: 40, price: 13000 },
    { qty: 50, price: 16000 },
    { qty: 60, price: 18500 },
    { qty: 70, price: 21000 },
    { qty: 80, price: 23500, bestValue: true },
    { qty: 90, price: 25500, bestValue: true },
    { qty: 100, price: 27500, bestValue: true },
  ],
  doce: [
    { qty: 20, price: 3200 },
    { qty: 30, price: 4500 },
    { qty: 40, price: 5800 },
    { qty: 50, price: 7000 },
    { qty: 60, price: 8200 },
    { qty: 70, price: 9200 },
    { qty: 80, price: 10200, bestValue: true },
    { qty: 90, price: 11000, bestValue: true },
    { qty: 100, price: 12000, bestValue: true },
  ],
  combo: [
    { qty: 40, price: 12000 },
    { qty: 60, price: 17000 },
    { qty: 80, price: 22000 },
    { qty: 100, price: 27000 },
    { qty: 150, price: 39000, bestValue: true },
    { qty: 200, price: 50000, bestValue: true },
    { qty: 250, price: 60000, bestValue: true },
    { qty: 300, price: 69000, bestValue: true },
  ],
  bolo: [
    { qty: 1, price: 2500 },
  ],
};

export function getStartingPrice(pricingType: PricingType): number {
  return PRICING_TIERS[pricingType][0].price;
}

export function getDefaultTier(pricingType: PricingType): PricingTier {
  return PRICING_TIERS[pricingType][0];
}

export function getUnitPrice(tier: PricingTier): number {
  return Math.round(tier.price / tier.qty);
}

export function formatEuro(cents: number): string {
  return `€${(cents / 100).toFixed(2).replace('.', ',')}`;
}
