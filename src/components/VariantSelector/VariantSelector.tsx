import type { Color, SizeVariant } from '../../types';
import styles from './VariantSelector.module.scss';

interface Props {
  colors: Color[];
  sizes: SizeVariant[];
  selectedColor: Color | null;
  selectedSize: string | null;
  onColorChange: (color: Color) => void;
  onSizeChange: (size: string) => void;
}

export default function VariantSelector({
  colors,
  sizes,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
}: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.group}>
        <p className={styles.label}>
          Colour
          {selectedColor && (
            <span className={styles.selected}> — {selectedColor.name}</span>
          )}
        </p>
        <div className={styles.colors}>
          {colors.map((c) => (
            <button
              key={c.name}
              className={styles.colorBtn}
              data-active={selectedColor?.name === c.name}
              onClick={() => onColorChange(c)}
              style={{ background: c.hex }}
            />
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <p className={styles.label}>Size</p>
        <div className={styles.sizes}>
          {sizes.map((s) => (
            <button
              key={s.size}
              className={styles.sizeBtn}
              data-status={s.status}
              data-active={selectedSize === s.size}
              onClick={() => s.status !== 'sold_out' && onSizeChange(s.size)}
              disabled={s.status === 'sold_out'}
            >
              {s.size}
              {s.status === 'low_stock' && (
                <span className={styles.lowBadge} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
