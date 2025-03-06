
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import SearchBox from "./SearchBox";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the menu state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-700 shadow-md">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-blue-400 transition">
            Home
          </Link>
          <Link to="/blogs" className="text-white hover:text-blue-400 transition">
            Blogs
          </Link>
          <div className="flex items-center ml-2 space-x-2">
            <ThemeToggle />
            <SearchBox />
          </div>
        </div>

        {/* Mobile Menu Button and Search */}
        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <SearchBox />
          <button onClick={toggleMenu} className="text-white text-2xl ml-2">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-zinc-900 p-4 shadow-lg md:hidden">
            <Link to="/" className="block text-white py-2 hover:text-blue-400" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/blogs" className="block text-white py-2 hover:text-blue-400" onClick={toggleMenu}>
              Blogs
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
