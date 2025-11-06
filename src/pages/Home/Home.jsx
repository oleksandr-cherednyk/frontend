import ShowCategories from "../../components/ShowCategories/ShowCategories";
import ShowSales from "../../components/ShowProducts/ShowProducts";
import Button from "../../components/Button/Button";
import Form from "../../components/Form/Form";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            Amazing Discounts <br /> on Pets Products!
          </h1>
          <Link to="/sales" className={styles.checkOutBtn}>
            Check out
          </Link>
        </div>
      </section>

      <section className={styles.sectionCategory}>
        <div className={styles.top}>
          <h2>Categories</h2>
          <div className={styles.line}></div>
          <Button title="All category" link="/categories" />
        </div>

        <ShowCategories limit={4} />
      </section>

      <section className={styles.discountBanner}>
        <h2 className={styles.title}>5% off on the first order</h2>
        <div className={styles.inner}>
          <div className={styles.formSide}>
            <Form action="discount" />
          </div>
        </div>
      </section>

      <section className={styles.sectionSale}>
        <div className={styles.top}>
          <h2>Sale</h2>
          <div className={styles.line}></div>
          <Button title="All sales" link="/sales" />
        </div>

        <ShowSales limit={4} />
      </section>
    </div>
  );
}
