import { ReactNode } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Chatbot } from "@/components/Chatbot";
import { Bell, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-card/30 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted-foreground">Secure Session Active</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              {user?.cname?.charAt(0) || "U"}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-8 gradient-mesh overflow-auto">
          {children}
        </main>
      </div>
      <Chatbot />
    </div>
  );
};
