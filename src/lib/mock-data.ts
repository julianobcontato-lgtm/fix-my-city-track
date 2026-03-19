export type RequestStatus = "pending" | "progress" | "resolved";

export type RequestCategory = "buraco" | "iluminacao" | "lixo" | "calcada" | "sinalizacao" | "outros";

export type UrgencyLevel = "baixa" | "media" | "urgente" | "critica";

export const urgencyLabels: Record<UrgencyLevel, string> = {
  baixa: "Pouco urgente",
  media: "Moderado",
  urgente: "Urgente",
  critica: "Crítico",
};

export const urgencyColors: Record<UrgencyLevel, string> = {
  baixa: "text-status-resolved",
  media: "text-status-progress",
  urgente: "text-status-pending",
  critica: "text-destructive",
};

export interface ServiceRequest {
  id: string;
  protocol: string;
  category: RequestCategory;
  description: string;
  address: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  citizenPhoto?: string;
  resolutionPhoto?: string;
  department: string;
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  status: RequestStatus;
  description: string;
  date: string;
}

export const categoryLabels: Record<RequestCategory, string> = {
  buraco: "Buraco na via",
  iluminacao: "Iluminação pública",
  lixo: "Descarte irregular",
  calcada: "Calçada danificada",
  sinalizacao: "Sinalização",
  outros: "Outros",
};

export const categoryIcons: Record<RequestCategory, string> = {
  buraco: "🕳️",
  iluminacao: "💡",
  lixo: "🗑️",
  calcada: "🚧",
  sinalizacao: "🚦",
  outros: "📋",
};

export const statusLabels: Record<RequestStatus, string> = {
  pending: "Pendente",
  progress: "Em andamento",
  resolved: "Resolvido",
};

export const mockRequests: ServiceRequest[] = [
  {
    id: "1",
    protocol: "ZEL-2026-8472",
    category: "buraco",
    description: "Buraco de aproximadamente 40cm de diâmetro na pista, próximo ao meio-fio.",
    address: "Rua Augusta, 1200 - Consolação",
    status: "resolved",
    createdAt: "2026-03-10T14:30:00",
    updatedAt: "2026-03-12T09:15:00",
    resolvedAt: "2026-03-12T09:15:00",
    department: "Secretaria de Obras",
    timeline: [
      { id: "1a", status: "pending", description: "Solicitação registrada", date: "2026-03-10T14:30:00" },
      { id: "1b", status: "progress", description: "Equipe designada para vistoria", date: "2026-03-11T08:00:00" },
      { id: "1c", status: "progress", description: "Reparo em execução", date: "2026-03-11T14:00:00" },
      { id: "1d", status: "resolved", description: "Buraco reparado com asfalto a frio", date: "2026-03-12T09:15:00" },
    ],
  },
  {
    id: "2",
    protocol: "ZEL-2026-8523",
    category: "iluminacao",
    description: "Poste apagado há 3 dias. Rua escura à noite, risco de segurança.",
    address: "Av. Paulista, 900 - Bela Vista",
    status: "progress",
    createdAt: "2026-03-14T20:10:00",
    updatedAt: "2026-03-16T11:00:00",
    department: "Iluminação Pública",
    timeline: [
      { id: "2a", status: "pending", description: "Solicitação registrada", date: "2026-03-14T20:10:00" },
      { id: "2b", status: "progress", description: "Ordem de serviço emitida", date: "2026-03-15T09:00:00" },
      { id: "2c", status: "progress", description: "Equipe agendada para 17/03", date: "2026-03-16T11:00:00" },
    ],
  },
  {
    id: "3",
    protocol: "ZEL-2026-8601",
    category: "lixo",
    description: "Entulho e móveis velhos descartados na esquina.",
    address: "Rua Oscar Freire, 450 - Pinheiros",
    status: "pending",
    createdAt: "2026-03-17T07:45:00",
    updatedAt: "2026-03-17T07:45:00",
    department: "Limpeza Urbana",
    timeline: [
      { id: "3a", status: "pending", description: "Solicitação registrada", date: "2026-03-17T07:45:00" },
    ],
  },
  {
    id: "4",
    protocol: "ZEL-2026-8412",
    category: "calcada",
    description: "Calçada quebrada com raízes de árvore exposta, risco de tropeço.",
    address: "Rua Haddock Lobo, 800 - Cerqueira César",
    status: "resolved",
    createdAt: "2026-03-05T10:20:00",
    updatedAt: "2026-03-09T16:00:00",
    resolvedAt: "2026-03-09T16:00:00",
    department: "Secretaria de Obras",
    timeline: [
      { id: "4a", status: "pending", description: "Solicitação registrada", date: "2026-03-05T10:20:00" },
      { id: "4b", status: "progress", description: "Vistoria realizada", date: "2026-03-06T11:00:00" },
      { id: "4c", status: "resolved", description: "Calçada reconstruída", date: "2026-03-09T16:00:00" },
    ],
  },
];
