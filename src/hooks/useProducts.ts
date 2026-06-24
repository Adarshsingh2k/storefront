import { useState, useEffect } from 'react';
import type { Product, LoadingState } from '../types';

const API_BASE = 'https://fakestoreapi.com';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadingState>('idle');

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      setStatus('loading');

      try {
        const response = await fetch(`${API_BASE}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');

        const data = (await response.json()) as Product[];

        if (!cancelled) {
          setProducts(data);
          setStatus('success');
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    };

    void loadProducts();

    return () => { cancelled = true; };
  }, []);

  return { products, status };
}

export function useProduct(id: number | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<LoadingState>('idle');

  useEffect(() => {
    if (id === undefined) return;

    let cancelled = false;

    const loadProduct = async () => {
      setStatus('loading');
      setProduct(null);

      try {
        const response = await fetch(`${API_BASE}/products/${id}`);
        if (!response.ok) throw new Error('Product not found');

        const data = (await response.json()) as Product;

        if (!cancelled) {
          setProduct(data);
          setStatus('success');
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    };

    void loadProduct();

    return () => { cancelled = true; };
  }, [id]);

  return { product, status };
}
