
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  FileText, 
  LogOut, 
  Home, 
  Settings, 
  Menu, 
  X, 
  PenSquare, 
  BarChart3, 
  Search, 
  BookOpen, 
  MessageSquare 
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { NotificationsPopover } from "./NotificationsPopover";

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
  
  const userName = user?.email?.split('@')[0] || 'User';
  const userInitial = userName.charAt(0).toUpperCase();
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-100 shadow-sm
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header with Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <span className="font-semibold text-gray-800">Admin Panel</span>
          </div>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        {/* Sidebar Content */}
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-y-auto py-4">
          {/* User Info */}
          <div className="px-4 mb-6">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <Avatar className="h-10 w-10 border border-gray-200">
                <AvatarFallback className="bg-primary text-white">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-800">{userName}</p>
                <p className="text-xs text-gray-500 truncate max-w-[140px]">{user?.email}</p>
              </div>
            </div>
          </div>
          
          {/* Main Navigation */}
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mx-3 mb-2">
              Main
            </h3>
            <nav className="space-y-1">
              <Button 
                onClick={() => handleNavigation("/admin")} 
                variant="ghost" 
                className="w-full justify-start text-gray-600 hover:text-primary hover:bg-gray-50"
              >
                <LayoutDashboard className="h-5 w-5 mr-3 text-gray-400" />
                Dashboard
              </Button>
              
              <Button 
                onClick={() => handleNavigation("/admin/create")} 
                variant="ghost" 
                className="w-full justify-start text-gray-600 hover:text-primary hover:bg-gray-50"
              >
                <PenSquare className="h-5 w-5 mr-3 text-gray-400" />
                Create Post
              </Button>

              <Button 
                onClick={() => handleNavigation("/admin/analytics")} 
                variant="ghost" 
                className="w-full justify-start text-gray-600 hover:text-primary hover:bg-gray-50"
              >
                <BarChart3 className="h-5 w-5 mr-3 text-gray-400" />
                Analytics
              </Button>
            </nav>
          </div>
          
          {/* System Navigation */}
          <div className="px-3 py-2 mt-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mx-3 mb-2">
              System
            </h3>
            <nav className="space-y-1">
              <Button 
                onClick={() => handleNavigation("/admin/settings")} 
                variant="ghost" 
                className="w-full justify-start text-gray-600 hover:text-primary hover:bg-gray-50"
              >
                <Settings className="h-5 w-5 mr-3 text-gray-400" />
                Settings
              </Button>
              
              <Button 
                onClick={() => handleNavigation("/")} 
                variant="ghost" 
                className="w-full justify-start text-gray-600 hover:text-primary hover:bg-gray-50"
              >
                <BookOpen className="h-5 w-5 mr-3 text-gray-400" />
                View Blog
              </Button>
            </nav>
          </div>
          
          {/* Log Out - Bottom */}
          <div className="mt-auto px-3 pt-6 pb-2">
            <Button 
              onClick={handleSignOut} 
              variant="outline" 
              className="w-full justify-start text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-100 h-16 sticky top-0 z-40 flex items-center px-4 lg:px-6">
          <div className="flex-1 flex items-center">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="mr-2 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            
            {/* Search Bar */}
            <div className="relative max-w-md hidden md:flex items-center flex-1 ml-4">
              <Search className="absolute left-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search..." 
                className="pl-10 bg-gray-50 border-gray-100 w-full max-w-[320px] focus:border-primary" 
              />
            </div>
          </div>
          
          {/* Right Navigation Items */}
          <div className="flex items-center space-x-3">
            <NotificationsPopover />
            
            <Button variant="ghost" className="relative rounded-full" onClick={() => navigate("/admin/settings")}>
              <Avatar className="h-8 w-8 border border-gray-200">
                <AvatarFallback className="bg-primary text-white text-sm">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </header>
        
        {/* Mobile menu toggle button when sidebar is closed */}
        {isMobile && !isMobileMenuOpen && (
          <div className="fixed bottom-4 left-4 z-30">
            <Button 
              onClick={() => setIsMobileMenuOpen(true)} 
              size="icon" 
              className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
            >
              <Menu className="h-6 w-6 text-white" />
            </Button>
          </div>
        )}
        
        {/* Mobile menu overlay */}
        {isMobile && isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
        )}
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
