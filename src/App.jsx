import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import AllPosts from "./pages/AllPosts.jsx";
import PostForm from "./pages/PostForm.jsx";
import Preview from "./pages/Preview.jsx";

export default function App() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">Article Dashboard</div>
        <nav>
          <NavLink to="/posts" end>All Posts</NavLink>
          <NavLink to="/posts/new">Add New</NavLink>
          <NavLink to="/preview">Preview</NavLink>
        </nav>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/posts" replace />} />
          <Route path="/posts" element={<AllPosts />} />
          <Route path="/posts/new" element={<PostForm />} />
          <Route path="/posts/:id/edit" element={<PostForm />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="*" element={<Navigate to="/posts" replace />} />
        </Routes>
      </main>
    </div>
  );
}
