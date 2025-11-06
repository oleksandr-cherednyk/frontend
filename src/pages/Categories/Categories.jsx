import ShowCategories from "../../components/ShowCategories/ShowCategories";
import Button from "../../components/Button/Button";

import styles from "./Categories.module.css";

export default function CategoriesSection() {
  return (
    <section className={styles.categories}>
      <div className={styles.breadcrumbs}>
        <Button title="Main page" link="/" />
        <Button title="Categories" link="/categories" />
      </div>
      <div className={styles.sectionHead}>
        <h2>Categories</h2>
      </div>

      <ShowCategories />
    </section>
  );
}
