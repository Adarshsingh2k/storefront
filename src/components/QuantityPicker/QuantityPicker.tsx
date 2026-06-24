import { MAX_QTY } from '../../stores/CartContext';
import styles from './QuantityPicker.module.scss';

interface Props {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export default function QuantityPicker({
  value,
  onChange,
  min = 1,
  max = MAX_QTY,
  disabled = false,
}: Props) {
  return (
    <div className={styles.picker}>
      <button
        className={styles.btn}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
       
      >
        −
      </button>
      <output className={styles.value}>{value}</output>
      <button
        className={styles.btn}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
       
      >
        +
      </button>
    </div>
  );
}
