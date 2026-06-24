import type { CartItem as CartItemType } from '../../types';
import { useCart, MAX_QTY } from '../../stores/CartContext';
import QuantityPicker from '../QuantityPicker/QuantityPicker';
import { toINR } from '../../utils';
import styles from './CartItem.module.scss';

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeItem } = useCart();

  function handleQtyChange(qty: number) {
    updateQuantity(item.id, qty);
  }

  function handleRemove() {
    removeItem(item.id);
  }

  return (
    <li className={styles.item}>
      <div className={styles.imageWrap}>
        <img src={item.image} alt={item.title} className={styles.image} />
      </div>

      <div className={styles.info}>
        <p className={styles.title}>{item.title}</p>
        <p className={styles.variant}>
          <span
            className={styles.colorDot}
            style={{ background: item.color.hex }}
            title={item.color.name}
          />
          {item.color.name} · {item.size}
        </p>

        <div className={styles.controls}>
          <QuantityPicker
            value={item.quantity}
            onChange={handleQtyChange}
            max={MAX_QTY}
          />
          <button
            className={styles.remove}
            onClick={handleRemove}
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <p className={styles.lineTotal}>
        {toINR(item.price * item.quantity)}
      </p>
    </li>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}
