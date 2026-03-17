import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, MapPin, CheckCircle2, Locate, Loader2 } from "lucide-react";
import { type RequestCategory, categoryLabels, categoryIcons } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const categories: RequestCategory[] = ["buraco", "iluminacao", "lixo", "calcada", "sinalizacao", "outros"];

export default function ReportPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "success">("form");
  const [category, setCategory] = useState<RequestCategory | null>(null);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [protocol, setProtocol] = useState("");

  const handleSubmit = () => {
    if (!category) {
      toast.error("Selecione uma categoria.");
      return;
    }
    if (!description.trim()) {
      toast.error("Descreva o problema.");
      return;
    }
    if (!address.trim()) {
      toast.error("Informe o endereço.");
      return;
    }
    const newProtocol = `ZEL-2026-${Math.floor(Math.random() * 9000) + 1000}`;
    setProtocol(newProtocol);
    setStep("success");
  };

  return (
    <div className="flex min-h-screen flex-col pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5">
        <Link
          to="/"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-card active-press"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" strokeWidth={1.5} />
        </Link>
        <h1 className="text-lg font-bold text-foreground">Reportar Problema</h1>
      </div>

      <AnimatePresence mode="wait">
        {step === "form" ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="mt-5 flex-1 px-5"
          >
            {/* Photo upload placeholder */}
            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg border-2 border-dashed border-border bg-card">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Camera className="h-10 w-10" strokeWidth={1.5} />
                <p className="text-sm font-medium">Tirar foto do problema</p>
                <p className="text-xs">Formato 4:3 para padronização</p>
              </div>
            </div>

            {/* Category */}
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-foreground">Categoria</p>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-colors active-press ${
                      category === cat
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card"
                    }`}
                  >
                    <span className="text-xl">{categoryIcons[cat]}</span>
                    <span className="text-[11px] font-medium leading-tight text-card-foreground">
                      {categoryLabels[cat]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-foreground">Endereço</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                <Input
                  placeholder="Rua, número - Bairro"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-9"
                  maxLength={200}
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-foreground">Descrição</label>
              <Textarea
                placeholder="Descreva o problema com detalhes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <p className="mt-1 text-right text-xs text-muted-foreground tabular-nums">
                {description.length}/500
              </p>
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              className="mt-6 w-full active-press"
              size="lg"
            >
              Enviar Solicitação
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="flex flex-1 flex-col items-center justify-center px-5"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-status-resolved/15">
              <CheckCircle2 className="h-10 w-10 text-status-resolved" strokeWidth={1.5} />
            </div>
            <h2 className="mt-6 text-xl font-bold text-foreground">Solicitação registrada</h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Seu protocolo é
            </p>
            <p className="mt-1 text-lg font-bold tabular-nums text-primary">{protocol}</p>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Você receberá atualizações sobre o andamento da sua solicitação.
            </p>
            <Button
              onClick={() => navigate("/requests")}
              className="mt-8 w-full active-press"
              size="lg"
            >
              Ver Meus Pedidos
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
