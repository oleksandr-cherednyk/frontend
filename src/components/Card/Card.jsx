import { useDispatch } from "react-redux";
import { addItem } from "../../store/cartSlice";
import { Link } from "react-router-dom";
import styles from "./Card.module.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:3333";

export default function SalesCard({ id, title, image, price, discont_price }) {
  const hasDiscount =
    discont_price != null &&
    discont_price !== 0 &&
    Number(discont_price) < Number(price);

  const discountPercent = hasDiscount
    ? Math.round(((price - discont_price) / price) * 100)
    : 0;

  const dispatch = useDispatch();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addItem({ id, title, image, price, discont_price, qty: 1 }));
  };

  return (
    <Link to={`/products/${id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={`${API}${image}`} alt={title} className={styles.image} />

        {hasDiscount && discountPercent > 0 && (
          <span className={styles.badge}>-{discountPercent}%</span>
        )}
      </div>

      <h4 className={styles.title}>{title}</h4>

      <div className={styles.priceBox}>
        {hasDiscount ? (
          <>
            <span className={styles.newPrice}>${discont_price}</span>
            <span className={styles.oldPrice}>${price}</span>
          </>
        ) : (
          <span className={styles.newPrice}>${price}</span>
        )}

        <button type="button" className={styles.addBtn} onClick={handleAdd}>
          Add to cart
        </button>
      </div>
    </Link>
  );
}
