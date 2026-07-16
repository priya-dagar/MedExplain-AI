import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={`text-sm px-4 py-2 rounded-md transition-colors ${
        location.pathname === to
          ? "bg-blue-50 text-blue-700 font-medium"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-white border-b px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-8">
        <span className="font-semibold text-gray-800 text-lg">MedExplain AI</span>
        <div className="flex gap-3">
          {navLink("/dashboard", "Dashboard")}
          {navLink("/chat", "AI Chat")}
          {navLink("/upload-prescription", "Upload Prescription")}
          {navLink("/health-records", "Health Records")}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user && <span className="text-sm text-gray-500">{user.name}</span>}
        <button
          onClick={logout}
          className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}