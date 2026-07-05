"use client";

import React, { useRef, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { Send, Share, Check, MessageCircle, MessageSquare } from "lucide-react";
import { UpvoteIconButton } from "@/components/ui/upvote-icon-button";
import { Facehash } from "facehash";
import { useSession } from "@/hooks/useSession";
import { SessionModal } from "@/components/ui/SessionModal";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function TheoryPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: theory, mutate: mutateTheory } = useSWR(id ? `/api/theories?id=${id}` : null, fetcher);
  const { data: theoryComments = [], mutate: mutateComments } = useSWR(id ? `/api/comments?theoryId=${id}` : null, fetcher);

  const { username, isReady, hasUpvoted, toggleUpvote } = useSession();
  const [showSessionModal, setShowSessionModal] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchParams.get("action") === "comment") {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [searchParams]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: theory?.title || "Theory",
          text: theory?.excerpt || "Check out this theory!",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!theory) {
    return (
      <div className="min-h-screen pb-40 container mx-auto px-4 max-w-3xl pt-28 space-y-8 animate-pulse">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="w-24 h-6 bg-card/10 rounded-sm" />
            <div className="w-3/4 h-12 md:h-14 bg-card/10 rounded-md mt-4" />
            <div className="flex items-center gap-4 mt-8">
              <div className="w-12 h-12 rounded-full bg-card/10" />
              <div className="space-y-2">
                <div className="w-32 h-4 bg-card/10 rounded" />
                <div className="w-24 h-3 bg-card/10 rounded" />
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-border/30 my-8" />
          <div className="space-y-4 pt-4">
            <div className="w-full h-4 bg-card/10 rounded" />
            <div className="w-full h-4 bg-card/10 rounded" />
            <div className="w-11/12 h-4 bg-card/10 rounded" />
            <div className="w-full h-4 bg-card/10 rounded" />
            <div className="w-4/5 h-4 bg-card/10 rounded" />
            <div className="w-full h-4 bg-card/10 rounded" />
            <div className="w-3/4 h-4 bg-card/10 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const handlePostComment = async () => {
    if (!username) {
      setShowSessionModal(true);
      return;
    }
    if (!commentText.trim()) return;

    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theoryId: id, author: username, text: commentText })
    });

    setCommentText("");
    mutateComments();
    mutateTheory();
  };

  const handleTheoryUpvote = async (isUpvoted: boolean) => {
    if (!username) {
      setShowSessionModal(true);
      return false;
    }
    toggleUpvote(id, isUpvoted);
    await fetch(`/api/theories/${id}/upvote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isUpvoted })
    });
    mutateTheory();
    return true;
  };

  const handleCommentUpvote = async (commentId: string, isUpvoted: boolean) => {
    if (!username) {
      setShowSessionModal(true);
      return false;
    }
    toggleUpvote(commentId, isUpvoted);
    await fetch(`/api/comments/${commentId}/upvote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isUpvoted })
    });
    mutateComments();
    return true;
  };

  return (
    <div className="min-h-screen pb-40">
      <SessionModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        message="Enter your username to interact with this theory!"
      />
      <div className="container mx-auto px-4 max-w-3xl pt-28 space-y-8">

        {/* Theory Content */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs uppercase tracking-wider px-2 py-1 bg-accent/20 text-accent rounded-sm">
                {theory.tag}
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">
              {theory.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>By <strong className="text-primary">{theory.author}</strong></span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-foreground/90 italic border-l-2 border-primary pl-4 py-1">
              {theory.excerpt}
            </p>

            {/* Upvote and Share - Below TL;DR */}
            <div className="flex items-center justify-between mt-6 pb-2 border-b border-border/20 mb-6">
              <div className="flex items-center gap-2">
                <UpvoteIconButton
                  count={theory.upvotes}
                  initialUpvoted={hasUpvoted(id)}
                  onUpvote={handleTheoryUpvote}
                />
                <button
                  onClick={() => document.getElementById('comment-input')?.focus()}
                  className="pointer-events-auto flex cursor-pointer items-center gap-1.5 text-muted-foreground transition-colors hover:text-accent h-10 px-3 rounded-full hover:bg-[#f5c66d]/10 group"
                >
                  <MessageCircle className="size-5 opacity-60 group-hover:text-[#f5c66d] transition-colors" />
                  <span className="text-sm font-bold group-hover:text-[#f5c66d] transition-colors">
                    {theory.comments}
                  </span>
                </button>
              </div>
              <button
                onClick={handleShare}
                className="flex cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-accent h-10 w-10 rounded-full hover:bg-accent/10 pointer-events-auto"
              >
                {isCopied ? <Check className="size-5 text-emerald-500" /> : <Share className="size-5" />}
              </button>
            </div>

            <p className="text-lg leading-relaxed text-foreground/80 mt-6 whitespace-pre-wrap">
              {theory.content}
            </p>
          </div>
        </div>

        <div className="h-px bg-border/50 my-12" />

        {/* Comments Section */}
        <div className="space-y-8">
          <h2 className="font-serif text-2xl text-foreground">
            Discussion ({theory.comments})
          </h2>

          {/* Comment List */}
          <div className="space-y-4">
            {theoryComments.length === 0 ? (
              <p className="text-muted-foreground italic text-center py-8">Be the first to share your thoughts.</p>
            ) : (
              theoryComments.map((comment: any) => (
                <div key={comment.id} className="p-4 rounded-lg bg-card/20 border border-border/30">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden border border-border/30 shadow-inner bg-background">
                      <Facehash name={comment.author} size={32} />
                    </div>
                    <span className="font-bold text-primary text-sm">{comment.author}</span>
                  </div>
                  <p className="text-sm text-foreground/90 pl-11 mb-2">{comment.text}</p>
                  <div className="flex items-center gap-4 pl-11 mt-1">
                    <UpvoteIconButton
                      count={comment.upvotes}
                      onUpvote={(isUpvoted) => handleCommentUpvote(comment.id, isUpvoted)}
                    />
                    <button className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary group">
                      <MessageSquare className="w-4 h-4 group-hover:text-[#f5c66d] transition-colors opacity-70" />
                      <span className="text-xs font-medium group-hover:text-[#f5c66d] transition-colors">Reply</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Floating CTA Pill */}
      <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md">
          <div className="flex items-center gap-3 bg-card/70 backdrop-blur-xl border border-border/50 shadow-2xl rounded-full p-2 w-full transition-colors focus-within:bg-card/90">
            <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden border border-border/30 shadow-inner bg-background flex items-center justify-center">
              {username ? (
                <Facehash name={username} size={48} enableBlink={true} />
              ) : (
                <div className="text-muted-foreground opacity-50 text-sm">?</div>
              )}
            </div>
            <input
              id="comment-input"
              ref={inputRef}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && commentText.trim()) {
                  handlePostComment();
                }
              }}
              onClick={() => {
                if (!username) {
                  setShowSessionModal(true);
                }
              }}
              placeholder="Add a hot take..."
              className="flex-1 bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground text-sm pl-2"
            />
            <button
              onClick={handlePostComment}
              disabled={!commentText.trim()}
              className="shrink-0 bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
