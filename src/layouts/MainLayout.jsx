import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import styles from './MainLayout.module.css';

export default function MainLayout({ children }) {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
