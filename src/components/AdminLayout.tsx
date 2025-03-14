
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, FileText, LogOut, Home, User, Settings, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";

const AdminLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };
  
  return (
    <div className="min-h-screen bg-[#f0f0f1]">
      <Navbar />
      
      <div className="fixed z-30 bottom-4 right-4 lg:hidden">
        <Button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="h-12 w-12 rounded-full shadow-lg bg-[#2271b1] hover:bg-[#135e96] p-0 flex items-center justify-center"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5 text-white" />
          ) : (
            <Menu className="h-5 w-5 text-white" />
          )}
        </Button>
      </div>
      
      <div className="flex min-h-screen pt-16 px-0 py-0">
        
        <div 
          className={`${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } w-64 bg-[#121826] text-white fixed left-0 top-0 pt-24 h-full z-20 transition-transform duration-300 ease-in-out overflow-y-auto py-[20px] lg:shadow-none shadow-xl`}
        >
          <div className="px-4 py-3">
            
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
            
            
            <div className="space-y-1 mt-4">
              <p className="text-xs uppercase text-gray-400 font-medium mb-2 px-2">Main</p>
              
              <Button 
                onClick={() => handleNavigation("/admin")} 
                variant="ghost" 
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#1e2538] pl-2 rounded-lg transition-all duration-200"
              >
                <LayoutDashboard className="h-5 w-5 mr-3" />
                Dashboard
              </Button>
              
              <Button 
                onClick={() => handleNavigation("/admin/create")} 
                variant="ghost" 
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#1e2538] pl-2 rounded-lg transition-all duration-200"
              >
                <FileText className="h-5 w-5 mr-3" />
                Content
              </Button>
            </div>
            
            <div className="space-y-1 mt-6">
              <p className="text-xs uppercase text-gray-400 font-medium mb-2 px-2">System</p>
              
              <Button 
                onClick={() => handleNavigation("/admin/settings")} 
                variant="ghost" 
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#1e2538] pl-2 rounded-lg transition-all duration-200"
              >
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </Button>
              
              <Button 
                onClick={() => handleNavigation("/")} 
                variant="ghost" 
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#1e2538] pl-2 rounded-lg transition-all duration-200"
              >
                <Home className="h-5 w-5 mr-3" />
                View Site
              </Button>
            </div>
            
            <Separator className="bg-[#2a3347] my-4" />
            
            <Button 
              onClick={handleSignOut} 
              variant="ghost" 
              className="w-full justify-start text-gray-300 hover:text-red-400 hover:bg-[#1e2538] pl-2 rounded-lg transition-all duration-200 mt-2"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
        
        <div className="w-full lg:ml-64 p-4 md:p-6 lg:p-8 pt-20">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
