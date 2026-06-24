import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useProduct } from '../../hooks/useProducts';
import { getVariantsForProduct } from '../../data/mockVariants';
import { useCart } from '../../stores/CartContext';
import VariantSelector from '../../components/VariantSelector/VariantSelector';
import QuantityPicker from '../../components/QuantityPicker/QuantityPicker';
import type { Color } from '../../types';
import { toINR, getSelectedColor, getSelectedSize } from '../../utils';
import Skeleton from '../../components/Skeleton/Skeleton';
import styles from './ProductDetail.module.scss';

function buildGallery(image: string) {
  return [image, image, image];
}

type AddState = 'idle' | 'adding' | 'added' | 'error';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id, 10) : undefined;
  const { product, status } = useProduct(productId);
  const { addItem } = useCart();

  const [searchParams, setSearchParams] = useSearchParams();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addState, setAddState] = useState<AddState>('idle');

  
  const variants = product
    ? getVariantsForProduct(product.id, product.category, product.price)
    : null;

  const colorParam = searchParams.get('color');
  const sizeParam  = searchParams.get('size');
  const selectedColor: Color | null = variants ? getSelectedColor(variants, colorParam) : null;
  const selectedSize: string | null = variants ? getSelectedSize(variants, sizeParam)   : null;


  useEffect(() => {
    if (!variants || !selectedColor || !selectedSize) return;
    const params: Record<string, string> = {};
    if (!colorParam) params.color = selectedColor.name;
    if (!sizeParam)  params.size  = selectedSize;
    if (Object.keys(params).length) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(params).forEach(([k, v]) => next.set(k, v));
        return next;
      }, { replace: true });
    }
  }, [variants]);

  function handleColorChange(color: Color) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('color', color.name);
      return next;
    }, { replace: true });
  }

  function handleSizeChange(size: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('size', size);
      return next;
    }, { replace: true });
  }

  const currentVariant = variants?.sizes.find((s) => s.size === selectedSize);
  const isSoldOut = !currentVariant || currentVariant.status === 'sold_out';
  const isLowStock = currentVariant?.status === 'low_stock';

  function handleAddToCart() {
    if (!product || !selectedColor || !selectedSize || isSoldOut) return;
    setAddState('adding');

    setTimeout(() => {
      if (Math.random() < 0.1) { 
        setAddState('error');
        setTimeout(() => setAddState('idle'), 3000);
        return;
      }
      addItem({
        productId: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        color: selectedColor,
        size: selectedSize,
        quantity,
      });
      setAddState('added');
      setTimeout(() => setAddState('idle'), 2000);
    }, 600);
  }

  if (status === 'loading') return (
    <main className={styles.main}>
      <div className="page-wrapper">
        <div className={styles.layout}>
          <div className={styles.gallery}>
            <Skeleton height="400px" borderRadius="8px" />
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              {[0, 1, 2].map((i) => <Skeleton key={i} width="72px" height="72px" borderRadius="8px" />)}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[40, 80, 30, 100, 120, 60].map((w, i) => <Skeleton key={i} width={`${w}%`} height="20px" />)}
          </div>
        </div>
      </div>
    </main>
  );

  if (status === 'error' || !product) {
    return (
      <main className={styles.errorPage}>
        <p className={styles.errorTitle}>Product not found</p>
        <Link to="/" className={styles.back}>← Back to products</Link>
      </main>
    );
  }

  const gallery = buildGallery(product.image);

  return (
    <main className={styles.main}>
      <div className="page-wrapper">
        <nav className={styles.breadcrumb}>
          <Link to="/">Products</Link>
          <span>›</span>
          <span className={styles.breadcrumbCategory}>
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </span>
        </nav>

        <div className={styles.layout}>
          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              <img
                src={gallery[activeImage]}
                alt={product.title}
                className={styles.mainImg}
              />
              {variants?.originalPrice && (
                <span className={styles.saleBadge}>Sale</span>
              )}
            </div>

            <div className={styles.thumbnails}>
              {gallery.map((src, i) => (
                <button
                  key={i}
                 
                  className={styles.thumb}
                  data-active={activeImage === i}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={src} alt={`${product.title} view ${i + 1}`} className={styles.thumbImg} />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.info}>
            <p className={styles.brand}>{variants?.brand}</p>
            <h1 className={styles.title}>{product.title}</h1>

            <div className={styles.ratingRow}>
              <StarRating rate={product.rating.rate} />
              <span className={styles.ratingText}>
                {product.rating.rate.toFixed(1)} ({product.rating.count} reviews)
              </span>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.price}>{toINR(product.price)}</span>
              {variants?.originalPrice && (
                <>
                  <span className={styles.originalPrice}>
                    {toINR(variants.originalPrice)}
                  </span>
                  <span className={styles.discount}>
                    {Math.round((1 - product.price / variants.originalPrice) * 100)}% off
                  </span>
                </>
              )}
            </div>

            {variants && selectedColor && (
              <div className={styles.variants}>
                <VariantSelector
                  colors={variants.colors}
                  sizes={variants.sizes}
                  selectedColor={selectedColor}
                  selectedSize={selectedSize}
                  onColorChange={handleColorChange}
                  onSizeChange={handleSizeChange}
                />
              </div>
            )}

            {isLowStock && !isSoldOut && (
              <p className={styles.stockMsg} data-status="low">
                ⚡ Only {currentVariant?.stock} left in stock
              </p>
            )}
            {isSoldOut && (
              <p className={styles.stockMsg} data-status="out">
                This size is sold out
              </p>
            )}

            <div className={styles.addRow}>
              <QuantityPicker
                value={quantity}
                onChange={setQuantity}
                disabled={isSoldOut}
              />
              <button
                className={styles.addBtn}
                onClick={handleAddToCart}
                disabled={isSoldOut || addState === 'adding'}
                data-state={addState}
              >
                {addState === 'adding' && 'Adding…'}
                {addState === 'added'  && '✓ Added!'}
                {addState === 'error'  && 'Failed — try again'}
                {addState === 'idle'   && (isSoldOut ? 'Sold Out' : 'Add to Cart')}
              </button>
            </div>

            <details className={styles.details}>
              <summary className={styles.detailsSummary}>Product details</summary>
              <p className={styles.description}>{product.description}</p>
            </details>

            <div className={styles.deliveryNote}>
              <ShippingIcon />
              <span>Free shipping on orders over $75</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


function StarRating({ rate }: { rate: number }) {
  const filled = Math.round(rate);
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={styles.star} data-filled={n <= filled}>★</span>
      ))}
    </div>
  );
}

function ShippingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}
