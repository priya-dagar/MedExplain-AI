import { NavLink, useNavigate } from "react-router-dom";

interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: "ti-layout-dashboard" },
  { label: "AI Health Companion", path: "/chat", icon: "ti-sparkles", badge: "AI" },
  { label: "Upload Prescription", path: "/upload-prescription", icon: "ti-upload" },
  { label: "Health Records", path: "/health-records", icon: "ti-folder" },
  { label: "Find Healthcare", path: "/find-healthcare", icon: "ti-map-pin" },
  { label: "Profile", path: "/profile", icon: "ti-user" },
  { label: "Settings", path: "/settings", icon: "ti-settings" },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <aside className="w-[280px] h-screen bg-white border-r border-[#e5e2d8] flex flex-col justify-between fixed left-0 top-0">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-6">
          <div className="w-9 h-9 rounded-lg bg-[#1a4d4a] flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <span className="font-semibold text-[#1a2e2e] text-lg">
            MedExplain <span className="text-teal-600">AI</span>
          </span>
        </div>

        {/* Nav links */}
        <nav className="px-4 mt-2 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[15px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#1a4d4a] text-white"
                    : "text-[#4a4a44] hover:bg-[#f1efe6]"
                }`
              }
            >
              <i className={`ti ${item.icon} text-lg`} aria-hidden="true" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-50 text-teal-700">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="px-4 py-6 border-t border-[#e5e2d8]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[15px] font-medium text-[#4a4a44] hover:bg-[#f1efe6] w-full transition-colors"
        >
          <i className="ti ti-logout text-lg" aria-hidden="true" />
          Logout
        </button>
      </div>
    </aside>
  );
}