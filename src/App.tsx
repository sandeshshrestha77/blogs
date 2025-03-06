
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { supabase } from "./integrations/supabase/client"; 
import Index from "./pages/Index";
import Blogs from "./pages/Blogs";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/Admin";
import AdminPostForm from "./pages/AdminPostForm";
import AdminSettings from "./pages/AdminSettings";
import Login from "./pages/Login";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const [posts, setPosts] = useState<any[]>([]);
  
  useEffect(() => {
    const getPosts = async () => {
      try {
        const { data, error } = await supabase.from("posts").select();
        if (error) {
          console.error("Error fetching posts:", error);
        } else if (data.length > 0) {
          setPosts(data);
        }
      } catch (error) {
        console.error("Unexpected error fetching posts:", error);
      }
    };
    getPosts();
  }, []);
  
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/admin/create" element={
            <ProtectedRoute>
              <AdminPostForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/edit/:id" element={
            <ProtectedRoute>
              <AdminPostForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
