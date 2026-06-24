import type { Color, ProductVariants } from '../types';

const USD_TO_INR = 84;

export function toINR(usd: number): string {
  return '₹' + Math.round(usd * USD_TO_INR).toLocaleString('en-IN');
}

export function getSelectedColor(variants: ProductVariants, param: string | null): Color {
  return variants.colors.find((c) => c.name === param) ?? variants.colors[0];
}

export function getSelectedSize(variants: ProductVariants, param: string | null): string | null {
  return (
    variants.sizes.find((s) => s.size === param && s.status !== 'sold_out')?.size ??
    variants.sizes.find((s) => s.status !== 'sold_out')?.size ??
    null
  );
}
