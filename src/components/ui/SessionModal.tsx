"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Facehash } from "facehash";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/Button";

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (name: string) => void;
  message?: string;
}

export function SessionModal({ isOpen, onClose, onSuccess, message }: SessionModalProps) {
  const { login } = useSession();
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length >= 3) {
      login(name.trim());
      onSuccess?.(name.trim());
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-card/90 border border-border/50 shadow-2xl rounded-2xl p-6 overflow-hidden backdrop-blur-xl"
          >
            <div className="text-center mb-6">
              <h2 className="font-serif text-2xl text-primary mb-2">Identify Yourself</h2>
              <p className="text-sm text-muted-foreground">
                {message || "Enter a username to join the discussion."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full border border-border/50 bg-background shadow-inner overflow-hidden flex items-center justify-center">
                  {name.trim() ? (
                    <Facehash name={name} size={96} enableBlink={true} />
                  ) : (
                    <div className="text-muted-foreground opacity-50">?</div>
                  )}
                </div>
                <div className="w-full">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter username (min 3 chars)"
                    className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 text-center text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary/20 text-primary hover:bg-primary/30"
                  disabled={name.trim().length < 3}
                >
                  Join
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
