import { type RequestCategory, type RequestStatus, type ServiceRequest } from "@/lib/mock-data";
import { type Database } from "@/integrations/supabase/types";

type ReportRow = Database["public"]["Tables"]["reports"]["Row"];

const validCategories: RequestCategory[] = ["buraco", "iluminacao", "lixo", "calcada", "sinalizacao", "outros"];

export function normalizeReportStatus(status: string): RequestStatus {
  const normalized = status.toLowerCase().trim();

  if (["progress", "andamento", "em_andamento", "em andamento"].includes(normalized)) {
    return "progress";
  }

  if (["resolved", "resolvido", "concluido", "concluído"].includes(normalized)) {
    return "resolved";
  }

  return "pending";
}

export function mapReportToRequest(report: ReportRow): ServiceRequest {
  const status = normalizeReportStatus(report.status);
  const category = validCategories.includes(report.category as RequestCategory)
    ? (report.category as RequestCategory)
    : "outros";

  return {
    id: report.id,
    protocol: report.protocol,
    category,
    description: report.description,
    address: report.address,
    status,
    createdAt: report.created_at,
    updatedAt: report.updated_at,
    resolvedAt: status === "resolved" ? report.updated_at : undefined,
    department: "Zeladoria Municipal",
    timeline: [
      {
        id: `${report.id}-created`,
        status: "pending",
        description: "Solicitação registrada",
        date: report.created_at,
      },
      ...(status !== "pending"
        ? [
            {
              id: `${report.id}-current`,
              status,
              description: status === "resolved" ? "Solicitação resolvida" : "Solicitação em andamento",
              date: report.updated_at,
            },
          ]
        : []),
    ],
  };
}