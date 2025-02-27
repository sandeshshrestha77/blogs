
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">
      <div className="max-w-5xl w-full bg-[#1A1B1E] shadow-2xl rounded-2xl overflow-hidden grid md:grid-cols-2 border border-zinc-800">
        {/* Left Side - Decorative */}
        <div className="relative hidden md:block bg-zinc-900 p-12">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">Welcome back!</h2>
            <p className="text-gray-400">Sign in to access your admin dashboard</p>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-12 left-8 w-32 h-32 border border-zinc-800 rounded-full opacity-20"></div>
            <div className="absolute bottom-24 right-8 w-48 h-48 border border-zinc-800 rounded-full opacity-20"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-zinc-800 rounded-full opacity-10"></div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-12 w-full flex flex-col justify-center">
          <div className="max-w-sm w-full mx-auto">
            <h3 className="text-2xl font-bold text-white mb-8">Sign In</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  disabled={loading}
                  className="bg-zinc-900 border-zinc-700 text-white placeholder-gray-500"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="bg-zinc-900 border-zinc-700 text-white placeholder-gray-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6" 
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
