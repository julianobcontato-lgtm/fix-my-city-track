import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Building2, Calendar, Loader2, Trash2, ShieldCheck } from "lucide-react";
import { categoryLabels, categoryIcons, type ServiceRequest, type RequestStatus } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressTimeline } from "@/components/ProgressTimeline";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { mapReportToRequest } from "@/lib/reports";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

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

const statusDbValues: Record<RequestStatus, string> = {
  pending: "pendente",
  progress: "em_andamento",
  resolved: "resolvido",
};

export default function RequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (authLoading || adminLoading) return;

    if (!user || !id) {
      setRequest(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadReport() {
      setLoading(true);
      let query = supabase.from("reports").select("*").eq("id", id!);
      if (!isAdmin) {
        query = query.eq("user_id", user!.id);
      }
      const { data, error } = await query.maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("Report detail load error:", error);
        setRequest(null);
      } else {
        setRequest(data ? mapReportToRequest(data) : null);
      }

      setLoading(false);
    }

    loadReport();

    return () => {
      cancelled = true;
    };
  }, [authLoading, adminLoading, id, user, isAdmin]);

  async function handleStatusChange(newStatus: RequestStatus) {
    if (!request) return;
    setUpdating(true);
    const { error } = await supabase
      .from("reports")
      .update({ status: statusDbValues[newStatus] })
      .eq("id", request.id);
    setUpdating(false);

    if (error) {
      console.error("Update status error:", error);
      toast.error("Erro ao atualizar status");
      return;
    }
    toast.success("Status atualizado");
    setRequest({ ...request, status: newStatus });
  }

  async function handleDelete() {
    if (!request) return;
    setDeleting(true);
    const { error } = await supabase.from("reports").delete().eq("id", request.id);
    setDeleting(false);

    if (error) {
      console.error("Delete error:", error);
      toast.error("Erro ao excluir solicitação");
      return;
    }
    toast.success("Solicitação excluída");
    navigate("/requests");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Carregando solicitação...</span>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Solicitação não encontrada.</p>
      </div>
    );
  }

  const canManage = !!request;

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

        {/* Admin / Owner actions */}
        {canManage && (
          <div className="mt-6 rounded-xl border border-border bg-card p-4 shadow-card">
            {isAdmin && (
              <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-primary">
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
                Painel do administrador
              </div>
            )}

            {isAdmin && (
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Alterar status
                </label>
                <Select
                  value={request.status}
                  onValueChange={(v) => handleStatusChange(v as RequestStatus)}
                  disabled={updating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="progress">Em andamento</SelectItem>
                    <SelectItem value="resolved">Resolvido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="w-full" disabled={deleting}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {deleting ? "Excluindo..." : "Excluir solicitação"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir solicitação?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. A solicitação {request.protocol} será removida permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
