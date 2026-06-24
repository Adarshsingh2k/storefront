import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem } from '../types';

const STORAGE_KEY = 'cart';
export const MAX_QTY = 10;

type AddItemPayload = Omit<CartItem, 'id'>;

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(items: CartItem[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* quota */ }
}

const CartContext = createContext<{
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;
  addItem: (payload: AddItemPayload) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(load);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => { save(items); }, [items]);

  const totalItems = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal   = items.reduce((n, i) => n + i.price * i.quantity, 0);

  function addItem(payload: AddItemPayload) {
    const id = `${payload.productId}-${payload.color.name}-${payload.size}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: Math.min(i.quantity + payload.quantity, MAX_QTY) } : i
        );
      }
      return [...prev, { ...payload, id }];
    });
    setIsOpen(true);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i)).filter((i) => i.quantity > 0)
    );
  }

  const value = {
    items,
    isOpen,
    totalItems,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    openCart:  () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    clearCart: () => setItems([]),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
