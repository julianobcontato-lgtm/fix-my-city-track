import { useState } from "react";
import { motion } from "framer-motion";
import { mockRequests, type RequestStatus } from "@/lib/mock-data";
import { RequestCard } from "@/components/RequestCard";
import { cn } from "@/lib/utils";

const filters: { label: string; value: RequestStatus | "all" }[] = [
  { label: "Todos", value: "all" },
  { label: "Pendentes", value: "pending" },
  { label: "Em andamento", value: "progress" },
  { label: "Resolvidos", value: "resolved" },
];

export default function RequestsPage() {
  const [filter, setFilter] = useState<RequestStatus | "all">("all");

  const filtered = filter === "all" ? mockRequests : mockRequests.filter((r) => r.status === filter);

  return (
    <div className="flex flex-col pb-20">
      <div className="px-5 pt-6">
        <h1 className="text-2xl font-bold text-foreground">Meus Pedidos</h1>
        <p className="mt-1 text-sm text-muted-foreground">{mockRequests.length} solicitações registradas</p>
      </div>

      {/* Filters */}
      <div className="mt-4 flex gap-2 overflow-x-auto px-5">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors active-press",
              filter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground shadow-card"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="mt-4 space-y-3 px-5">
        {filtered.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center text-sm text-muted-foreground"
          >
            Nenhuma solicitação encontrada.
          </motion.p>
        ) : (
          filtered.map((r, i) => <RequestCard key={r.id} request={r} index={i} />)
        )}
      </div>
    </div>
  );
}
