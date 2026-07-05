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
  const { isReady, username, hasUpvoted, toggleUpvote, hasSaved, toggleSave } = useSession();

  const [filter, setFilter] = useState("My Theories");
  const [isScrolled, setIsScrolled] = useState(false);
  const [initialTabSet, setInitialTabSet] = useState(false);
  const [theoryToDelete, setTheoryToDelete] = useState<string | null>(null);

  React.useEffect(() => {
    if (!theories || !Array.isArray(theories) || !username || initialTabSet) return;
    const myTheoriesCount = theories.filter((t: any) => t.author === username).length;
    const savedCount = theories.filter((t: any) => hasSaved(t.id)).length;
    if (myTheoriesCount === 0 && savedCount > 0) {
      setFilter("Saved");
    }
    setInitialTabSet(true);
  }, [theories, username, hasSaved, initialTabSet]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [showSessionModal, setShowSessionModal] = useState(false);

  // Filter theories based on selected tab
  const displayedTheories = React.useMemo(() => {
    if (!theories || !Array.isArray(theories)) return [];
    if (!username) return []; // Should normally redirect, but just in case
    
    if (filter === "My Theories") {
      return theories.filter((t: any) => t.author === username);
    } else if (filter === "Saved") {
      return theories.filter((t: any) => hasSaved(t.id));
    }
    return [];
  }, [theories, username, filter, hasSaved]);

  const confirmDelete = async () => {
    if (!theoryToDelete) return;
    try {
      const res = await fetch(`/api/theories/${theoryToDelete}`, {
        method: "DELETE"
      });
      if (res.ok) {
        mutate(); // Refresh the list
      }
    } catch (err) {
      console.error("Failed to delete theory", err);
    }
    setTheoryToDelete(null);
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

      {/* Sticky Tabs */}
      <div
        className={`sticky top-0 z-50 pt-4 pb-0 mb-8 transition-all duration-300 ${isScrolled
          ? "bg-background/30 backdrop-blur-2xl border-b border-border/10 shadow-sm"
          : "bg-transparent border-transparent"
          }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto border-b border-border/30 w-full justify-between sm:justify-start [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {["My Theories", "Saved"].map((f) => {
              const isActive = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`
                    relative px-4 py-4 text-sm font-medium tracking-wide uppercase whitespace-nowrap transition-colors flex items-center justify-center sm:justify-start flex-1 sm:flex-none
                    ${isActive ? "text-[#f5c66d]" : "text-muted-foreground hover:text-foreground/80"}
                  `}
                >
                  {f}
                  {isActive && (
                    <motion.div
                      layoutId="myTheoriesTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f5c66d]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

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
        ) : displayedTheories.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {filter === "My Theories" 
              ? "You haven't posted any theories yet." 
              : "You haven't saved any theories yet."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {displayedTheories.map((theory: any, idx: number) => (
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
                        text: theory.content,
                        url: `http://localhost:3000/theory/${theory.id}`,
                        title: theory.title,
                        likes: theory.upvotes,
                        user: {
                          name: theory.author,
                          screen_name: theory.author.toLowerCase(),
                          profile_image_url_https: "facehash",
                        },
                        created_at: theory.createdAt,
                        favorite_count: theory.upvotes,
                        conversation_count: theory.comments,
                        display_text_range: [0, theory.content.length],
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
                      isSaved={hasSaved(theory.id)}
                      onSave={(isSaved) => toggleSave(theory.id, isSaved)}
                      showDelete={filter === "My Theories"}
                      onDelete={() => setTheoryToDelete(theory.id)}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {theoryToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-card border border-border/50 rounded-2xl p-6 shadow-2xl"
            >
              <h2 className="text-xl font-serif text-foreground mb-3">Delete Theory?</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Are you sure you want to delete this theory? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setTheoryToDelete(null)}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/10 rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
