import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { mockRequests, type RequestStatus } from "@/lib/mock-data";
import { RequestCard } from "@/components/RequestCard";
import { cn } from "@/lib/utils";

const statusFilters: { label: string; value: RequestStatus | "all" }[] = [
  { label: "Todos", value: "all" },
  { label: "Pendentes", value: "pending" },
  { label: "Em andamento", value: "progress" },
  { label: "Resolvidos", value: "resolved" },
];

function extractBairro(address: string): string {
  const parts = address.split(" - ");
  return parts.length > 1 ? parts[parts.length - 1].trim() : address.trim();
}

export default function RequestsPage() {
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  const [bairroFilter, setBairroFilter] = useState<string>("all");

  const bairros = useMemo(() => {
    const set = new Set(mockRequests.map((r) => extractBairro(r.address)));
    return Array.from(set).sort();
  }, []);

  const bairroStats = useMemo(() => {
    const map: Record<string, number> = {};
    mockRequests.forEach((r) => {
      const b = extractBairro(r.address);
      map[b] = (map[b] || 0) + 1;
    });
    return map;
  }, []);

  const filtered = mockRequests.filter((r) => {
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchBairro = bairroFilter === "all" || extractBairro(r.address) === bairroFilter;
    return matchStatus && matchBairro;
  });

  return (
    <div className="flex flex-col pb-20">
      <div className="px-5 pt-6">
        <h1 className="text-2xl font-bold text-foreground">Meus Pedidos</h1>
        <p className="mt-1 text-sm text-muted-foreground">{mockRequests.length} solicitações registradas</p>
      </div>

      {/* Status Filters */}
      <div className="mt-4 flex gap-2 overflow-x-auto px-5">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={cn(
              "flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors active-press",
              statusFilter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground shadow-card"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Bairro Filter */}
      <div className="mt-3 flex gap-2 overflow-x-auto px-5">
        <button
          onClick={() => setBairroFilter("all")}
          className={cn(
            "flex flex-shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors active-press",
            bairroFilter === "all"
              ? "bg-accent text-accent-foreground"
              : "bg-card text-muted-foreground shadow-card"
          )}
        >
          <MapPin className="h-3 w-3" strokeWidth={1.5} />
          Todos os bairros
        </button>
        {bairros.map((b) => (
          <button
            key={b}
            onClick={() => setBairroFilter(b)}
            className={cn(
              "flex flex-shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors active-press",
              bairroFilter === b
                ? "bg-accent text-accent-foreground"
                : "bg-card text-muted-foreground shadow-card"
            )}
          >
            {b}
            <span className="ml-0.5 rounded-full bg-muted px-1.5 text-[10px] tabular-nums text-muted-foreground">
              {bairroStats[b]}
            </span>
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
