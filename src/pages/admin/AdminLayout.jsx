import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Megaphone,
  Settings,
  MessageSquare,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useSession } from "../../hooks/useStore";
import { auth } from "../../lib/store";
import RetroMark from "../../components/common/RetroMark";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: ShoppingBag },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
  { to: "/admin/settings", label: "Company Settings", icon: Settings },
];

export default function AdminLayout() {
  const session = useSession();
  const navigate = useNavigate();

  if (!session) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex min-h-screen">
      <aside className="glass-strong fixed inset-y-0 left-0 z-40 hidden w-64 flex-col p-5 lg:flex">
        <div className="mb-8 flex items-center gap-2.5 px-2">
          <RetroMark className="h-8 w-8" />
          <div>
            <p className="font-display text-base leading-none text-bone">Retro Clothing</p>
            <p className="text-[10px] uppercase tracking-widest text-mist">Admin</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-colors ${
                  isActive ? "bg-bone text-ink" : "text-mist hover:bg-white/5 hover:text-bone"
                }`
              }
            >
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="mb-1 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-mist transition-colors hover:bg-white/5 hover:text-bone"
        >
          <ExternalLink size={16} strokeWidth={1.75} />
          View Website
        </a>
        <button
          onClick={() => {
            auth.signOut();
            navigate("/admin/login");
          }}
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[13px] font-medium text-mist transition-colors hover:bg-white/5 hover:text-bone"
        >
          <LogOut size={16} strokeWidth={1.75} />
          Sign Out
        </button>
      </aside>

      <div className="flex flex-1 flex-col lg:pl-64">
        <MobileAdminBar />
        <main className="flex-1 px-4 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function MobileAdminBar() {
  const navigate = useNavigate();
  return (
    <div className="glass-strong sticky top-0 z-30 flex items-center justify-between px-4 py-3 lg:hidden">
      <div className="flex items-center gap-2">
        <RetroMark className="h-7 w-7" />
        <span className="font-display text-sm text-bone">Admin</span>
      </div>
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
        {LINKS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `shrink-0 rounded-full px-3 py-1.5 text-[11px] ${isActive ? "bg-bone text-ink" : "text-mist"}`
            }
          >
            {label}
          </NavLink>
        ))}
        <button
          onClick={() => {
            auth.signOut();
            navigate("/admin/login");
          }}
          className="shrink-0 rounded-full px-3 py-1.5 text-[11px] text-mist"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
