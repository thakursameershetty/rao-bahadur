"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import useSWR from "swr";
import { Tweet } from "@/components/ui/tweet";
import { SessionModal } from "@/components/ui/SessionModal";
import { useSession } from "@/hooks/useSession";
import { useEffect } from "react";
import { Facehash } from "facehash";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const getTabIcon = (filterName: string) => {
  switch (filterName) {
    case "Trending":
      return (
        <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true" data-slot="icon" viewBox="0 0 16 16"><path fillRule="evenodd" d="M9.808 4.057a.75.75 0 0 1 .92-.527l3.116.849a.75.75 0 0 1 .528.915l-.823 3.121a.75.75 0 0 1-1.45-.382l.337-1.281a23.5 23.5 0 0 0-3.609 3.056.75.75 0 0 1-1.07.01L6 8.06l-3.72 3.72a.75.75 0 1 1-1.06-1.061l4.25-4.25a.75.75 0 0 1 1.06 0l1.756 1.755a25 25 0 0 1 3.508-2.85l-1.46-.398a.75.75 0 0 1-.526-.92Z" clipRule="evenodd" /></svg>
      );
    default:
      return null;
  }
};

export default function FanPage() {
  const { data: theories, error, mutate } = useSWR("/api/theories?sort=trending", fetcher);
  const { isReady, username, hasUpvoted, toggleUpvote } = useSession();

  const [filter, setFilter] = useState("All");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDeepScrolled, setIsDeepScrolled] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      setIsDeepScrolled(window.scrollY > 1500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filters = ["Trending", "New", "Hidden Detail"];

  const filteredTheories = theories ? theories.filter((t: any) => {
    if (filter === "All") return true;
    return t.tag === filter;
  }) : [];

  return (
    <div className="min-h-screen pb-24">
      <SessionModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        message="Enter your username to interact with theories!"
      />
      {/* Header */}
      <div className="pt-20 pb-10 relative">
        {/* Profile Button Top Right */}
        {username && (
          <div className={`fixed top-8 right-8 z-50 transition-all duration-300 ${isScrolled ? "opacity-0 -translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"}`}>
            <Link href="/my-theories" passHref>
              <button
                title="My Theories"
                className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-card/70 backdrop-blur-md text-foreground rounded-full border border-border/50 shadow-lg hover:scale-105 hover:border-[#f5c66d]/50 transition-all duration-300 overflow-hidden"
              >
                <Facehash name={username} size={56} enableBlink={true} />
              </button>
            </Link>
          </div>
        )}

        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <span className="text-accent text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">The Fan Universe</span>
            <h1 className="font-serif text-5xl md:text-7xl text-gradient-gold uppercase tracking-wider">
              Long Live the King
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto pt-2">
              Read what the faithful found. Upvote your favorites. Reply. Then post your own.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Tabs */}
      <div
        className={`sticky top-0 z-50 pt-4 pb-0 mb-4 transition-all duration-300 ${isScrolled
          ? "bg-background/30 backdrop-blur-2xl border-b border-border/10 shadow-sm"
          : "bg-transparent border-transparent"
          }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto border-b border-border/30 w-full justify-between sm:justify-start [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {["All", ...filters].map((f) => {
              const isActive = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`relative flex-1 sm:flex-none px-4 sm:px-6 py-4 text-sm sm:text-base whitespace-nowrap transition-colors ${isActive ? "text-[#f5c66d] font-bold" : "text-muted-foreground font-medium hover:text-[#f5c66d]/80"
                    }`}
                >
                  <div className="flex items-center justify-center">
                    {getTabIcon(f)}
                    {f}
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 right-0 mx-auto h-[4px] bg-[#f5c66d] rounded-t-full shadow-[0_-2px_10px_rgba(245,198,109,0.5)]"
                      style={{ width: "calc(100% - 2rem)" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll to Top Pill */}
      <div
        className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${isDeepScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 pointer-events-none"
          }`}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 bg-gradient-to-r from-[#f5c66d] to-[#e6b150] text-black px-6 py-2 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-widest shadow-[0_4px_20px_rgba(245,198,109,0.3)] hover:shadow-[0_4px_25px_rgba(245,198,109,0.5)] hover:scale-105 transition-all duration-300 backdrop-blur-md border border-[#f5c66d]/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          Top
        </button>
      </div>

      {/* Feed */}
      <div className="container mx-auto px-4 py-8 max-w-6xl min-h-[100vh]">
        {!theories ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full h-48 bg-card/10 backdrop-blur-sm rounded-xl animate-pulse border border-border/10" />
            ))}
          </div>
        ) : filteredTheories.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No theories found for this filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTheories.map((theory: any, idx: number) => (
              <motion.div
                key={theory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative"
              >
                <Link href={`/theory/${theory.id}`} className="absolute inset-0 z-0" aria-label="View theory"></Link>
                <div className="relative z-10 pointer-events-none h-full">
                  <Tweet
                    tweetData={{
                      id_str: theory.id,
                      text: theory.excerpt,
                      title: theory.title,
                      excerpt: theory.excerpt,
                      created_at: theory.createdAt,
                      favorite_count: theory.upvotes,
                      conversation_count: theory.comments,
                      lang: "en",
                      display_text_range: [0, theory.excerpt.length],
                      tag: theory.tag,
                      entities: { urls: [], hashtags: [], symbols: [], user_mentions: [] },
                      edit_control: { edit_tweet_ids: [theory.id], editable_until_msecs: "0", is_edit_eligible: false, edits_remaining: "0" },
                      isEdited: false,
                      isStaleEdit: false,
                      user: {
                        id_str: theory.author,
                        name: theory.author,
                        profile_image_url_https: "",
                        screen_name: theory.author.toLowerCase().replace(/\s+/g, ""),
                        verified: false,
                        is_blue_verified: false,
                        profile_image_shape: "Circle",
                      },
                    }}
                    initialUpvoted={hasUpvoted(theory.id)}
                    onUpvote={async (isUpvoted) => {
                      if (!username) {
                        setShowSessionModal(true);
                        return false; // Tells the Tweet not to apply the upvote
                      }
                      toggleUpvote(theory.id, isUpvoted);
                      await fetch(`/api/theories/${theory.id}/upvote`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ isUpvoted })
                      });
                      mutate();
                      return true;
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Floating CTA */}
      <div className="fixed bottom-8 right-8 z-50 flex justify-end gap-4">
        <Link href="/post" passHref>
          <button
            className={`flex items-center justify-center bg-[#f5c66d] text-black rounded-full font-bold text-[11px] uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(245,198,109,0.3)] hover:scale-105 transition-all duration-500 overflow-hidden ${isScrolled ? "w-14 h-14 gap-0" : "px-8 py-4 gap-3 w-auto"
              }`}
          >
            <span className="text-lg leading-none mt-[-2px] shrink-0">✦</span>
            <span
              className={`whitespace-nowrap transition-all duration-500 ${isScrolled ? "opacity-0 max-w-0 scale-95" : "opacity-100 max-w-[200px] scale-100"
                }`}
            >
              Post Your Theory
            </span>
          </button>
        </Link>
      </div>
    </div>

  );
}
