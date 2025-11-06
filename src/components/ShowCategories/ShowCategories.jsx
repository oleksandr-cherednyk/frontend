import { useEffect, useState, useMemo } from "react";
import CategoryCard from "../../components/CategoryCard/CategoryCard.jsx";
import styles from "./ShowCategories.module.css";
import api from "../../api/axios.js";

export default function CategoriesSection({
  limit = null,

}) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api
      .get("/categories/all")
      .then((res) => {
        setCategories(res.data || []);
      })
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  const visible = useMemo(
    () => (limit ? categories.slice(0, limit) : categories),
    [categories, limit]
  );

  return (
      <div className={styles.grid}>
        {visible.map((c) => (
          <CategoryCard key={c.id} {...c} />
        ))}
      </div>

  );
}
