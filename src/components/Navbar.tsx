
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-zinc-900/80 backdrop-blur-md border-b border-zinc-700/50 shadow-md' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        <Link to="/" className="flex items-center space-x-2 animate-fade-in">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          <span className="text-white font-bold text-xl hidden sm:inline-block">Sandesh Shrestha</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8 animate-fade-in">
          <Link 
            to="/" 
            className={`text-lg transition-all duration-300 ${
              isActive('/') 
                ? 'text-blue-400 font-medium' 
                : 'text-white hover:text-blue-400'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/blogs" 
            className={`text-lg transition-all duration-300 ${
              isActive('/blogs') 
                ? 'text-blue-400 font-medium' 
                : 'text-white hover:text-blue-400'
            }`}
          >
            Blogs
          </Link>
          <a 
            href="https://sandeshshrestha.xyz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-lg text-white hover:text-blue-400 transition-all duration-300"
          >
            Portfolio
          </a>
        </div>

        <div className="flex items-center space-x-4 animate-fade-in">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-white hover:bg-zinc-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <a 
            href="https://github.com/sandeshshrestha" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full text-white hover:bg-zinc-800 transition-colors hidden sm:block"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>

          <button 
            onClick={toggleMenu} 
            className="text-white p-2 rounded-md hover:bg-zinc-800 transition-colors md:hidden"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 shadow-lg md:hidden animate-fade-in">
          <div className="p-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`block py-2 px-4 rounded-md ${
                isActive('/') 
                  ? 'bg-blue-600/20 text-blue-400 font-medium' 
                  : 'text-white hover:bg-zinc-800'
              }`} 
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/blogs" 
              className={`block py-2 px-4 rounded-md ${
                isActive('/blogs') 
                  ? 'bg-blue-600/20 text-blue-400 font-medium' 
                  : 'text-white hover:bg-zinc-800'
              }`} 
              onClick={toggleMenu}
            >
              Blogs
            </Link>
            <a 
              href="https://sandeshshrestha.xyz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block py-2 px-4 rounded-md text-white hover:bg-zinc-800"
              onClick={toggleMenu}
            >
              Portfolio
            </a>
            <div className="pt-2 border-t border-zinc-800">
              <Button variant="default" className="w-full">
                Let's Connect
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
