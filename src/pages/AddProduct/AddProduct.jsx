import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import styles from "./AddProduct.module.css";
import Button from "../../components/Button/Button";

const API = import.meta.env.VITE_API_URL || "http://localhost:3333";

export default function AddProduct() {
  const navigate = useNavigate();

  // form state
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discontPrice, setDiscontPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); // на случай, если хочешь кидать URL вместо файла

  // data
  const [categories, setCategories] = useState([]);

  // ui
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/categories/all").then(({ data }) => {
      setCategories(Array.isArray(data) ? data : []);
    });
  }, []);

  const previewSrc = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    if (imageUrl) {
      return imageUrl.startsWith("http") ? imageUrl : `${API}${imageUrl}`;
    }
    return "";
  }, [imageFile, imageUrl]);

  // simple validation
  const validate = () => {
    if (!title.trim()) return "Title is required";
    const p = Number(price);
    if (!Number.isFinite(p) || p <= 0) return "Price should be a positive number";
    if (hasDiscount) {
      const dp = Number(discontPrice);
      if (!Number.isFinite(dp) || dp <= 0) return "Discount price should be a positive number";
      if (dp >= p) return "Discount price must be less than price";
    }
    if (!categoryId) return "Select a category";
    if (!imageFile && !imageUrl) return "Add image file or image URL";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    try {
      setSubmitting(true);

      // формируем payload
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("price", Number(price));
      if (hasDiscount) fd.append("discont_price", Number(discontPrice));
      fd.append("categoryId", categoryId);
      fd.append("description", description.trim());

      if (imageFile) {
        fd.append("image", imageFile); // поле "image" — подгони под бэкенд
      } else if (imageUrl) {
        fd.append("imageUrl", imageUrl.trim()); // если бэкенд принимает url
      }

      // POST /products — подгони путь, если у тебя другой (например, /products/new)
      const { data } = await api.post("/products", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // предполагаем, что бэкенд вернёт созданный объект с id
      const newId = data?.id ?? data?.product?.id;
      if (newId) {
        navigate(`/products/${newId}`);
      } else {
        // fallback — просто на список
        navigate(`/products?category=${categoryId}`);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl("");
    }
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl("");
    }
  };

  return (
    <section className={styles.page}>
      {/* breadcrumbs в стиле проекта */}
      <div className={styles.breadcrumbs}>
        <Button title="Main page" link="/" />
        <Button title="Categories" link="/categories" />
        <Button title="Products" link="/products" />
        <Button title="Add product" link="/products/new" />
      </div>

      <h1 className={styles.title}>Add new product</h1>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        {/* LEFT */}
        <div className={styles.left}>
          <label className={styles.label}>
            Title
            <input
              className={styles.input}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="BELCANDO Mini Dog Food"
            />
          </label>

          <div className={styles.row2}>
            <label className={styles.label}>
              Price
              <input
                className={styles.input}
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="25"
              />
            </label>

            <label className={styles.checkboxWrap}>
              <input
                type="checkbox"
                checked={hasDiscount}
                onChange={(e) => {
                  setHasDiscount(e.target.checked);
                  if (!e.target.checked) setDiscontPrice("");
                }}
              />
              <span className={styles.checkBox}></span>
              Discount
            </label>

            <label className={styles.label} style={{ opacity: hasDiscount ? 1 : 0.5 }}>
              Discount price
              <input
                className={styles.input}
                type="number"
                min="0"
                step="0.01"
                value={discontPrice}
                onChange={(e) => setDiscontPrice(e.target.value)}
                placeholder="19"
                disabled={!hasDiscount}
              />
            </label>
          </div>

          <label className={styles.label}>
            Category
            <select
              className={styles.input}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.label}>
            Description
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description…"
            />
          </label>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <div
            className={styles.drop}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
          >
            {previewSrc ? (
              <img src={previewSrc} alt="preview" className={styles.preview} />
            ) : (
              <span className={styles.dropHint}>Drag & drop image here</span>
            )}
          </div>

          <div className={styles.row2}>
            <label className={styles.fileBtn}>
              <input type="file" accept="image/*" onChange={onFile} />
              Upload file
            </label>

            <span className={styles.or}>or</span>

            <input
              className={styles.input}
              type="text"
              placeholder="Image URL (optional)"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                if (e.target.value) setImageFile(null);
              }}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <Link to="/products" className={styles.secondaryBtn}>
              Cancel
            </Link>
            <button type="submit" className={styles.primaryBtn} disabled={submitting}>
              {submitting ? "Saving…" : "Create product"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
