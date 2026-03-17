import { type TimelineEvent } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const dotColor: Record<string, string> = {
  pending: "bg-status-pending",
  progress: "bg-status-progress",
  resolved: "bg-status-resolved",
};

const lineColor: Record<string, string> = {
  pending: "bg-status-pending/30",
  progress: "bg-status-progress/30",
  resolved: "bg-status-resolved/30",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ProgressTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="relative space-y-0">
      {events.map((event, i) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, type: "spring", damping: 25, stiffness: 200 }}
          className="relative flex gap-4 pb-6 last:pb-0"
        >
          {/* Line */}
          {i < events.length - 1 && (
            <div
              className={cn(
                "absolute left-[7px] top-5 h-full w-0.5",
                lineColor[event.status]
              )}
            />
          )}
          {/* Dot */}
          <div className={cn("relative z-10 mt-1.5 h-4 w-4 flex-shrink-0 rounded-full border-2 border-card", dotColor[event.status])} />
          {/* Content */}
          <div className="flex-1">
            <p className="text-sm font-medium text-card-foreground">{event.description}</p>
            <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">{formatDate(event.date)}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
