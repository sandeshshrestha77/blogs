
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Mail, Lock, ArrowRight, LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signIn, session, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/admin";
  
  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const { error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error during OAuth redirect:', error);
        toast.error('Authentication failed. Please try again.');
      }
    };
    
    if (session) {
      navigate(from, { replace: true });
    } else if (location.pathname === '/auth/callback') {
      handleOAuthRedirect();
    }
  }, [session, navigate, from, location.pathname]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          toast.error("Passwords don't match");
          setIsLoading(false);
          return;
        }
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        toast.success("Sign up successful! Please check your email for verification.");
      } else {
        await signIn(email, password);
        toast.success("Login successful!");
        navigate(from, { replace: true });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error instanceof Error) {
          toast.error(error.message || "Authentication failed. Please try again.");
        } else {
          toast.error("An unknown error occurred. Please try again.");
        }
      } else {
        toast.error("An unknown error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <Card className="w-full max-w-md bg-zinc-900/80 border border-zinc-800 shadow-2xl backdrop-blur-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold text-white">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {isSignUp 
              ? "Sign up to start creating and managing your blog content" 
              : "Sign in to access your blog dashboard"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Email</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Mail size={18} />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">Password</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Lock size={18} />
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
                />
              </div>
            </div>
            
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-zinc-300">Confirm Password</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    <Lock size={18} />
                  </div>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                </div>
              </div>
            )}
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 mt-2"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : isSignUp ? (
                <>Create Account <ArrowRight className="ml-2 h-4 w-4" /></>
              ) : (
                <>Sign In <LogIn className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Separator className="my-4" />
            <p className="text-sm text-zinc-400">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <Button
                type="button"
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-400 hover:text-blue-300 px-2 py-0 h-auto"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
