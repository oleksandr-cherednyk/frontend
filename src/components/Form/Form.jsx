import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import styles from "./Form.module.css";
import api from "../../api/axios";

export default function Form({ action = "discount" }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ mode: "onBlur" });

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  // ✅ Автоматический выбор endpoint
  const endpoint = action === "order" ? "/order/send" : "/sale/send";

  // ✅ Текст кнопки и модалки
  const labels = useMemo(() => {
    if (action === "order") {
      return {
        button: "Order",
        title: "Congratulations!",
        text: "Your order has been successfully placed.  A manager will contact you shortly.",
      };
    }
    return {
      button: "Get a discount",
      title: "Thank you!",
      text: "Your discount request has been sent. We’ll contact you soon.",
    };
  }, [action]);

  const onSubmit = async (data) => {
    setError("");
    try {
      await api.post(endpoint, { ...data, action });
      reset();
      setShowModal(true);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to send, try again.");
    }
  };

  // Esc close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setShowModal(false);
    if (showModal) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showModal]);

  // Auto close
  useEffect(() => {
    if (!showModal) return;
    const t = setTimeout(() => setShowModal(false), 3000);
    return () => clearTimeout(t);
  }, [showModal]);

  return (
    <>
      <form
        className={`${styles.form} ${
          action === "order" ? styles.formOrder : styles.formDiscount
        }`}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <input
          type="text"
          placeholder="Name"
          {...register("name", {
            required: "Enter your name",
            minLength: { value: 2, message: "Too short" },
          })}
        />
        {errors.name && <span className={styles.err}>{errors.name.message}</span>}

        <input
          type="tel"
          placeholder="Phone number"
          {...register("phone", {
            required: "Enter phone number",
            pattern: { value: /^[0-9+()\-.\s]{6,}$/, message: "Invalid phone" },
          })}
        />
        {errors.phone && <span className={styles.err}>{errors.phone.message}</span>}

        <input
          type="email"
          placeholder="Email"
          {...register("email", {
            required: "Enter email",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
          })}
        />
        {errors.email && <span className={styles.err}>{errors.email.message}</span>}

        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : labels.button}
        </button>
      </form>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowModal(false)}>
              ×
            </button>

            <h3 className={styles.modalTitle}>{labels.title}</h3>
            <p className={styles.modalText}>{labels.text}</p>
          </div>
        </div>
      )}
    </>
  );
}
