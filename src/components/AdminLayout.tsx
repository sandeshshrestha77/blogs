import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  FileText, 
  LogOut, 
  Home, 
  User, 
  Settings, 
  Menu, 
  X,
  PenSquare,
  BarChart3,
  Bell,
  Search,
  BookOpen,
  MessageSquare // Added MessageSquare icon
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 h-16 fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-4 md:px-6">
        <div className="flex items-center">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <span className="hidden md:inline-block font-semibold text-xl text-primary">Blog Admin</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="relative hidden md:flex items-center max-w-xs">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-9 bg-gray-50 border-gray-200 w-full max-w-[240px] focus:border-primary"
            />
          </div>
          
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
              2
            </Badge>
          </Button>
          
          <Button 
            variant="ghost" 
            className="relative rounded-full"
            onClick={() => navigate("/admin/settings")}
          >
            <Avatar>
              <AvatarFallback className="bg-primary text-white">
                {userInitial}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <div className="pt-16 flex flex-1">
        {/* Sidebar */}
        <aside 
          className={`
            fixed top-16 bottom-0 left-0 z-30
            w-64 bg-white border-r border-gray-200
            transition-transform duration-300
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="flex flex-col h-full overflow-y-auto py-4">
            {/* User Info */}
            <div className="px-4 py-2 mb-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/90 text-white">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Navigation */}
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mx-3 mb-2">
                Main
              </h3>
              <nav className="space-y-1">
                <Button 
                  onClick={() => handleNavigation("/admin")} 
                  variant="ghost" 
                  className="w-full justify-start font-medium text-gray-700 hover:text-primary hover:bg-gray-100 rounded-lg"
                >
                  <LayoutDashboard className="h-5 w-5 mr-3 text-gray-500" />
                  Dashboard
                </Button>
                
                <Button 
                  onClick={() => handleNavigation("/admin/create")} 
                  variant="ghost" 
                  className="w-full justify-start font-medium text-gray-700 hover:text-primary hover:bg-gray-100 rounded-lg"
                >
                  <PenSquare className="h-5 w-5 mr-3 text-gray-500" />
                  Create Post
                </Button>

                <Button 
                  onClick={() => handleNavigation("/admin/analytics")} 
                  variant="ghost" 
                  className="w-full justify-start font-medium text-gray-700 hover:text-primary hover:bg-gray-100 rounded-lg"
                >
                  <BarChart3 className="h-5 w-5 mr-3 text-gray-500" />
                  Analytics
                </Button>
              </nav>
            </div>
            
            {/* Secondary Navigation */}
            <div className="px-3 py-2 mt-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mx-3 mb-2">
                System
              </h3>
              <nav className="space-y-1">
                <Button 
                  onClick={() => handleNavigation("/admin/settings")} 
                  variant="ghost" 
                  className="w-full justify-start font-medium text-gray-700 hover:text-primary hover:bg-gray-100 rounded-lg"
                >
                  <Settings className="h-5 w-5 mr-3 text-gray-500" />
                  Settings
                </Button>
                
                <Button 
                  onClick={() => handleNavigation("/")} 
                  variant="ghost" 
                  className="w-full justify-start font-medium text-gray-700 hover:text-primary hover:bg-gray-100 rounded-lg"
                >
                  <BookOpen className="h-5 w-5 mr-3 text-gray-500" />
                  View Blog
                </Button>
              </nav>
            </div>
            
            {/* Log Out - Bottom */}
            <div className="mt-auto px-3 pt-6 pb-2">
              <Button 
                onClick={handleSignOut} 
                variant="outline" 
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>
        
        {/* Mobile menu toggle button */}
        {isMobile && !isMobileMenuOpen && (
          <div className="fixed bottom-4 left-4 z-30">
            <Button 
              onClick={() => setIsMobileMenuOpen(true)}
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        )}
        
        {/* Main Content */}
        <main className="flex-1 ml-0 lg:ml-64 px-4 py-6 md:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
