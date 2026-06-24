import { useState, useMemo } from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './Home.module.scss';

const CATEGORIES = ['All', "men's clothing", "women's clothing", 'jewelery', 'electronics'];

export default function Home() {
  const { products, status } = useProducts();
  const [activeCategory, setActiveCategory] = useState('All');
  

  const filtered = useMemo(() => {
    let list = activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory);
      return list
  }, [products, activeCategory]);

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className="page-wrapper">
          <h1 className={styles.heroTitle}>Check our exclusive collection</h1>
        </div>
      </section>

      <div className="page-wrapper">
        {/* Controls */}
        <div className={styles.controls}>
          {/* Category filter */}
          <nav className={styles.filters}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={styles.filterBtn}
                data-active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
               
              >
                {cat === 'All' ? 'All products' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </nav>

        </div>

        {/* {status === 'loading' && (
          <div className={styles.grid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )} */}

        {status === 'error' && (
          <div className={styles.errorState}>
            <p className={styles.errorTitle}>Could not load products</p>
            <p className={styles.errorSub}>
              Check your connection and try refreshing.
            </p>
          </div>
        )}

        {status === 'success' && (
          <>
            <div className={styles.grid}>
              {filtered.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}


