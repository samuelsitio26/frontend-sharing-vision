// Alamat backend Go kita
const BASE = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? "http://localhost:8080" : "");

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(BASE + path, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("Tidak bisa terhubung ke server. Pastikan backend sudah dijalankan.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Terjadi kesalahan pada server.");
  return data;
}

// status: "publish" | "draft" | "thrash" (kosong = semua)
export function listArticles({ status = "", limit = 10, offset = 0 } = {}) {
  const q = status ? `?status=${status}` : "";
  return request(`/article/${limit}/${offset}${q}`);
}

export const getArticle = (id) => request(`/article/${id}`);

export const createArticle = (body) =>
  request("/article/", { method: "POST", body: JSON.stringify(body) });

export const updateArticle = (id, body) =>
  request(`/article/${id}`, { method: "PUT", body: JSON.stringify(body) });

export const deleteArticle = (id) =>
  request(`/article/${id}`, { method: "DELETE" });
