import { Link } from 'react-router-dom';
import { useCart } from '../../stores/CartContext';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const { openCart, totalItems } = useCart();

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          <img src="/assets/logo.png" alt="logo" height={36} />
        </Link>

        <div className={styles.actions}>
          <button
            className={styles.cartBtn}
            onClick={openCart}
          >
            <img src="/assets/cart.png" alt="cart" width={22} height={22} />
            {totalItems > 0 && (
              <span className={styles.badge} >
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
