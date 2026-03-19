import { motion } from "framer-motion";
import { Bell, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const menuItems = [
  { icon: Bell, label: "Notificações" },
  { icon: HelpCircle, label: "Ajuda e Suporte" },
];

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ display_name: string | null; avatar_url: string | null } | null>(null);

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => setProfile(data));
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Você saiu da conta.");
    navigate("/");
  };

  const displayName = profile?.display_name || user?.user_metadata?.full_name || "Cidadão";
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const email = user?.email || "";
  const initials = displayName.slice(0, 2).toUpperCase();

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
          <Avatar className="h-14 w-14">
            <AvatarImage src={avatarUrl || undefined} alt={displayName} />
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-foreground">{displayName}</p>
            <p className="truncate text-sm text-muted-foreground">{email}</p>
          </div>
        </div>

        {/* Menu */}
        <div className="mt-4 overflow-hidden rounded-lg bg-card shadow-card">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className="flex w-full items-center gap-3 border-b border-border px-5 py-4 text-sm font-medium text-foreground transition-colors last:border-0 hover:bg-muted/50 active-press"
            >
              <item.icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 px-5 py-4 text-sm font-medium text-destructive transition-colors hover:bg-muted/50 active-press"
          >
            <LogOut className="h-5 w-5" strokeWidth={1.5} />
            <span className="flex-1 text-left">Sair</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
