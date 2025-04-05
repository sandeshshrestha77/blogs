
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./integrations/supabase/client"; 
import Index from "./pages/Index";
import Blogs from "./pages/Blogs";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/Admin";
import AdminPostForm from "./pages/AdminPostForm";
import AdminSettings from "./pages/AdminSettings";
import AdminAnalytics from "./pages/AdminAnalytics";
import Login from "./pages/Login";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1
    },
  },
});

function App() {
  interface Post {
    id: string;
    title: string;
    content: string;
    slug: string;
  }

  const [posts, setPosts] = useState<Post[]>([]);
  
  useEffect(() => {
    const getPosts = async () => {
      try {
        const { data, error } = await supabase.from("posts").select("*");
        if (error) {
          console.error("Error fetching posts:", error);
        } else if (data && data.length > 0) {
          setPosts(data);
        } else {
          console.log("No posts found or empty data array");
        }
      } catch (error) {
        console.error("Unexpected error fetching posts:", error);
      }
    };
    getPosts();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
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
            <Route path="/admin/analytics" element={
              <ProtectedRoute>
                <AdminAnalytics />
              </ProtectedRoute>
            } />
            {/* Add a fallback route for any admin paths */}
            <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
          </Routes>
          <Toaster position="top-right" />
          <ShadcnToaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
