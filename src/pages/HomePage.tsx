import { motion } from "framer-motion";
import { MapPin, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { mockRequests } from "@/lib/mock-data";
import { RequestCard } from "@/components/RequestCard";
import { FAB } from "@/components/FAB";

export default function HomePage() {
  const pending = mockRequests.filter((r) => r.status === "pending").length;
  const progress = mockRequests.filter((r) => r.status === "progress").length;
  const resolved = mockRequests.filter((r) => r.status === "resolved").length;

  return (
    <div className="flex flex-col pb-20">
      {/* Map placeholder */}
      <div className="relative h-64 overflow-hidden bg-secondary">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <MapPin className="h-10 w-10 text-muted-foreground/40" strokeWidth={1.5} />
          <p className="text-sm text-muted-foreground/60">Mapa de ocorrências</p>
        </div>
        {/* Overlay gradient */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Header */}
      <div className="px-5 pt-4">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-foreground"
        >
          Sua rua, sob sua gestão.
        </motion.h1>
        <p className="mt-1 text-sm text-muted-foreground">Registre, acompanhe e cobre soluções.</p>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-4 flex gap-3 px-5"
      >
        <div className="flex flex-1 items-center gap-2.5 rounded-lg bg-card p-3 shadow-card">
          <AlertTriangle className="h-5 w-5 text-status-pending" strokeWidth={1.5} />
          <div>
            <p className="text-lg font-bold tabular-nums text-foreground">{pending}</p>
            <p className="text-[11px] text-muted-foreground">Pendente</p>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-2.5 rounded-lg bg-card p-3 shadow-card">
          <Clock className="h-5 w-5 text-status-progress" strokeWidth={1.5} />
          <div>
            <p className="text-lg font-bold tabular-nums text-foreground">{progress}</p>
            <p className="text-[11px] text-muted-foreground">Em andamento</p>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-2.5 rounded-lg bg-card p-3 shadow-card">
          <CheckCircle2 className="h-5 w-5 text-status-resolved" strokeWidth={1.5} />
          <div>
            <p className="text-lg font-bold tabular-nums text-foreground">{resolved}</p>
            <p className="text-[11px] text-muted-foreground">Resolvido</p>
          </div>
        </div>
      </motion.div>

      {/* Recent requests */}
      <div className="mt-6 px-5">
        <h2 className="text-base font-semibold text-foreground">Solicitações recentes</h2>
        <div className="mt-3 space-y-3">
          {mockRequests.map((r, i) => (
            <RequestCard key={r.id} request={r} index={i} />
          ))}
        </div>
      </div>

      <FAB />
    </div>
  );
}
