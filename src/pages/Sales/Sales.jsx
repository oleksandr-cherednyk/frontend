import ShowProducts from "../../components/ShowProducts/ShowProducts";
import styles from "./Sales.module.css";

export default function Sales() {
  return (
    <div className={styles.page}>
      <h1>Sales</h1>
      <ShowProducts sales={true} />
    </div>
  );
}
