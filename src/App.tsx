
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/Admin";
import AdminPostForm from "./pages/AdminPostForm";
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/create" element={<AdminPostForm />} />
        <Route path="/admin/edit/:id" element={<AdminPostForm />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
