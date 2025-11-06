import styles from "./Footer.module.css";
import whatsappIcon from "../../assets/whatsapp.svg";
import instagramIcon from "../../assets/instagram.svg";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <h2 className={styles.title}>Contact</h2>

      <div className={styles.contacts}>
        {/* Phone (левая широкая колонка) */}
        <div className={styles.card}>
          <h4>Phone</h4>
          <p>
            <a href="tel:+493091588492">+49 30 915-88492</a>
          </p>
        </div>

        {/* Socials (правая узкая колонка) */}
        <div className={styles.card}>
          <h4>Socials</h4>
          <div className={styles.socials}>
            <a
              href="https://wa.me/493091588492"
              target="_blank"
              rel="noreferrer"
            >
              <img src={whatsappIcon} alt="WhatsApp" />
            </a>
            <a href="https://instagram.com/" target="_blank" rel="noreferrer">
              <img src={instagramIcon} alt="Instagram" />
            </a>
          </div>
        </div>

        {/* Address (левая широкая) */}
        <div className={styles.card}>
          <h4>Address</h4>
          <p>
            Wallstraße 9-13, 10179 Berlin,
            <br />
            Deutschland
          </p>
        </div>

        {/* Working hours (правая узкая) */}
        <div className={styles.card}>
          <h4>Working Hours</h4>
          <p>24 hours a day</p>
        </div>
      </div>
      <div className={styles.mapWrap}>
        <iframe
          title="map"
          src="https://www.google.com/maps?q=Wallstraße+9-13,+10179+Berlin,+Deutschland&output=embed"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </footer>
  );
}
