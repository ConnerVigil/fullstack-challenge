import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    return location.pathname === path
      ? "font-bold border-b-2 border-blue-500"
      : "";
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/">Fullstack Challenge</Link>
        </div>
        <div className="flex space-x-6">
          <Link
            to="/"
            className={`hover:text-blue-300 transition ${isActive("/")}`}
          >
            Home
          </Link>
          <Link
            to="/deals"
            className={`hover:text-blue-300 transition ${isActive("/deals")}`}
          >
            Deals
          </Link>
          <Link
            to="/contact"
            className={`hover:text-blue-300 transition ${isActive("/contact")}`}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
