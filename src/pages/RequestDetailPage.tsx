import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Building2, Calendar } from "lucide-react";
import { mockRequests, categoryLabels, categoryIcons } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressTimeline } from "@/components/ProgressTimeline";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function resolvedHours(created: string, resolved: string) {
  const diff = new Date(resolved).getTime() - new Date(created).getTime();
  return Math.round(diff / 3600000);
}

export default function RequestDetailPage() {
  const { id } = useParams();
  const request = mockRequests.find((r) => r.id === id);

  if (!request) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Solicitação não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5">
        <Link to="/requests" className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-card active-press">
          <ArrowLeft className="h-5 w-5 text-foreground" strokeWidth={1.5} />
        </Link>
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground tabular-nums">{request.protocol}</p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="mt-5 px-5"
      >
        {/* Category & Title */}
        <div className="flex items-center gap-3">
          <span className="text-3xl">{categoryIcons[request.category]}</span>
          <h1 className="text-xl font-bold text-foreground">{categoryLabels[request.category]}</h1>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{request.description}</p>

        {/* Meta */}
        <div className="mt-5 space-y-2.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
            <span>{request.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
            <span>{request.department}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
            <span>{formatDate(request.createdAt)}</span>
          </div>
        </div>

        {/* Resolution time */}
        {request.resolvedAt && (
          <div className="mt-5 rounded-lg bg-status-resolved/10 p-4">
            <p className="text-sm font-semibold text-status-resolved">
              Resolvido em {resolvedHours(request.createdAt, request.resolvedAt)}h
            </p>
          </div>
        )}

        {/* Timeline */}
        <div className="mt-8">
          <h2 className="mb-4 text-base font-semibold text-foreground">Andamento</h2>
          <ProgressTimeline events={request.timeline} />
        </div>
      </motion.div>
    </div>
  );
}
