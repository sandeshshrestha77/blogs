
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, FileText, LogOut, Home, Settings, Menu, X, PenSquare, BarChart3, BookOpen, ChevronRight, User } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState, useEffect } from "react";
import { NotificationsPopover } from "./NotificationsPopover";
import { toast } from "@/hooks/use-toast";

const AdminLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    signOut,
    user
  } = useAuth();
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
    if (path === location.pathname) return; // Don't navigate if already on the page
    navigate(path);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "An error occurred while signing out",
        variant: "destructive"
      });
    }
  };
  
  const userName = user?.email?.split('@')[0] || 'User';
  const userInitial = userName.charAt(0).toUpperCase();
  
  const isActive = (path: string) => {
    return location.pathname === path ? "sidebar-active" : "sidebar-item";
  };
  
  return <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex">
      {/* Sidebar - Desktop */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50
        w-64 bg-white dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-700
        shadow-md transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header with Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-zinc-700 bg-indigo-600 dark:bg-indigo-700">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold text-white">Dashboard</span>
          </div>
          {isMobile && <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-white hover:text-gray-200 hover:bg-indigo-700">
              <X className="h-5 w-5" />
            </Button>}
        </div>
        
        {/* Sidebar Content */}
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-y-auto py-4">
          {/* User Info */}
          <div className="px-4 mb-6">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/30">
              <Avatar className="h-10 w-10 border border-indigo-200 dark:border-indigo-700 bg-indigo-100 dark:bg-indigo-900">
                <AvatarFallback className="bg-indigo-600 text-white">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[140px]">{user?.email}</p>
              </div>
            </div>
          </div>
          
          {/* Main Navigation */}
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mx-3 mb-2">
              Main
            </h3>
            <nav className="space-y-1">
              <Button onClick={() => handleNavigation("/admin")} variant={isActive("/admin")} className="w-full justify-start">
                <LayoutDashboard className="h-5 w-5 mr-3 text-indigo-500 dark:text-indigo-400" />
                Dashboard
              </Button>
              
              <Button onClick={() => handleNavigation("/admin/create")} variant={isActive("/admin/create")} className="w-full justify-start">
                <PenSquare className="h-5 w-5 mr-3 text-indigo-500 dark:text-indigo-400" />
                Create Post
              </Button>

              <Button onClick={() => handleNavigation("/admin/analytics")} variant={isActive("/admin/analytics")} className="w-full justify-start">
                <BarChart3 className="h-5 w-5 mr-3 text-indigo-500 dark:text-indigo-400" />
                Analytics
              </Button>
            </nav>
          </div>
          
          {/* System Navigation */}
          <div className="px-3 py-2 mt-2">
            <h3 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mx-3 mb-2">
              System
            </h3>
            <nav className="space-y-1">
              <Button onClick={() => handleNavigation("/admin/settings")} variant={isActive("/admin/settings")} className="w-full justify-start">
                <Settings className="h-5 w-5 mr-3 text-indigo-500 dark:text-indigo-400" />
                Settings
              </Button>
              
              <Button onClick={() => handleNavigation("/")} variant="ghost" className="w-full justify-start text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800">
                <BookOpen className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                View Blog
              </Button>
            </nav>
          </div>
          
          {/* Log Out - Bottom */}
          <div className="mt-auto px-3 pt-6 pb-2">
            <Button onClick={handleSignOut} variant="outline" className="w-full justify-start text-red-600 border-gray-200 dark:border-zinc-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <header className="bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 h-16 sticky top-0 z-40 flex items-center px-4 lg:px-6 shadow-sm">
          <div className="flex-1 flex items-center">
            {isMobile && <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="mr-2 lg:hidden text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-zinc-700">
                <Menu className="h-5 w-5" />
              </Button>}
            
            <div className="text-gray-800 dark:text-white font-medium ml-4 flex items-center">
              <span className="text-indigo-600 dark:text-indigo-400">Admin</span> 
              <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
              <span>
              {location.pathname.includes('/create') ? 'Create Post' : 
               location.pathname.includes('/edit') ? 'Edit Post' : 
               location.pathname.includes('/analytics') ? 'Analytics' : 
               location.pathname.includes('/settings') ? 'Settings' : 
               'Dashboard'}
              </span>
            </div>
          </div>
          
          {/* Right Navigation Items */}
          <div className="flex items-center space-x-3">
            <NotificationsPopover />
            
            <Button variant="ghost" className="relative rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700" onClick={() => handleNavigation("/admin/settings")}>
              <Avatar className="h-8 w-8 border border-indigo-200 dark:border-indigo-600">
                <AvatarFallback className="bg-indigo-600 text-white text-sm">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </header>
        
        {/* Mobile menu toggle button when sidebar is closed */}
        {isMobile && !isMobileMenuOpen && <div className="fixed bottom-4 left-4 z-30">
            <Button onClick={() => setIsMobileMenuOpen(true)} size="icon" className="h-12 w-12 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </div>}
        
        {/* Mobile menu overlay */}
        {isMobile && isMobileMenuOpen && <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />}
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-zinc-900">
          {children}
        </main>
      </div>
    </div>;
};
export default AdminLayout;
