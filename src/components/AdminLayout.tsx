
import Navbar from "./Navbar";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate("/admin")}
              className="border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            >
              Posts
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/admin/create")}
              className="border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            >
              Create Post
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-red-600 hover:text-red-700"
            >
              Sign Out
            </Button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
