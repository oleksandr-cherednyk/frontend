import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button/Button";
import {
  selectItems,
  selectSubtotal,
  addItem,
  decreaseQty,
  removeItem,
  priceToUse,
} from "../../store/cartSlice";
import styles from "./Basket.module.css";
import Form from "../../components/Form/Form";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const API = import.meta.env.VITE_API_URL || "http://localhost:3333";

export default function Basket() {
  const items = useSelector(selectItems);
  const subtotal = useSelector(selectSubtotal);
  const dispatch = useDispatch();

  const itemsCount = items.reduce((s, p) => s + p.qty, 0);

  return (
    <section className={styles.wrap}>
      <div className={styles.top}>
        <h1 className={styles.pageTitle}>Shopping cart</h1>
        <div className={styles.line}></div>
        <Button title="All category" link="/categories" />
      </div>

      {items.length === 0 ? (
        <div className={styles.empty}>Your basket is empty</div>
      ) : (
        <div className={styles.grid}>
          <ul className={styles.list}>
            {items.map((p) => {
              const hasDiscount =
                p.discont_price != null &&
                Number(p.discont_price) > 0 &&
                Number(p.discont_price) < Number(p.price);

              const unitNew = priceToUse(p);
              const unitOld = hasDiscount ? Number(p.price) : null;

              return (
                <li key={p.id} className={styles.item}>
                  <img
                    src={`${API}${p.image}`}
                    alt={p.title}
                    className={styles.image}
                  />

                  <div className={styles.bodyItem}>
                    <div className={styles.rowTop}>
                      <h4 className={styles.title}>{p.title}</h4>

                      <button
                        className={styles.close}
                        onClick={() => dispatch(removeItem(p.id))}
                      >
                        <CloseRoundedIcon fontSize="small" />
                      </button>
                    </div>

                    <div className={styles.controlsPrice}>
                      <div className={styles.qtyBox}>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => dispatch(decreaseQty(p.id))}
                        >
                          −
                        </button>
                        <span className={styles.qty}>{p.qty}</span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => dispatch(addItem({ ...p, qty: 1 }))}
                        >
                          +
                        </button>
                      </div>

                      <div className={styles.priceBox}>
                        <span className={styles.newPrice}>
                          ${unitNew * p.qty}
                        </span>
                        {hasDiscount && (
                          <span className={styles.oldPrice}>
                            ${unitOld * p.qty}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className={styles.summaryCard}>
            <h3 className={styles.sumTitle}>Order details</h3>

            <div className={styles.sumRow}>
              <span>{itemsCount} items</span>
            </div>

            <div className={styles.sumRowBig}>
              <span>Total</span>
              <strong className={styles.sumTotal}>
                ${subtotal.toFixed(2).replace(".", ",")}
              </strong>
            </div>

            <Form action="order" />
          </aside>
        </div>
      )}
    </section>
  );
}
