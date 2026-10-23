import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listArticles } from "../api.js";

const PAGE_SIZE = 4; // jumlah artikel per halaman
const EXCERPT = 260; // panjang cuplikan sebelum "Baca selengkapnya"

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function Preview() {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, parseInt(params.get("page"), 10) || 1);

  const [posts, setPosts] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState({});

  useEffect(() => {
    setLoading(true);
    setError("");
    // Minta 1 artikel lebih banyak untuk mengetahui apakah masih ada halaman berikutnya
    listArticles({ status: "publish", limit: PAGE_SIZE + 1, offset: (page - 1) * PAGE_SIZE })
      .then((rows) => {
        setHasNext(rows.length > PAGE_SIZE);
        setPosts(rows.slice(0, PAGE_SIZE));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [page]);

  function goTo(n) {
    setParams({ page: String(n) });
    window.scrollTo({ top: 0 });
  }

  return (
    <section>
      <header className="page-head">
        <h1>Preview</h1>
      </header>

      {error && <p className="alert err">{error}</p>}
      {loading && <p className="muted">Memuat artikel...</p>}
      {!loading && !error && posts.length === 0 && (
        <p className="muted">
          {page > 1 ? "Tidak ada artikel di halaman ini." : "Belum ada artikel berstatus Publish."}
        </p>
      )}

      <div className="blog">
        {posts.map((p) => {
          const long = p.content.length > EXCERPT;
          const expanded = open[p.id];
          return (
            <article key={p.id} className="post">
              <div className="post-meta">
                <span className="chip">{p.category}</span>
                <time dateTime={p.created_date}>{formatDate(p.created_date)}</time>
              </div>
              <h2>{p.title}</h2>
              <p className="post-body">
                {expanded || !long ? p.content : p.content.slice(0, EXCERPT).trimEnd() + "..."}
              </p>
              {long && (
                <button
                  className="link-btn"
                  onClick={() => setOpen((o) => ({ ...o, [p.id]: !expanded }))}
                >
                  {expanded ? "Tampilkan lebih sedikit" : "Baca selengkapnya"}
                </button>
              )}
            </article>
          );
        })}
      </div>

      {(page > 1 || hasNext) && (
        <nav className="pager" aria-label="Pagination">
          <button className="btn btn-outline" disabled={page <= 1} onClick={() => goTo(page - 1)}>
            Previous
          </button>
          <span className="pager-info">Halaman {page}</span>
          <button className="btn btn-outline" disabled={!hasNext} onClick={() => goTo(page + 1)}>
            Next
          </button>
        </nav>
      )}
    </section>
  );
}
