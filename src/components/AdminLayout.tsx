
import Navbar from "./Navbar";
import { Button } from "./ui/button";
import { useNavigate, Link } from "react-router-dom";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate("/admin")}>
              Posts
            </Button>
            <Button variant="outline" onClick={() => navigate("/admin/create")}>
              Create Post
            </Button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
