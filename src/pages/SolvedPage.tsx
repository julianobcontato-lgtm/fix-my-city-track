import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Send, Clock } from "lucide-react";
import { mockRequests, categoryLabels, categoryIcons } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { toast } from "sonner";

import beforeBuraco from "@/assets/before-buraco.jpg";
import afterBuraco from "@/assets/after-buraco.jpg";
import beforeCalcada from "@/assets/before-calcada.jpg";
import afterCalcada from "@/assets/after-calcada.jpg";

const mockPhotos: Record<string, { before: string; after: string }> = {
  "1": { before: beforeBuraco, after: afterBuraco },
  "4": { before: beforeCalcada, after: afterCalcada },
};

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

const initialComments: Record<string, Comment[]> = {
  "1": [
    { id: "c1", author: "Maria S.", text: "Finalmente arrumaram! Muito bom.", date: "2026-03-12T10:00:00" },
    { id: "c2", author: "João P.", text: "Estava horrível antes, agora ficou ótimo.", date: "2026-03-12T14:30:00" },
  ],
  "4": [
    { id: "c3", author: "Ana L.", text: "Calçada ficou excelente, obrigada prefeitura!", date: "2026-03-10T09:00:00" },
  ],
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Agora";
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default function SolvedPage() {
  const resolved = mockRequests.filter((r) => r.status === "resolved");
  const [likes, setLikes] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    resolved.forEach((r) => (init[r.id] = Math.floor(Math.random() * 20) + 3));
    return init;
  });
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, Comment[]>>(initialComments);
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");

  const handleLike = (id: string) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
    setLikes((prev) => ({
      ...prev,
      [id]: prev[id] + (liked[id] ? -1 : 1),
    }));
  };

  const handleShare = (req: (typeof resolved)[0]) => {
    const text = `✅ Problema resolvido! ${categoryLabels[req.category]} em ${req.address} — Protocolo ${req.protocol}`;
    if (navigator.share) {
      navigator.share({ title: "Zeladoria — Problema Resolvido", text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Link copiado para compartilhar!");
    }
  };

  const handleAddComment = (requestId: string) => {
    const trimmed = newComment.trim();
    if (!trimmed) return;
    if (trimmed.length > 300) {
      toast.error("Comentário deve ter no máximo 300 caracteres.");
      return;
    }
    const comment: Comment = {
      id: `c-${Date.now()}`,
      author: "Você",
      text: trimmed,
      date: new Date().toISOString(),
    };
    setComments((prev) => ({
      ...prev,
      [requestId]: [...(prev[requestId] || []), comment],
    }));
    setNewComment("");
    toast.success("Comentário adicionado!");
  };

  return (
    <div className="flex flex-col pb-20">
      <div className="px-5 pt-6">
        <h1 className="text-2xl font-bold text-foreground">Solucionados</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {resolved.length} problemas resolvidos pela prefeitura
        </p>
      </div>

      <div className="mt-4 space-y-4 px-5">
        {resolved.map((req, i) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200, delay: i * 0.05 }}
            className="overflow-hidden rounded-lg bg-card shadow-card"
          >
            {/* Before/After photos */}
            {mockPhotos[req.id] && (
              <BeforeAfterSlider
                beforeSrc={mockPhotos[req.id].before}
                afterSrc={mockPhotos[req.id].after}
              />
            )}

            {/* Card header */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{categoryIcons[req.category]}</span>
                  <div>
                    <p className="font-semibold text-card-foreground">
                      {categoryLabels[req.category]}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{req.address}</p>
                  </div>
                </div>
                <span className="flex-shrink-0 rounded-full bg-status-resolved/15 px-2.5 py-1 text-[11px] font-semibold text-status-resolved">
                  ✅ Resolvido
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{req.description}</p>
              {req.resolvedAt && (
                <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" strokeWidth={1.5} />
                  Resolvido em {new Date(req.resolvedAt).toLocaleDateString("pt-BR")}
                </p>
              )}
            </div>

            {/* Action bar */}
            <div className="flex items-center border-t border-border">
              <button
                onClick={() => handleLike(req.id)}
                className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors active-press"
              >
                <Heart
                  className={`h-4.5 w-4.5 transition-colors ${
                    liked[req.id] ? "fill-destructive text-destructive" : "text-muted-foreground"
                  }`}
                  strokeWidth={1.5}
                />
                <span className={liked[req.id] ? "text-destructive" : "text-muted-foreground"}>
                  {likes[req.id]}
                </span>
              </button>
              <div className="h-5 w-px bg-border" />
              <button
                onClick={() => setOpenComments(openComments === req.id ? null : req.id)}
                className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-muted-foreground transition-colors active-press"
              >
                <MessageCircle className="h-4.5 w-4.5" strokeWidth={1.5} />
                <span>{(comments[req.id] || []).length}</span>
              </button>
              <div className="h-5 w-px bg-border" />
              <button
                onClick={() => handleShare(req)}
                className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-muted-foreground transition-colors active-press"
              >
                <Share2 className="h-4.5 w-4.5" strokeWidth={1.5} />
                <span>Compartilhar</span>
              </button>
            </div>

            {/* Comments section */}
            <AnimatePresence>
              {openComments === req.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t border-border"
                >
                  <div className="p-4">
                    {(comments[req.id] || []).length === 0 && (
                      <p className="text-center text-xs text-muted-foreground py-2">
                        Nenhum comentário ainda. Seja o primeiro!
                      </p>
                    )}
                    <div className="space-y-3">
                      {(comments[req.id] || []).map((c) => (
                        <div key={c.id} className="flex gap-2">
                          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                            {c.author[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-card-foreground">
                                {c.author}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {timeAgo(c.date)}
                              </span>
                            </div>
                            <p className="mt-0.5 text-sm text-muted-foreground">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Input
                        placeholder="Escreva um comentário..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        maxLength={300}
                        className="text-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddComment(req.id);
                        }}
                      />
                      <Button
                        size="icon"
                        onClick={() => handleAddComment(req.id)}
                        disabled={!newComment.trim()}
                        className="flex-shrink-0"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
