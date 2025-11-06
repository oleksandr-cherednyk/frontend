import { useEffect, useState, useMemo } from "react";
import Card from "../Card/Card.jsx";
import styles from "./ShowProducts.module.css";
import api from "../../api/axios.js";

export default function ShowProducts({
  category,
  priceFrom,
  priceTo,
  discounted,
  sort
}) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products/all").then(({ data }) => {
      if (!Array.isArray(data)) return;
      setProducts(data);
    });
  }, []);

  const filtered = useMemo(() => {
    let arr = [...products];

    if (category) {
      arr = arr.filter((p) => String(p.categoryId) === String(category));
    }

    if (discounted) {
      arr = arr.filter((p) => p.discont_price != null && Number(p.discont_price) > 0);
    }

    if (priceFrom) arr = arr.filter((p) => Number(p.price) >= Number(priceFrom));
    if (priceTo) arr = arr.filter((p) => Number(p.price) <= Number(priceTo));

    switch (sort) {
      case "price-low":
        arr.sort((a, b) => Number(a.price) - Number(b.price));
        break;

      case "price-high":
        arr.sort((a, b) => Number(b.price) - Number(a.price));
        break;

      case "newest":
        arr.sort((a, b) => {
          const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          if (db !== da) return db - da;
          return Number(b.id) - Number(a.id);
        });
        break;

      case "default":
      default:
        break;
    }

    return arr;
  }, [products, category, priceFrom, priceTo, discounted, sort]);

  return (
    <div className={styles.grid}>
      {filtered.map((p) => (
        <Card key={p.id} {...p} />
      ))}
    </div>
  );
}
