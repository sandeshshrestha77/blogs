
import { Link } from "react-router-dom";
import { SearchDialog } from "./SearchDialog";
import { Search } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Branding */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-white hidden sm:inline-block">Sandesh's Blog</span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">Articles</Link>
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">About</Link>
          </div>

          {/* Search Button */}
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
              <Search size={20} />
            </Button>
            <SearchDialog />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
