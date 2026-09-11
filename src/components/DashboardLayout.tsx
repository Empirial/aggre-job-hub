import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Settings,
  Menu,
  X,
  MessageSquare,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { signOut } from "@/lib/auth";
import ChatBot from "@/components/ChatBot";
import Logo from "@/components/Logo";

const navItems = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard, end: true },
  { to: "/jobs", label: "Find Jobs", icon: Briefcase },
  { to: "/cv-editor", label: "My CVs", icon: FileText },
  { to: "/z83", label: "Z83 Form", icon: FileCheck2 },
  { to: "/chat", label: "Chat with Zara", icon: MessageSquare },
  { to: "/settings", label: "My Profile", icon: Settings },
];

const LS_KEY = "cg_sidebar_collapsed";

function Sidebar({
  collapsed,
  onToggle,
  onClose,
}: {
  collapsed: boolean;
  onToggle: () => void;
  onClose?: () => void;
}) {
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const displayName = profile?.name || "User";
  const displaySub = profile?.email || "Job Seeker";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleLogout() {
    try {
      await signOut();
    } catch {
      /* ignore */
    }
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        "h-16 flex items-center border-b border-gray-100 shrink-0 transition-all duration-200",
        collapsed ? "justify-center px-2" : "justify-between px-4"
      )}>
        {!collapsed && (
          <Link to="/" aria-label="CareerGate home">
            <Logo />
          </Link>
        )}
        {collapsed && (
          <Link
            to="/"
            aria-label="CareerGate home"
            className="w-7 h-7 rounded-lg bg-[#F7941D] text-white grid place-items-center text-xs font-bold"
          >
            CG
          </Link>
        )}
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className={cn("flex-1 py-4 space-y-0.5 overflow-y-auto", collapsed ? "px-2" : "px-3")}>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-lg text-sm transition-colors",
                collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                isActive
                  ? "bg-brand-600 text-white font-medium"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {/* User + collapse toggle */}
      <div className="border-t border-gray-100 shrink-0">
        {/* User row */}
        {!collapsed && (
          <div className="flex items-center gap-3 px-5 py-3">
            <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-400 truncate">{displaySub}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="text-gray-400 hover:text-gray-600 shrink-0 p-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
        {collapsed && (
          <div className="flex flex-col items-center gap-2 px-2 py-3">
            <div
              className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600"
              title={displayName}
            >
              {initials}
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="text-gray-400 hover:text-gray-600"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={onToggle}
          className={cn(
            "hidden lg:flex w-full items-center gap-2 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors border-t border-gray-100 py-2",
            collapsed ? "justify-center px-2" : "px-4"
          )}
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" />
            : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem(LS_KEY) === "1"; } catch { return false; }
  });
  const location = useLocation();
  const isFullChat = location.pathname === "/chat";

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, collapsed ? "1" : "0"); } catch { /* ignore */ }
  }, [collapsed]);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-white border-r border-gray-100 shrink-0 transition-all duration-200",
          collapsed ? "w-14" : "w-56"
        )}
      >
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
        />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white flex flex-col shadow-xl transition-transform duration-200 lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar
          collapsed={false}
          onToggle={() => {}}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center gap-3 px-4 h-14 bg-white border-b border-gray-100 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-900"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" aria-label="CareerGate home">
            <Logo />
          </Link>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
        {!isFullChat && <ChatBot />}
      </div>
    </div>
  );
}
