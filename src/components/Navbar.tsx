
import { Link } from "react-router-dom";
import { SearchDialog } from "./SearchDialog";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm backdrop-blur-lg bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          </Link>

          <div className="flex items-center">
            <SearchDialog />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
