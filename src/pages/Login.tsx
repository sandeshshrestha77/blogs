
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  const { signIn, session } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signIn(email, password);
    } catch (error: any) {
      setError(error.message || "Invalid credentials");
      toast.error(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  if (session) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen flex bg-zinc-950">
      {/* Left Side - Image (60%) */}
      <div className="hidden lg:block w-[60%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1617802690992-15d93263d3a9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Login Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-md p-8">
            <div className="mb-6">
              <img src="/logo.png" alt="Logo" className="h-14 w-auto mb-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Welcome to the Admin Dashboard
            </h1>
            <p className="text-zinc-300 text-lg">
              Manage your content, create new blog posts, and monitor your site's analytics from one central location.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form (40%) */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="lg:hidden flex items-center mb-6">
              <img src="/logo.png" alt="Logo" className="h-12 w-auto mr-3" />
              <h2 className="text-xl font-bold text-white">Sandesh Shrestha</h2>
            </div>
            <h2 className="text-3xl font-bold text-white">Sign in</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Enter your credentials to access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                  Email
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-zinc-500" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    disabled={loading}
                    className="mt-1 pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder-zinc-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                  Password
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-zinc-500" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder-zinc-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md p-3 text-center">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6" 
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            
            <div className="text-center mt-4">
              <Link to="/" className="text-sm text-zinc-400 hover:text-white transition-colors">
                ← Back to website
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
