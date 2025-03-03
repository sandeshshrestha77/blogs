import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, PlusCircle, FileText, LogOut, Settings, Home, User } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
const AdminLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const {
    signOut
  } = useAuth();
  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };
  return <div className="min-h-screen bg-[#f0f0f1]">
      <Navbar />
      
      <div className="flex h-screen pt-16 px-0 py-0">
        {/* WordPress-style sidebar */}
        <div className="w-64 bg-[#1d2327] text-white h-full fixed left-0 top-0 pt-24 overflow-y-auto py-[20px]">
          <div className="px-4 py-3">
            <div className="flex items-center space-x-2 mb-6">
              <User className="h-6 w-6 text-gray-300" />
              <div>
                <p className="text-sm font-medium text-gray-200">Welcome,</p>
                <p className="text-zinc-50 text-xl font-semibold">Sandesh shrestha</p>
              </div>
            </div>
            
            <Separator className="bg-gray-700 my-2" />
            
            <nav className="space-y-1">
              <Button onClick={() => navigate("/admin")} variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#2c3338] pl-2">
                <LayoutDashboard className="h-5 w-5 mr-2" />
                Dashboard
              </Button>
              
              
              
              
              
              <Button onClick={() => navigate("/admin/create")} variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#2c3338] pl-2">
                <PlusCircle className="h-5 w-5 mr-2" />
                Add New
              </Button>
              
              
              
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#2c3338] pl-2">
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </Button>
              
              <Button onClick={() => navigate("/")} variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#2c3338] pl-2">
                <Home className="h-5 w-5 mr-2" />
                View Site
              </Button>
              
              <Separator className="bg-gray-700 my-4" />
              
              <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start text-gray-300 hover:text-red-400 hover:bg-[#2c3338] pl-2">
                <LogOut className="h-5 w-5 mr-2" />
                Log Out
              </Button>
            </nav>
          </div>
          <div className="px-4 py-3 mt-auto">
            
          </div>
        </div>
        
        {/* Main content */}
        <div className="ml-64 flex-1 p-8">
          {children}
        </div>
      </div>
    </div>;
};
export default AdminLayout;