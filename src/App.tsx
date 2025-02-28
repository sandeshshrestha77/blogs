import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { supabase } from "./utils/supabase"; // Ensure correct path
import Index from "./pages/Index";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/Admin";
import AdminPostForm from "./pages/AdminPostForm";
import Login from "./pages/Login";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  const [todos, setTodos] = useState<any[]>([]);

  useEffect(() => {
    const getTodos = async () => {
      try {
        const { data, error } = await supabase.from("todos").select();

        if (error) {
          console.error("Error fetching todos:", error);
        } else if (data.length > 0) {
          setTodos(data);
        }
      } catch (error) {
        console.error("Unexpected error fetching todos:", error);
      }
    };

    getTodos();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create"
            element={
              <ProtectedRoute>
                <AdminPostForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              <ProtectedRoute>
                <AdminPostForm />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />

        {/* Display fetched todos for debugging */}
        <div>
          <h3>Fetched Todos:</h3>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>{todo.name}</li> // Adjust key and property as per your DB schema
            ))}
          </ul>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
