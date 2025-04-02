
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
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar - Desktop */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50
        w-64 bg-zinc-900 border-r border-zinc-800/50 shadow-sm
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header with Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <span className="font-semibold text-zinc-100">Admin Panel</span>
          </div>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-zinc-300 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        {/* Sidebar Content */}
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-y-auto py-4">
          {/* User Info */}
          <div className="px-4 mb-6">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-zinc-800/50">
              <Avatar className="h-10 w-10 border border-zinc-700">
                <AvatarFallback className="bg-blue-600 text-white">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-zinc-100">{userName}</p>
                <p className="text-xs text-zinc-400 truncate max-w-[140px]">{user?.email}</p>
              </div>
            </div>
          </div>
          
          {/* Main Navigation */}
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mx-3 mb-2">
              Main
            </h3>
            <nav className="space-y-1">
              <Button 
                onClick={() => handleNavigation("/admin")} 
                variant="ghost" 
                className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800"
              >
                <LayoutDashboard className="h-5 w-5 mr-3 text-zinc-500" />
                Dashboard
              </Button>
              
              <Button 
                onClick={() => handleNavigation("/admin/create")} 
                variant="ghost" 
                className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800"
              >
                <PenSquare className="h-5 w-5 mr-3 text-zinc-500" />
                Create Post
              </Button>

              <Button 
                onClick={() => handleNavigation("/admin/analytics")} 
                variant="ghost" 
                className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800"
              >
                <BarChart3 className="h-5 w-5 mr-3 text-zinc-500" />
                Analytics
              </Button>
            </nav>
          </div>
          
          {/* System Navigation */}
          <div className="px-3 py-2 mt-2">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mx-3 mb-2">
              System
            </h3>
            <nav className="space-y-1">
              <Button 
                onClick={() => handleNavigation("/admin/settings")} 
                variant="ghost" 
                className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800"
              >
                <Settings className="h-5 w-5 mr-3 text-zinc-500" />
                Settings
              </Button>
              
              <Button 
                onClick={() => handleNavigation("/")} 
                variant="ghost" 
                className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800"
              >
                <BookOpen className="h-5 w-5 mr-3 text-zinc-500" />
                View Blog
              </Button>
            </nav>
          </div>
          
          {/* Log Out - Bottom */}
          <div className="mt-auto px-3 pt-6 pb-2">
            <Button 
              onClick={handleSignOut} 
              variant="outline" 
              className="w-full justify-start text-red-400 border-red-900/20 bg-red-950/10 hover:bg-red-900/20 hover:text-red-300"
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
        <header className="bg-zinc-900 border-b border-zinc-800 h-16 sticky top-0 z-40 flex items-center px-4 lg:px-6">
          <div className="flex-1 flex items-center">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="mr-2 lg:hidden text-zinc-300 hover:text-white"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            
            {/* Search Bar */}
            <div className="relative max-w-md hidden md:flex items-center flex-1 ml-4">
              <Search className="absolute left-3 h-4 w-4 text-zinc-500" />
              <Input 
                placeholder="Search..." 
                className="pl-10 bg-zinc-800/50 border-zinc-700 w-full max-w-[320px] text-zinc-200 focus:border-blue-600" 
              />
            </div>
          </div>
          
          {/* Right Navigation Items */}
          <div className="flex items-center space-x-3">
            <NotificationsPopover />
            
            <Button variant="ghost" className="relative rounded-full" onClick={() => navigate("/admin/settings")}>
              <Avatar className="h-8 w-8 border border-zinc-700">
                <AvatarFallback className="bg-blue-600 text-white text-sm">
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
              className="h-12 w-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
            >
              <Menu className="h-6 w-6 text-white" />
            </Button>
          </div>
        )}
        
        {/* Mobile menu overlay */}
        {isMobile && isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
        )}
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-zinc-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
