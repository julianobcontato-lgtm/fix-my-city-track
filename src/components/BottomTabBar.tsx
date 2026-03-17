import { Map, ClipboardList, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", icon: Map, label: "Mapa" },
  { to: "/requests", icon: ClipboardList, label: "Meus Pedidos" },
  { to: "/profile", icon: User, label: "Perfil" },
];

export function BottomTabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card shadow-elevated">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )
            }
          >
            <tab.icon className="h-5 w-5" strokeWidth={1.5} />
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
