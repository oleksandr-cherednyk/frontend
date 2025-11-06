import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../../store/cartSlice";
import Button from "../../components/Button/Button";
import styles from "./Product.module.css";
import api from "../../api/axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3333";

// Минимальная валидация товара (подгони под свой API при желании)
function isValidProduct(p) {
  if (!p || typeof p !== "object") return false;
  // требуем как минимум id и title; можно добавить image/price
  if (p.id == null) return false;
  if (!p.title || String(p.title).trim() === "") return false;
  return true;
}

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const imagePositions = [styles.top, styles.center, styles.bottom];

  // грузим товар
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(`${API}/products/${id}`);

        // Если сервер честно вернул 404/500 — показываем notFound
        if (!res.ok) {
          if (!ignore) setNotFound(true);
          return;
        }

        const data = await res.json();
        // Поддержка разных форматов
        const prod = Array.isArray(data)
          ? data[0] ?? null
          : data?.product ?? data ?? null;

        // Пустой массив / пустой объект / null → notFound
        if (!isValidProduct(prod)) {
          if (!ignore) setNotFound(true);
          return;
        }

        if (!ignore) setProduct(prod);
      } catch {
        if (!ignore) setNotFound(true);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [id]);

  // грузим категории (не критично для notFound)
  useEffect(() => {
    let ignore = false;
    api
      .get("/categories/all")
      .then((res) => {
        if (!ignore) setCategories(res.data || []);
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  // --- РЕНДЕР УСЛОВИЯ ---

  // Если товара нет — показываем только надпись
  if (notFound) {
    return <div className={styles.empty}>Product not found</div>;
  }

  // Если ещё не получили продукт — ничего не рендерим (без Loading)
  if (!product) {
    return null;
  }

  // --- ДАЛЬШЕ — ТОЛЬКО ЕСЛИ ТОВАР ЕСТЬ ---

  const category =
    categories.find((c) => String(c.id) === String(product.categoryId)) || null;

  const hasDiscount =
    product.discont_price != null &&
    Number(product.discont_price) > 0 &&
    Number(product.discont_price) < Number(product.price);

  const finalPrice = hasDiscount
    ? Number(product.discont_price)
    : Number(product.price);
  const percent = hasDiscount
    ? Math.round(
        ((Number(product.price) - Number(product.discont_price)) /
          Number(product.price)) *
          100
      )
    : 0;

  const imageSrc = String(product.image || "").startsWith("http")
    ? product.image
    : `${API}${product.image || ""}`;

  return (
    <section className={styles.wrap}>
      {/* хлебные крошки */}
      <div className={styles.breadcrumbs}>
        <Button title="Main page" link="/" />
        <Button title="Categories" link="/categories" />
        {category && (
          <Button title={category.title} link={`/products?category=${product.categoryId}`} />
        )}
        <Button title={product.title} link={`/products/${product.id ?? id}`} />
      </div>

      <div className={styles.layout}>
        {/* галерея */}
        <div className={styles.gallery}>
          
          <div className={styles.groupImages}>
            {imagePositions.map((cls) => (
              <div key={cls} className={styles.thumb}>
                <img src={imageSrc} alt={product.title} className={cls} />
              </div>
            ))}
          </div>
          <img src={imageSrc} alt={product.title} />
        </div>

        {/* контент */}
        <div className={styles.info}>
          <h1 className={styles.title}>{product.title}</h1>

          <div className={styles.priceRow}>
            <span className={styles.price}>${finalPrice}</span>
            {hasDiscount && (
              <>
                <span className={styles.oldPrice}>
                  ${Number(product.price)}
                </span>
                <span className={styles.discount}>-{percent}%</span>
              </>
            )}
          </div>
          <div className={styles.buttonGroup}>
            <div className={styles.qtyBox}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>

            <button
              className={styles.addBtn}
              onClick={() => dispatch(addItem({ ...product, qty }))}
            >
              Add to cart
            </button>
          </div>

          <h3 className={styles.descTitle}>Description</h3>
          <p
            className={`${styles.descText} ${expanded ? styles.expanded : ""}`}
          >
            {product.description || "No description provided."}
          </p>

          <button
            className={styles.readMore}
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        </div>
      </div>
    </section>
  );
}
