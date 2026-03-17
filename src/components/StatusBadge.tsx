import { type RequestStatus, statusLabels } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusStyles: Record<RequestStatus, string> = {
  pending: "bg-status-pending/15 text-status-pending",
  progress: "bg-status-progress/15 text-status-progress",
  resolved: "bg-status-resolved/15 text-status-resolved",
};

export function StatusBadge({ status, className }: { status: RequestStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
