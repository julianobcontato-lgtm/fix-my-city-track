import { motion } from "framer-motion";
import { User, Bell, HelpCircle, LogOut } from "lucide-react";

const menuItems = [
  { icon: Bell, label: "Notificações" },
  { icon: HelpCircle, label: "Ajuda e Suporte" },
  { icon: LogOut, label: "Sair" },
];

export default function ProfilePage() {
  return (
    <div className="flex flex-col pb-20">
      <div className="px-5 pt-6">
        <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="mt-6 px-5"
      >
        {/* Avatar */}
        <div className="flex items-center gap-4 rounded-lg bg-card p-5 shadow-card">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <User className="h-7 w-7 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-semibold text-foreground">Cidadão</p>
            <p className="text-sm text-muted-foreground">cidadao@email.com</p>
          </div>
        </div>

        {/* Menu */}
        <div className="mt-4 overflow-hidden rounded-lg bg-card shadow-card">
          {menuItems.map((item, i) => (
            <button
              key={item.label}
              className="flex w-full items-center gap-3 border-b border-border px-5 py-4 text-sm font-medium text-foreground transition-colors last:border-0 hover:bg-muted/50 active-press"
            >
              <item.icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
              {item.label}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
