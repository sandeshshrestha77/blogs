
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedPreference = localStorage.getItem('darkMode');
    return storedPreference === 'true' || (!storedPreference && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    
    // Apply dark mode to the document
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  useEffect(() => {
    // Apply the dark mode on initial load
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDarkMode]);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-zinc-900/80 backdrop-blur-md border-b border-zinc-700/50 shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        <Link to="/" className="flex items-center space-x-2 animate-fade-in">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
        </Link>

        <div className="hidden md:flex items-center space-x-8 animate-fade-in">
          <Link to="/" className={`text-lg transition-all duration-300 ${isActive('/') ? 'text-blue-400 font-medium' : 'text-white hover:text-blue-400'}`}>
            Home
          </Link>
          <Link to="/blogs" className={`text-lg transition-all duration-300 ${isActive('/blogs') ? 'text-blue-400 font-medium' : 'text-white hover:text-blue-400'}`}>
            Blogs
          </Link>
          <a href="https://sandeshshrestha.xyz" target="_blank" rel="noopener noreferrer" className="text-lg text-white hover:text-blue-400 transition-all duration-300">
            Portfolio
          </a>
          
          {/* Add dark/light mode toggle */}
          <Button 
            variant="ghost" 
            className="p-2 rounded-full text-white hover:bg-zinc-800" 
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Link to="/login">
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
              Admin Login
            </Button>
          </Link>
        </div>

        <div className="flex items-center space-x-2 md:hidden">
          <Button 
            variant="ghost" 
            className="p-2 rounded-full text-white hover:bg-zinc-800" 
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-zinc-800"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 shadow-lg md:hidden animate-fade-in">
          <div className="p-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`block py-2 px-4 rounded-md ${isActive('/') ? 'bg-blue-600/20 text-blue-400 font-medium' : 'text-white hover:bg-zinc-800'}`} 
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/blogs" 
              className={`block py-2 px-4 rounded-md ${isActive('/blogs') ? 'bg-blue-600/20 text-blue-400 font-medium' : 'text-white hover:bg-zinc-800'}`} 
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
              <Link to="/login" onClick={toggleMenu}>
                <Button variant="default" className="w-full">
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
