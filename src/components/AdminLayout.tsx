import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, FileText, LogOut, Home, User, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import Navbar from "./Navbar";
const AdminLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const {
    signOut,
    user
  } = useAuth();
  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };
  return <div className="min-h-screen bg-[#f0f0f1]">
      <Navbar />
      
      <div className="flex h-screen pt-16 px-0 py-0">
        {/* Redesigned sidebar */}
        <div className="w-64 bg-[#121826] text-white h-full fixed left-0 top-0 pt-24 overflow-y-auto py-[20px]">
          <div className="px-4 py-3">
            {/* User profile section */}
            <div className="flex items-center space-x-2 mb-6 bg-[#1a2032] p-3 rounded-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300">Welcome</p>
                <p className="text-zinc-50 font-semibold">{user?.email?.split('@')[0] || 'User'}</p>
              </div>
            </div>
            
            <Separator className="bg-[#2a3347] my-3" />
            
            {/* Main navigation */}
            <div className="space-y-1 mt-4">
              <p className="text-xs uppercase text-gray-400 font-medium mb-2 px-2">Main</p>
              
              <Button onClick={() => navigate("/admin")} variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#1e2538] pl-2 rounded-lg transition-all duration-200">
                <LayoutDashboard className="h-5 w-5 mr-3" />
                Dashboard
              </Button>
              
              <Button onClick={() => navigate("/admin/create")} variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#1e2538] pl-2 rounded-lg transition-all duration-200">
                <FileText className="h-5 w-5 mr-3" />
                Content
              </Button>
            </div>
            
            <div className="space-y-1 mt-6">
              <p className="text-xs uppercase text-gray-400 font-medium mb-2 px-2">System</p>
              
              <Button onClick={() => navigate("/admin/settings")} variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#1e2538] pl-2 rounded-lg transition-all duration-200">
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </Button>
              
              <Button onClick={() => navigate("/")} variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#1e2538] pl-2 rounded-lg transition-all duration-200">
                <Home className="h-5 w-5 mr-3" />
                View Site
              </Button>
            </div>
            
            <Separator className="bg-[#2a3347] my-4" />
            
            {/* Sign out button */}
            <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start text-gray-300 hover:text-red-400 hover:bg-[#1e2538] pl-2 rounded-lg transition-all duration-200 mt-2">
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="ml-64 flex-1 p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>;
};
export default AdminLayout;