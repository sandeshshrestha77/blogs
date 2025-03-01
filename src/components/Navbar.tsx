import { Link } from "react-router-dom";
const Navbar = () => {
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            
          </Link>
          
          {/* Navigation Links - Only show on larger screens */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
            
            
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">About</Link>
          </div>
          
          {/* Login Button */}
          <div className="flex items-center">
            
          </div>
        </div>
      </div>
    </nav>;
};
export default Navbar;