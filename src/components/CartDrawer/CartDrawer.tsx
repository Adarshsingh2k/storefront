import { useEffect, useRef } from 'react';
import { toINR } from '../../utils';
import { useCart } from '../../stores/CartContext';
import CartItem from '../CartItem/CartItem';
import styles from './CartDrawer.module.scss';

const SHIPPING_THRESHOLD = 75;

export default function CartDrawer() {
  const { items, isOpen, subtotal, totalItems, closeCart, clearCart } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('drawer-open');
    } else {
      document.body.classList.remove('drawer-open');
    }
    return () => document.body.classList.remove('drawer-open');
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) drawerRef.current?.focus();
  }, [isOpen]);

 
  const grandTotal = subtotal; 
  const shippingLeft = Math.max(0, SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100);

  return (
    <>
      <div
        className={styles.backdrop}
        data-open={isOpen}
        onClick={closeCart}
       
      />

      <div
        className={styles.drawer}
        data-open={isOpen}
       
       
       
        ref={drawerRef}
        tabIndex={-1}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>
            Your cart
            {totalItems > 0 && (
              <span className={styles.count}>{totalItems}</span>
            )}
          </h2>
          <button className={styles.closeBtn} onClick={closeCart}>
            <img src="/assets/close.png" alt="close" width={20} height={20} />
          </button>
        </div>

        {subtotal > 0 && (
          <div className={styles.shipping}>
            {shippingLeft > 0 ? (
              <p className={styles.shippingMsg}>
                Add <strong>{toINR(shippingLeft)}</strong> more for free shipping
              </p>
            ) : (
              <p className={styles.shippingMsg + ' ' + styles.shippingDone}>
                🎉 You qualify for free shipping!
              </p>
            )}
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <img src="/assets/cart.png" alt="empty cart" width={40} height={40} />
              <p className={styles.emptyTitle}>Your cart is empty</p>
              <p className={styles.emptySub}>Browse products and add them to your cart.</p>
              <button className={styles.continueShopping} onClick={closeCart}>
                Continue shopping
              </button>
            </div>
          ) : (
            <ul>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{toINR(subtotal)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span className={shippingLeft === 0 ? styles.free : ''}>
                {shippingLeft === 0 ? 'Free' : 'Calculated at checkout'}
              </span>
            </div>
            <div className={styles.divider} />
            <div className={styles.summaryRow + ' ' + styles.total}>
              <span>Total</span>
              <span>{toINR(grandTotal)}</span>
            </div>
            <button className={styles.checkoutBtn}>
              Proceed to Checkout
            </button>
            <button className={styles.clearBtn} onClick={clearCart}>
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}


