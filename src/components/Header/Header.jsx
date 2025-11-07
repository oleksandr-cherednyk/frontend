import { Link, NavLink } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "../../assets/logo.svg";
import basketIcon from "../../assets/basket.svg";

import { useSelector } from 'react-redux';
import { selectCount } from '../../store/cartSlice';

export default function Header() {
  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Categories", path: "/categories" },
    { title: "Products", path: "/products" },
    { title: "Sales", path: "/sales" },
    // { title: "Add product", path: "/addproduct" },
  ];
    const basketCount = useSelector(selectCount);


  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="PetShop logo" className={styles.logoImage} />
        </Link>

        <nav className={styles.nav}>
          {navLinks.map(({ title, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              {title}
            </NavLink>
          ))}
        </nav>

        <Link to="/basket" className={styles.basket}>
          <div className={styles.basketWrapper}>
            <img src={basketIcon} alt="Basket" className={styles.basketImage} />
            {basketCount > 0 && (
              <span className={styles.basketBadge}>{basketCount}</span>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}
