import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function FAB() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.3 }}
      className="fixed bottom-20 right-4 z-50"
    >
      <Link
        to="/report"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-elevated active-press"
      >
        <Plus className="h-6 w-6 text-primary-foreground" strokeWidth={2} />
      </Link>
    </motion.div>
  );
}
