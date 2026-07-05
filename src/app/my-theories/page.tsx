"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { Tweet } from "@/components/ui/tweet";
import { useSession } from "@/hooks/useSession";
import { SessionModal } from "@/components/ui/SessionModal";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function MyTheoriesPage() {
  const { data: theories, error, mutate } = useSWR("/api/theories?sort=new", fetcher);
  const { isReady, username, hasUpvoted, toggleUpvote } = useSession();

  const [showSessionModal, setShowSessionModal] = useState(false);

  // Filter for my theories
  const myTheories = React.useMemo(() => {
    if (!theories || !Array.isArray(theories)) return [];
    if (!username) return []; // Should normally redirect, but just in case
    return theories.filter((t: any) => t.author === username);
  }, [theories, username]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/theories/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        mutate(); // Refresh the list
      }
    } catch (err) {
      console.error("Failed to delete theory", err);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-[#f5c66d]/30 selection:text-[#f5c66d]">
      <SessionModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
      />

      <div className="pt-24 pb-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <div className="w-[800px] h-[800px] bg-[#f5c66d] rounded-full blur-[120px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <p className="text-[#f5c66d] uppercase tracking-[0.3em] text-xs font-bold mb-4">
            The Fan Universe
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-foreground font-normal tracking-wide mb-6 drop-shadow-sm">
            MY THEORIES
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Manage your contributions to the universe.
          </p>
        </motion.div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-border/50 to-transparent mb-8" />

      {/* Feed */}
      <div className="container mx-auto px-4 py-8 max-w-6xl min-h-[100vh]">
        {!isReady || !theories ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-8 h-8 rounded-full border-2 border-[#f5c66d] border-t-transparent animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-400">
            Failed to load theories. Please try again.
          </div>
        ) : !username ? (
          <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-4">
            <p>You need to join the universe to see your theories.</p>
            <button
              onClick={() => setShowSessionModal(true)}
              className="bg-[#f5c66d] text-black px-6 py-2 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform"
            >
              Join Now
            </button>
          </div>
        ) : myTheories.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            You haven't posted any theories yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {myTheories.map((theory: any, idx: number) => (
                <motion.div
                  layout
                  key={theory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="h-full"
                >
                  <div className="h-full border border-border/30 rounded-xl overflow-hidden hover:border-[#f5c66d]/30 transition-colors shadow-sm hover:shadow-md bg-card/10 backdrop-blur-sm">
                    <Tweet
                      className="h-full border-none shadow-none bg-transparent"
                      tweetData={{
                        id_str: theory.id,
                        text: theory.excerpt,
                        title: theory.title,
                        excerpt: theory.excerpt,
                        content: theory.content,
                        user: {
                          name: theory.author,
                          screen_name: theory.author.toLowerCase(),
                          profile_image_url_https: "facehash",
                        },
                        created_at: theory.createdAt,
                        favorite_count: theory.upvotes,
                        conversation_count: theory.comments,
                        display_text_range: [0, theory.excerpt.length],
                        tag: theory.tag,
                        entities: { urls: [], hashtags: [], symbols: [], user_mentions: [] },
                        edit_control: { edit_tweet_ids: [theory.id], editable_until_msecs: "0", is_edit_eligible: false, edits_remaining: "0" },
                        isEdited: false,
                        isStaleEdit: false,
                      }}
                      initialUpvoted={hasUpvoted(theory.id)}
                      onUpvote={async (isUpvoted) => {
                        toggleUpvote(theory.id, isUpvoted);
                        await fetch(`/api/theories/${theory.id}/upvote`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ isUpvoted })
                        });
                        mutate();
                        return true;
                      }}
                      showDelete={true}
                      onDelete={() => handleDelete(theory.id)}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
