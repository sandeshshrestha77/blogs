import { Link } from "react-router-dom";
const Navbar = () => {
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center md:justify-start items-center h-20">
          {/* Logo Only */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            
          </Link>
        </div>
      </div>
    </nav>;
};
export default Navbar;