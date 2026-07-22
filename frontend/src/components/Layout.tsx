import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Sparkles,
  Upload,
  FolderOpen,
  MapPin,
  User,
  Settings,
  Bell,
} from "lucide-react";

// Maps route paths to the breadcrumb label + icon shown in the top bar.
// Extend this whenever you add a new page.
const PAGE_META: Record<string, { label: string; icon: React.ElementType }> = {
  "/dashboard": { label: "Dashboard", icon: LayoutDashboard },
  "/chat": { label: "AI Health Companion", icon: Sparkles },
  "/upload-prescription": { label: "Upload Prescription", icon: Upload },
  "/health-records": { label: "Health Records", icon: FolderOpen },
  "/find-healthcare": { label: "Find Healthcare", icon: MapPin },
  "/profile": { label: "Profile", icon: User },
  "/settings": { label: "Settings", icon: Settings },
};

export default function Layout() {
  const location = useLocation();
  const meta = PAGE_META[location.pathname];
  const Icon = meta?.icon;

  const { user } = useAuth();
  const userName = user?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#f5f3ed]">
      <Sidebar />

      <div className="flex-1 ml-[280px] flex flex-col">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-[#e5e2d8] flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-[#1a2e2e] font-medium">
            {Icon && <Icon size={18} className="text-teal-600" />}
            {meta?.label ?? ""}
          </div>
          <div className="flex items-center gap-5">
            <button aria-label="Notifications" className="relative text-[#6b6b63]">
              <Bell size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-teal-500" />
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              aria-label="Go to profile"
            >
              <div className="w-8 h-8 rounded-full bg-[#1a4d4a] text-white flex items-center justify-center text-sm font-semibold">
                {userInitial}
              </div>
              <span className="text-sm font-medium text-[#1a2e2e]">{userName}</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}