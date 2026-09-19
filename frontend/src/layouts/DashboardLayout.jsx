import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  Search,
  WalletCards,
  Banknote,
  Rocket,
  Layers3,
  BarChart3,
  FileText,
  Sparkles,
  Settings,
  Bell,
  Command,
} from "lucide-react";

const navigation = [
  {
    section: "OVERVIEW",
    items: [
      { name: "Dashboard", path: "/", icon: LayoutDashboard },
      { name: "Markets", path: "/markets", icon: TrendingUp },
      { name: "Stocks", path: "/stocks", icon: Search },
    ],
  },
  {
    section: "INVESTING",
    items: [
      { name: "Portfolio", path: "/portfolio", icon: WalletCards },
      { name: "Dividends", path: "/dividends", icon: Banknote },
      { name: "IPOs", path: "/ipos", icon: Rocket },
      {
        name: "Corporate Actions",
        path: "/corporate-actions",
        icon: Layers3,
      },
    ],
  },
  {
    section: "INTELLIGENCE",
    items: [
      { name: "Analytics", path: "/analytics", icon: BarChart3 },
      { name: "Documents", path: "/documents", icon: FileText },
      { name: "AI Vault", path: "/ai-vault", icon: Sparkles },
    ],
  },
];

function DashboardLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        {/* BRAND */}
        <div className="brand">
          <div className="brand-mark">E</div>

          <div className="brand-text">
            <h2>EquityVault</h2>
            <span>Market Intelligence</span>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="sidebar-nav">
          {navigation.map((group) => (
            <div className="nav-group" key={group.section}>
              <div className="nav-section-title">{group.section}</div>

              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    <Icon size={17} strokeWidth={1.8} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* BOTTOM */}
        <div className="sidebar-bottom">
          <NavLink to="/settings" className="nav-link">
            <Settings size={17} strokeWidth={1.8} />
            <span>Settings</span>
          </NavLink>

          <div className="user-card">
            <div className="user-avatar">A</div>

            <div className="user-info">
              <strong>Anurag</strong>
              <span>Investor</span>
            </div>

            <div className="user-status"></div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main-wrapper">
        <header className="topbar">
          <div className="global-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search stocks, companies, IPOs..."
            />

            <div className="search-shortcut">
              <Command size={11} />
              <span>K</span>
            </div>
          </div>

          <div className="topbar-actions">
            <button className="topbar-button">
              <Bell size={17} />
              <span className="notification-dot"></span>
            </button>

            <div className="topbar-user">
              <div className="topbar-avatar">A</div>
            </div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;