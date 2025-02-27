import { Link } from "react-router-dom";
import { SearchDialog } from "./SearchDialog";
const Navbar = () => {
  return <nav className="border-b border-zinc-800 shadow-md bg-inherit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-zinc-950">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Branding */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
          </Link>

          {/* Search Button */}
          <SearchDialog />
        </div>
      </div>
    </nav>;
};
export default Navbar;