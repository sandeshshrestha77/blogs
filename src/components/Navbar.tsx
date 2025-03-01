import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  // State to manage the mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the menu state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 py-0 my-0">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          </Link>

          {/* Navigation Links - Only show on larger screens */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-zinc-300 hover:text-white transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/blogs"
              className="text-zinc-300 hover:text-white transition-colors duration-200"
            >
              Blogs
            </Link>
          </div>

          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-zinc-300 hover:text-white focus:outline-none focus:text-white"
              onClick={toggleMenu} // Toggle the menu state
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Links - Conditionally rendered */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="block text-zinc-300 hover:text-white transition-colors duration-200"
                onClick={toggleMenu} // Close the menu when a link is clicked
              >
                Home
              </Link>
              <Link
                to="/blogs"
                className="block text-zinc-300 hover:text-white transition-colors duration-200"
                onClick={toggleMenu} // Close the menu when a link is clicked
              >
                Blogs
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;