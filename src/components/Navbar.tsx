import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
  return <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-zinc-950/95 backdrop-blur-md shadow-md" : "bg-zinc-950/80 backdrop-blur-sm"} border-b border-zinc-800/50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 px-0">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto transition-transform duration-300 group-hover:scale-105" />
            
          </Link>

          {/* Navigation Links - Only show on larger screens */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-lg font-medium transition-colors duration-200 hover:text-blue-400 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-blue-400 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100 ${isActive("/") ? "text-blue-400 after:scale-x-100" : "text-zinc-300"}`}>
              Home
            </Link>
            <Link to="/blogs" className={`text-lg font-medium transition-colors duration-200 hover:text-blue-400 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-blue-400 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100 ${isActive("/blogs") ? "text-blue-400 after:scale-x-100" : "text-zinc-300"}`}>
              Blogs
            </Link>
          </div>

          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden flex items-center">
            <button type="button" className="text-zinc-300 hover:text-white focus:outline-none" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-7 w-7 transition-transform duration-200" /> : <Menu className="h-7 w-7 transition-transform duration-200" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Links - Conditionally rendered with animation */}
        {isMenuOpen && <div className="md:hidden animate-fade-in">
            <div className="px-3 pt-2 pb-4 space-y-3 border-t border-zinc-800/30 my-1">
              <Link to="/" className={`block py-3 px-4 rounded-lg text-base font-medium transition-colors duration-200 ${isActive("/") ? "text-white bg-blue-600/20 border border-blue-500/30" : "text-zinc-300 hover:text-white hover:bg-zinc-800/50"}`} onClick={toggleMenu}>
                Home
              </Link>
              <Link to="/blogs" className={`block py-3 px-4 rounded-lg text-base font-medium transition-colors duration-200 ${isActive("/blogs") ? "text-white bg-blue-600/20 border border-blue-500/30" : "text-zinc-300 hover:text-white hover:bg-zinc-800/50"}`} onClick={toggleMenu}>
                Blogs
              </Link>
            </div>
          </div>}
      </div>
    </nav>;
};
export default Navbar;