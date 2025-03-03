import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, BookOpen, ChevronDown, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const {
    session
  } = useAuth();
  const location = useLocation();

  // Function to toggle the menu state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-zinc-950/90 backdrop-blur-lg shadow-lg" : "bg-transparent"} border-b border-zinc-800/20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        

        {/* Mobile Navigation Links */}
        {isMenuOpen && <div className="md:hidden animate-fade-in">
            <div className="px-3 pt-2 pb-4 space-y-2 border-t border-zinc-800/30 my-1">
              <Link to="/" className={`block py-3 px-4 rounded-lg text-base font-medium transition-colors duration-200 ${isActive("/") ? "text-white bg-blue-600/20 border border-blue-500/30" : "text-zinc-300 hover:text-white hover:bg-zinc-800/50"}`} onClick={toggleMenu}>
                Home
              </Link>
              <Link to="/blogs" className={`block py-3 px-4 rounded-lg text-base font-medium transition-colors duration-200 ${isActive("/blogs") ? "text-white bg-blue-600/20 border border-blue-500/30" : "text-zinc-300 hover:text-white hover:bg-zinc-800/50"}`} onClick={toggleMenu}>
                Blogs
              </Link>
              
              {/* Admin Link - Only show if logged in */}
              {session && <Link to="/admin" className="block py-3 px-4 rounded-lg text-base font-medium transition-colors duration-200 text-zinc-300 hover:text-white hover:bg-zinc-800/50" onClick={toggleMenu}>
                  Dashboard
                </Link>}
              
              {/* Login/Logout Link */}
              {!session ? <Link to="/login" className="block py-3 px-4 rounded-lg text-base font-medium transition-colors duration-200 bg-blue-600 hover:bg-blue-700 text-white" onClick={toggleMenu}>
                  Sign In
                </Link> : <Link to="/login" className="block py-3 px-4 rounded-lg text-base font-medium transition-colors duration-200 border border-zinc-700 text-zinc-300" onClick={toggleMenu}>
                  Sign Out
                </Link>}
            </div>
          </div>}
      </div>
    </nav>;
};
export default Navbar;