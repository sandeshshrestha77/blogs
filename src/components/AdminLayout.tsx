
import Navbar from "./Navbar";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Layout, PlusCircle, FileText, LogOut, ChevronRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12 pt-32 sm:px-6 lg:px-8">
        <div className="mb-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:16px_16px]"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/15 rounded-lg p-3 shadow-lg">
                    <Layout className="h-6 w-6" />
                  </div>
                  <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                </div>
                <p className="text-blue-100 max-w-lg">
                  Manage your blog posts and content from this central dashboard. Create, edit, and organize your articles with ease.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Button 
            onClick={() => navigate("/admin")}
            variant="outline"
            className="h-28 bg-[#1A1B1E] border-2 border-zinc-800 hover:border-blue-500 hover:bg-[#1E1F23] transition-all shadow-xl rounded-xl flex flex-col items-center justify-center gap-3 text-white group"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
            <span className="font-medium flex items-center">
              View Posts
              <ChevronRight className="h-4 w-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </span>
          </Button>
          
          <Button 
            onClick={() => navigate("/admin/create")}
            variant="outline"
            className="h-28 bg-[#1A1B1E] border-2 border-zinc-800 hover:border-green-500 hover:bg-[#1E1F23] transition-all shadow-xl rounded-xl flex flex-col items-center justify-center gap-3 text-white group"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
              <PlusCircle className="h-6 w-6 text-green-400" />
            </div>
            <span className="font-medium flex items-center">
              Create Post
              <ChevronRight className="h-4 w-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </span>
          </Button>
          
          <Button 
            onClick={handleSignOut}
            variant="outline"
            className="h-28 bg-[#1A1B1E] border-2 border-zinc-800 hover:border-red-500 hover:bg-[#1E1F23] transition-all shadow-xl rounded-xl flex flex-col items-center justify-center gap-3 text-white group"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
              <LogOut className="h-6 w-6 text-red-400" />
            </div>
            <span className="font-medium flex items-center">
              Sign Out
              <ChevronRight className="h-4 w-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </span>
          </Button>
        </div>

        <Card className="border-zinc-800/50 bg-zinc-900/20 shadow-xl mb-8">
          <CardContent className="p-0">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLayout;
