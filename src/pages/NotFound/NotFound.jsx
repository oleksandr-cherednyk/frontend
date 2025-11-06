import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

import Four from "../../assets/4.svg";
import Puppy from "../../assets/notFoundImage.png"; // или .svg если у тебя svg

export default function NotFound() {
  return (
    <section className={styles.wrap}>
      <div className={styles.codes}>
        <img src={Four} alt="4" className={styles.four} />
        <img src={Puppy} alt="Puppy" className={styles.img} />
        <img src={Four} alt="4" className={styles.four} />
      </div>

      <h1 className={styles.title}>Page Not Found</h1>
      <p className={styles.subtitle}>
        We’re sorry, the page you requested could not be found.
        <br />
        Please go back to the homepage.
      </p>

      <Link to="/" className={styles.btn}>Go Home</Link>
    </section>
  );
}
