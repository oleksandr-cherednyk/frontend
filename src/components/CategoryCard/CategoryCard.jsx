import { Link } from "react-router-dom";
import styles from "./CategoryCard.module.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:3333";

export default function CategoryCard({ id, title, image }) {
  return (
    <Link to={`/products?category=${id}`} className={styles.card}>
      <img src={`${API}${image}`} alt={title} className={styles.image} />
      <h3 className={styles.title}>{title}</h3>
    </Link>
  );
}

