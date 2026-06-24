import type { Color, SizeVariant, ProductVariants } from '../types';

const CLOTHING_COLORS: Color[] = [
  { name: 'Midnight', hex: '#1C2331' },
  { name: 'Ivory', hex: '#EDE8DF' },
  { name: 'Slate', hex: '#62748E' },
  { name: 'Bordeaux', hex: '#7D2035' },
  { name: 'Forest', hex: '#2D5A27' },
];

const ELECTRONICS_COLORS: Color[] = [
  { name: 'Space Gray', hex: '#4A4A4A' },
  { name: 'Silver', hex: '#B8B8B8' },
  { name: 'Midnight Black', hex: '#1A1A1A' },
];

const JEWELRY_COLORS: Color[] = [
  { name: 'Gold', hex: '#D4A853' },
  { name: 'Silver', hex: '#B8B8B8' },
  { name: 'Rose Gold', hex: '#B76E79' },
];

const BRANDS: Record<string, string[]> = {
  "men's clothing":   ['Manyavar', 'FabIndia', 'Peter England'],
  "women's clothing": ['Biba', 'W', 'FabIndia'],
  "jewelery":         ['Tanishq', 'Kalyan', 'PC Jeweller'],
  "electronics":      ['boAt', 'Noise', 'Lava'],
};


function stockForSize(id: number, index: number): SizeVariant['status'] {
  const variant = (id * 3 + index * 7) % 10;
  if (variant === 0) return 'sold_out';
  if (variant <= 2)  return 'low_stock';
  return 'in_stock';
}

export function getVariantsForProduct(
  id: number,
  category: string,
  currentPrice: number,
): ProductVariants {
  const isClothing    = category === "men's clothing" || category === "women's clothing";
  const isElectronics = category === 'electronics';

  const colorPool = isClothing ? CLOTHING_COLORS : isElectronics ? ELECTRONICS_COLORS : JEWELRY_COLORS;
  const colors    = colorPool.slice(0, (id % 2) + 2); 

  const sizePool = isClothing
    ? ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    : isElectronics
    ? ['64 GB', '128 GB', '256 GB']
    : ['5', '6', '7', '8', '9'];

  const sizes: SizeVariant[] = sizePool.map((size, i) => {
    const status = stockForSize(id, i);
    const stock  = status === 'sold_out' ? 0 : status === 'low_stock' ? 2 : 10;
    return { size, status, stock };
  });

  const brand         = (BRANDS[category] ?? ['Generic'])[id % 3];
  const originalPrice = id % 3 !== 0 ? parseFloat((currentPrice * 1.3).toFixed(2)) : undefined;

  return { colors, sizes, originalPrice, brand };
}
