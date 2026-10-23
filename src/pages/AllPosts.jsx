import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { deleteArticle, listArticles, updateArticle } from "../api.js";
import { EditIcon, TrashIcon } from "../components/Icons.jsx";

// Tiga tab, masing-masing terhubung ke satu status di backend
const TABS = [
  { key: "published", label: "Published", status: "publish" },
  { key: "drafts", label: "Drafts", status: "draft" },
  { key: "trashed", label: "Trashed", status: "thrash" },
];

export default function AllPosts() {
  const [params, setParams] = useSearchParams();
  const tab = TABS.find((t) => t.key === params.get("tab")) || TABS[0];

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Ambil artikel dari backend sesuai status tab yang aktif
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setPosts(await listArticles({ status: tab.status, limit: 1000, offset: 0 }));
    } catch (e) {
      setError(e.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [tab.status]);

  useEffect(() => {
    load();
  }, [load]);

  function changeTab(key) {
    setNotice("");
    setParams({ tab: key });
  }

  async function handleTrash(post) {
    setNotice("");
    setError("");
    try {
      if (tab.status === "thrash") {
        // Di tab Trashed, ikon sampah menghapus artikel secara permanen
        if (!window.confirm(`Hapus permanen "${post.title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
        await deleteArticle(post.id);
        setNotice("Artikel dihapus permanen.");
      } else {
        // Di tab lain, ikon sampah hanya mengubah status menjadi thrash
        await updateArticle(post.id, {
          title: post.title,
          content: post.content,
          category: post.category,
          status: "thrash",
        });
        setNotice("Artikel dipindahkan ke Trashed.");
      }
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <section>
      <header className="page-head">
        <h1>All Posts</h1>
        <Link to="/posts/new" className="btn btn-primary">Add New</Link>
      </header>

      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={t.key === tab.key}
            className={t.key === tab.key ? "tab active" : "tab"}
            onClick={() => changeTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {notice && <p className="alert ok">{notice}</p>}
      {error && <p className="alert err">{error}</p>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th className="col-action">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan="3" className="muted">Memuat artikel...</td></tr>
            )}
            {!loading && posts.length === 0 && !error && (
              <tr>
                <td colSpan="3" className="muted">
                  Belum ada artikel di tab {tab.label}.
                </td>
              </tr>
            )}
            {!loading &&
              posts.map((p) => (
                <tr key={p.id}>
                  <td className="cell-title">{p.title}</td>
                  <td><span className="chip">{p.category}</span></td>
                  <td className="col-action">
                    <div className="action-group">
                      <Link
                        to={`/posts/${p.id}/edit`}
                        className="icon-btn"
                        title="Edit"
                        aria-label={`Edit ${p.title}`}
                      >
                        <EditIcon />
                      </Link>
                      <button
                        className="icon-btn danger"
                        title={tab.status === "thrash" ? "Hapus permanen" : "Pindahkan ke Trashed"}
                        aria-label={`Trash ${p.title}`}
                        onClick={() => handleTrash(p)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
