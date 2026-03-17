import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { type ServiceRequest, categoryLabels, categoryIcons } from "@/lib/mock-data";
import { StatusBadge } from "./StatusBadge";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Agora";
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  return `${days}d atrás`;
}

export function RequestCard({ request, index = 0 }: { request: ServiceRequest; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200, delay: index * 0.05 }}
    >
      <Link
        to={`/requests/${request.id}`}
        className="block rounded-lg bg-card p-5 shadow-card active-press transition-shadow hover:shadow-elevated"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{categoryIcons[request.category]}</span>
            <div>
              <p className="font-semibold text-card-foreground">{categoryLabels[request.category]}</p>
              <p className="mt-0.5 text-sm text-muted-foreground tabular-nums">{request.protocol}</p>
            </div>
          </div>
          <StatusBadge status={request.status} />
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{request.description}</p>

        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
            {request.address.split(" - ")[0]}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
            {timeAgo(request.updatedAt)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
