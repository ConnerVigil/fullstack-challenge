import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path
      ? "font-bold border-b-2 border-[#00A1F0]"
      : "";
  };

  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold flex items-center">
          <img src="/sponsorcx.png" alt="SponsorCX Logo" className="h-8 mr-2" />
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
