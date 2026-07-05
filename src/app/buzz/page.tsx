"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Lock, Ticket, Popcorn, Smartphone } from "lucide-react";
import { celebs, theories, Celeb } from "@/data/mock";
import { useState } from "react";

export default function BuzzPage() {
  const [showBookingOptions, setShowBookingOptions] = useState(false);
  const lockedTheories = theories.filter(t => t.locked).slice(0, 3);
  if (lockedTheories.length < 3) {
    lockedTheories.push(...theories.filter(t => !t.locked).slice(0, 3 - lockedTheories.length));
  }

  return (
    <div className="min-h-screen flex flex-col pt-28 md:pt-40 pb-12 px-4 container mx-auto space-y-24">
      <div className="flex flex-col space-y-8">
        <div className="text-center space-y-6">
          <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl md:text-6xl text-foreground uppercase tracking-widest"
        >
          You are missing out
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          The world is talking about the twist. Don't let it be spoiled for you.
        </motion.p>

      </div>

      {/* Trailer Embed */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="w-full max-w-4xl mx-auto rounded-[2rem] overflow-hidden border border-primary/20 shadow-[0_20px_60px_rgba(0,0,0,0.3)] bg-card/10 backdrop-blur-sm p-2"
      >
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/3qSIgQxpoqM?si=IhA4GTk-e-r7hnUV"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </motion.div>

      {/* Book Tickets */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 min-h-[56px]"
      >
        {!showBookingOptions ? (
          <Button 
            variant="regal" 
            size="lg" 
            className="w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2 shadow-glow"
            onClick={() => setShowBookingOptions(true)}
          >
            <Ticket className="w-5 h-5" />
            Book Tickets
          </Button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[180px] bg-red-600/10 hover:bg-red-600/20 text-red-500 border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.3)] flex items-center gap-2">
              <Popcorn className="w-4 h-4" />
              BookMyShow
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[180px] bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border-purple-500/50 shadow-[0_0_15px_rgba(147,51,234,0.3)] flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              District
            </Button>
          </motion.div>
        )}
      </motion.div>
      </div>

      <div className="space-y-10">
        <h2 className="font-serif text-3xl text-center text-primary">Viral Reactions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-primary/20 bg-card/10 backdrop-blur-sm group">
              <Image
                src={`/Event/letterboxd/letterboxd ${i + 1}.jpg`}
                alt={`Viral Reaction ${i + 1}`}
                width={500}
                height={800}
                className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-3xl text-primary">Trending Theories</h2>
          <p className="text-muted-foreground">Watch the film to unlock these secrets.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {lockedTheories.map((theory, idx) => (
            <Card key={idx} className="relative overflow-hidden group bg-card/20 border-border/30">
              <CardHeader className="blur-sm opacity-50 select-none">
                <CardTitle className="text-xl">{theory.title}</CardTitle>
                <CardDescription>By {theory.author}</CardDescription>
              </CardHeader>
              <CardContent className="blur-md opacity-30 select-none pb-6">
                <p className="text-sm">{theory.excerpt}</p>
                <p className="text-sm mt-2">{theory.body}</p>
              </CardContent>

              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/40 backdrop-blur-[2px] transition-all group-hover:bg-background/60">
                <div className="p-4 rounded-full bg-background/80 mb-4 shadow-lg">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <div className="font-serif text-lg text-foreground font-bold">Locked Theory</div>
                <div className="text-sm text-muted-foreground mt-1">Watch to unlock</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
