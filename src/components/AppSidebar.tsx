import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ArrowRightLeft,
  Receipt,
  Users,
  ShieldAlert,
  LogOut,
  Landmark,
  Shield,
} from "lucide-react";

const navConfig = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Customer", "Manager", "Admin"] },
  { to: "/transfer", label: "Transfer", icon: ArrowRightLeft, roles: ["Customer", "Manager", "Admin"] },
  { to: "/transactions", label: "Transactions", icon: Receipt, roles: ["Customer", "Manager", "Admin"] },
  { to: "/manager", label: "Manager Panel", icon: Users, roles: ["Manager", "Admin"] },
  { to: "/admin", label: "Admin Panel", icon: ShieldAlert, roles: ["Admin"] },
];

export const AppSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = navConfig.filter(item => user?.role && item.roles.includes(user.role));

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Landmark className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-foreground text-sm">Kodbank</h1>
            <p className="text-[10px] text-muted-foreground">Secure Banking</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const active = location.pathname === item.to;
          return (
            <RouterNavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                />
              )}
            </RouterNavLink>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
            {user?.cname?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{user?.cname}</p>
            <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
          </div>
          <div className="flex items-center gap-1">
            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${user?.role === "Admin" ? "bg-destructive/15 text-destructive" : user?.role === "Manager" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}`}>
              {user?.role}
            </span>
            <Shield className="w-3 h-3 text-accent" />
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </motion.aside>
  );
};
