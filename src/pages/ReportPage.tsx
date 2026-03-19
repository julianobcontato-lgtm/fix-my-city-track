import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, MapPin, CheckCircle2, Locate, Loader2 } from "lucide-react";
import { type RequestCategory, type UrgencyLevel, categoryLabels, categoryIcons, urgencyLabels, urgencyColors } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const categories: RequestCategory[] = ["buraco", "iluminacao", "lixo", "calcada", "sinalizacao", "outros"];
const urgencyLevels: UrgencyLevel[] = ["baixa", "media", "urgente", "critica"];

export default function ReportPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "success">("form");
  const [category, setCategory] = useState<RequestCategory | null>(null);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [urgency, setUrgency] = useState<UrgencyLevel | null>(null);
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

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocalização não suportada neste dispositivo.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
          );
          const data = await res.json();
          if (data.display_name) {
            setAddress(data.display_name.split(",").slice(0, 3).join(",").trim());
          }
        } catch {
          toast.info("Localização capturada, mas não foi possível obter o endereço.");
        }
        setLocating(false);
        toast.success("Localização capturada!");
      },
      (error) => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Permissão de localização negada.");
        } else {
          toast.error("Não foi possível obter a localização.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
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
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={locating}
                className="mt-2 flex items-center gap-1.5 text-sm font-medium text-primary active-press disabled:opacity-50"
              >
                {locating ? (
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                ) : (
                  <Locate className="h-4 w-4" strokeWidth={1.5} />
                )}
                {locating ? "Obtendo localização..." : "Usar minha localização"}
              </button>
              {coords && (
                <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                  📍 {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                </p>
              )}
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
