import styles from "./Button.module.css";
import { Link } from "react-router-dom";

export default function Button({title, link}) {
  return (
    <Link to={link} className={styles.btn}>
      {title}
    </Link>
  );
}
