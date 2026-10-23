import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createArticle, getArticle, updateArticle } from "../api.js";

// Aturan yang sama dengan validasi di backend
const MIN = { title: 20, content: 200, category: 3 };
const TAB_FOR = { publish: "published", draft: "drafts", thrash: "trashed" };

function validate(f) {
  const errors = {};
  if (f.title.trim().length < MIN.title) errors.title = `Title minimal ${MIN.title} karakter.`;
  if (f.content.trim().length < MIN.content) errors.content = `Content minimal ${MIN.content} karakter.`;
  if (f.category.trim().length < MIN.category) errors.category = `Category minimal ${MIN.category} karakter.`;
  return errors;
}

export default function PostForm() {
  // Kalau alamatnya /posts/5/edit maka id = 5 (mode edit). Kalau /posts/new maka id kosong (mode tambah).
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", content: "", category: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  // Mode edit: isi form dengan data artikel yang lama
  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    getArticle(id)
      .then((a) => setForm({ title: a.title, content: a.content, category: a.category }))
      .catch((e) => setServerError(e.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  }

  // Dipanggil oleh tombol Publish ("publish") dan Draft ("draft")
  async function save(status) {
    setServerError("");
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    const body = {
      title: form.title.trim(),
      content: form.content.trim(),
      category: form.category.trim(),
      status,
    };
    setSaving(true);
    try {
      if (isEdit) await updateArticle(id, body);
      else await createArticle(body);
      navigate(`/posts?tab=${TAB_FOR[status]}`);
    } catch (e) {
      setServerError(e.message);
      setSaving(false);
    }
  }

  if (loading) return <p className="muted">Memuat artikel...</p>;

  return (
    <section>
      <header className="page-head">
        <h1>{isEdit ? "Edit Article" : "Add New"}</h1>
      </header>

      {serverError && <p className="alert err">{serverError}</p>}

      <div className="form">
        <div className="field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="Judul artikel (minimal 20 karakter)"
            aria-invalid={Boolean(errors.title)}
          />
          <div className="hint">
            <span className="err-text">{errors.title}</span>
            <span>{form.title.trim().length} / {MIN.title}+</span>
          </div>
        </div>

        <div className="field">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            rows="12"
            value={form.content}
            onChange={onChange}
            placeholder="Isi artikel (minimal 200 karakter)"
            aria-invalid={Boolean(errors.content)}
          />
          <div className="hint">
            <span className="err-text">{errors.content}</span>
            <span>{form.content.trim().length} / {MIN.content}+</span>
          </div>
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            name="category"
            value={form.category}
            onChange={onChange}
            placeholder="Contoh: Teknologi"
            aria-invalid={Boolean(errors.category)}
          />
          <div className="hint">
            <span className="err-text">{errors.category}</span>
            <span>{form.category.trim().length} / {MIN.category}+</span>
          </div>
        </div>

        <div className="actions">
          <button className="btn btn-primary" disabled={saving} onClick={() => save("publish")}>
            Publish
          </button>
          <button className="btn btn-outline" disabled={saving} onClick={() => save("draft")}>
            Draft
          </button>
          <button className="btn btn-ghost" disabled={saving} onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
}
