import { Link } from "react-router-dom";
import { SearchDialog } from "./SearchDialog";
const Navbar = () => {
  return <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-zinc-950">404 Aesthetics</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <SearchDialog />
          </div>
        </div>
      </div>
    </nav>;
};
export default Navbar;