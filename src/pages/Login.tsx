
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="max-w-4xl w-full bg-[#1A1B1E] shadow-2xl rounded-lg overflow-hidden grid md:grid-cols-2 border border-zinc-800">
        {/* Left Side - Image */}
        <div className="hidden md:flex items-center justify-center bg-zinc-900">
          <img src="https://wallpapercave.com/wp/wp5943234.jpg" alt="Login" className="w-full h-full object-cover opacity-80" />
        </div>

        {/* Right Side - Form */}
        <div className="p-8 w-full flex flex-col justify-center">
          <Card className="w-full border-zinc-800 bg-transparent">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-white">Admin Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
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
                  />
                </div>
                <div className="relative">
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
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
