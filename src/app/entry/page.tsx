"use client";

import { motion } from "framer-motion";
import { ServiceCard } from "@/components/ui/service-card";

export default function EntryPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center pt-28 md:pt-32 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 space-y-4"
      >
        <h1 className="font-serif text-3xl md:text-5xl text-gradient-gold uppercase tracking-wider">
          Have you watched<br />Rao Bahadur?
        </h1>
        <p className="text-base md:text-xl text-muted-foreground max-w-xl mx-auto">
          Your answer decides what you see next. Choose truthfully — the peacocks are watching.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ServiceCard
            eyebrow="Enter the fan universe"
            title="Yes, I've watched"
            description="Theories. Hidden details. Discussions with the faithful."
            href="/fan"
            imgSrc="https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-2nDYzxsvMOLAC1EjdOOcEAM7VvkJcy.png&w=1000&q=75"
            imgAlt="Fan universe illustration"
            variant="gold"
            className="h-[240px] md:h-[300px]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ServiceCard
            eyebrow="Feel the fever"
            title="Not yet"
            description="Reactions, celebrity voices, and locked mysteries waiting for you."
            href="/buzz"
            imgSrc="https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-5IIrpmpMSSq6StmgnQJhWfikhmJAcp.png&w=1000&q=75"
            imgAlt="Hype illustration"
            variant="gray"
            className="h-[240px] md:h-[300px]"
          />
        </motion.div>
      </div>
    </div>
  );
}
