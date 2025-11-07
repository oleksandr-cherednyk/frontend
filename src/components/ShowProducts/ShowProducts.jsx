import { useEffect, useState, useMemo } from "react";
import Card from "../Card/Card.jsx";
import styles from "./ShowProducts.module.css";
import api from "../../api/axios.js";

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const priceToUse = (p) => toNum(p?.discont_price ?? p?.price);
const toTime = (p) => (p?.createdAt ? Date.parse(p.createdAt) || 0 : 0);

export default function ShowProducts({
  limit = null,
  sales = false,
  category = "",
  priceFrom = "",
  priceTo = "",
  discounted = false,
  sort = "default", 
}) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api
      .get("/products/all")
      .then(({ data }) => {
        if (!Array.isArray(data)) return;
        const filtered = sales
          ? data.filter((p) => p.discont_price != null && toNum(p.discont_price) > 0)
          : data;
        setProducts(filtered);
      })
      .catch(console.error);
  }, [sales]);

  const filtered = useMemo(() => {
    let arr = [...products];

    // фильтр по категории 
    if (category) {
      arr = arr.filter((p) => String(p.categoryId) === String(category));
    }

    // фильтры по цене
    const pf = toNum(priceFrom);
    const pt = toNum(priceTo);

    if (priceFrom !== "" && Number.isFinite(pf)) {
      arr = arr.filter((p) => priceToUse(p) >= pf);
    }
    if (priceTo !== "" && Number.isFinite(pt)) {
      arr = arr.filter((p) => priceToUse(p) <= pt);
    }

    if (discounted) {
      arr = arr.filter((p) => p.discont_price != null && toNum(p.discont_price) > 0);
    }

    // СОРТИРОВКА
    switch (sort) {
      case "price-low": // low → high
        arr.sort((a, b) => priceToUse(a) - priceToUse(b));
        break;
      case "price-high": // high → low
        arr.sort((a, b) => priceToUse(b) - priceToUse(a));
        break;
      case "newest": // по дате (новые выше)
        arr.sort((a, b) => toTime(b) - toTime(a));
        break;

      default:
        break;
    }

    return limit ? arr.slice(0, limit) : arr;
  }, [products, limit, category, priceFrom, priceTo, discounted, sort]);

  return (
    <div className={styles.grid}>
      {filtered.map((p) => (
        <Card key={p.id} {...p} />
      ))}
    </div>
  );
}
