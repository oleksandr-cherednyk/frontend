import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ShowProducts from "../../components/ShowProducts/ShowProducts";
import Button from "../../components/Button/Button";
import styles from "./Products.module.css";
import api from "../../api/axios";

export default function Products() {
  const [sp, setSp] = useSearchParams();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/categories/all").then(({ data }) => setCategories(data || []));
  }, []);

  const category = sp.get("category") ?? "";
  const priceFrom = sp.get("from") ?? "";
  const priceTo = sp.get("to") ?? "";
  const discounted = sp.get("discounted") === "1";
  const sort = sp.get("sort") ?? "default";

  const currentCategory = categories.find(
    (c) => String(c.id) === String(category)
  );

  const updateParam = (key, value) => {
    const next = new URLSearchParams(sp);
    value ? next.set(key, value) : next.delete(key);
    setSp(next);
  };

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbs}>
        <Button title="Main page" link="/" />
        <Button title="Categories" link="/categories" />
        {currentCategory && (
          <Button
            title={currentCategory.title}
            link={`/products?category=${currentCategory.id}`}
          />
        )}
      </div>

      <h1 className={styles.title}>
        {currentCategory ? currentCategory.title : "All products"}
      </h1>

      <div className={styles.filters}>
        <label>Price</label>

        <input
          type="number"
          placeholder="price from"
          value={priceFrom}
          onChange={(e) => updateParam("from", e.target.value)}
        />

        <input
          type="number"
          placeholder="price to"
          value={priceTo}
          onChange={(e) => updateParam("to", e.target.value)}
        />

        <label className={styles.checkboxWrap}>
          Discount only
          <input
            type="checkbox"
            checked={discounted}
            onChange={(e) =>
              updateParam("discounted", e.target.checked ? "1" : "")
            }
          />
          <span className={styles.checkBox}></span>
        </label>

        <select
          value={sort}
          onChange={(e) => updateParam("sort", e.target.value)}
        >
          <option value="default">by default</option>
          <option value="newest">newest</option>
          <option value="price-high">price: high-low</option>
          <option value="price-low">price: low-high</option>
        </select>
      </div>

      <ShowProducts
        category={category}
        priceFrom={priceFrom}
        priceTo={priceTo}
        discounted={discounted}
        sort={sort}
      />
    </div>
  );
}
