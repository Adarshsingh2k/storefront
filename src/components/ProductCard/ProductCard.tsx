import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { useCart } from '../../stores/CartContext';
import { getVariantsForProduct } from '../../data/mockVariants';
import { toINR } from '../../utils';
import styles from './ProductCard.module.scss';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const variants = getVariantsForProduct(product.id, product.category, product.price);
  const firstAvailableSize = variants.sizes.find((s) => s.status !== 'sold_out');

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault(); 
    if (!firstAvailableSize) return;

    addItem({
      productId: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
      color: variants.colors[0],
      size: firstAvailableSize.size,
      quantity: 1,
    });
  }

  const isFullySoldOut = variants.sizes.every((s) => s.status === 'sold_out');
  const shortTitle = product.title.length > 55
    ? product.title.slice(0, 52) + '…'
    : product.title;

  return (
    <article className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.imageWrap} tabIndex={-1}>
        <img
          src={product.image}
          alt={product.title}
          className={styles.image}
          loading="lazy"
        />
        
      </Link>

      <div className={styles.body}>
        <p className={styles.brand}>{variants.brand}</p>
        <Link to={`/product/${product.id}`} className={styles.title}>
          {shortTitle}
        </Link>
        <div className={styles.priceRow}>
          <span className={styles.price}>{toINR(product.price)}</span>
          {variants.originalPrice && (
            <span className={styles.originalPrice}>{toINR(variants.originalPrice)}</span>
          )}
        </div>
        <div className={styles.swatches}>
          {variants.colors.map((c) => (
            <span
              key={c.name}
              className={styles.swatch}
              style={{ background: c.hex }}
              title={c.name}
            />
          ))}
        </div>
        {!isFullySoldOut && (
          <button
            className={styles.quickAdd}
            onClick={handleQuickAdd}
          >
            Add
          </button>
        )}
        {isFullySoldOut && (
          <span className={styles.soldOutOverlay}>Sold Out</span>
        )}
      </div>
    </article>
  );
}
