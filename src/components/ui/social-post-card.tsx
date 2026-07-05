import React from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SocialPostCardProps {
  id?: string;
  author?: {
    name?: string;
    username?: string;
    avatar?: string;
    timeAgo?: string;
  };
  content?: {
    text?: string;
    link?: {
      title?: string;
      description?: string;
      icon?: React.ReactNode;
    };
  };
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
    isLiked?: boolean;
    isBookmarked?: boolean;
  };
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
}

const defaultProps: SocialPostCardProps = {
  author: {
    name: "Dorian Baffier",
    username: "dorian_baffier",
    avatar: "https://github.com/shadcn.png",
    timeAgo: "2h ago",
  },
  content: {
    text: "Just launched Ruixen UI! Check out the documentation and let me know what you think 🎨",
    link: {
      title: "Ruixen UI Documentation",
      description: "A comprehensive guide to Ruixen UI",
      icon: <LinkIcon className="w-5 h-5 text-blue-500" />,
    },
  },
  engagement: {
    likes: 128,
    comments: 32,
    shares: 24,
    isLiked: false,
    isBookmarked: false,
  },
};

export default function SocialPostCard({
  author = defaultProps.author,
  content = defaultProps.content,
  engagement = defaultProps.engagement,
  onLike,
  onComment,
  onShare,
  onBookmark,
  id,
}: SocialPostCardProps) {
  return (
    <div className="w-full max-w-lg mx-auto rounded-3xl bg-card border border-border shadow-xl backdrop-blur-lg transition-all overflow-hidden group hover:border-primary/50">
      
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-3">
          <img
            src={author?.avatar}
            alt={author?.name}
            className="w-11 h-11 rounded-full border border-border object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-foreground">{author?.name}</p>
            <p className="text-xs text-muted-foreground">@{author?.username} · {author?.timeAgo}</p>
          </div>
        </div>
        <div>
          <Bookmark
            onClick={onBookmark}
            className={cn(
              "w-5 h-5 cursor-pointer transition hover:text-primary",
              engagement?.isBookmarked ? "text-primary" : "text-muted-foreground"
            )}
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4 text-foreground/90 text-base">
        {content?.text}
      </div>

      {/* Optional Link Box */}
      {content?.link && (
        <div className="mx-5 mb-4 rounded-xl bg-background/50 border border-border p-4 hover:bg-background transition cursor-pointer">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-card border border-border">
              {content.link.icon}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">{content.link.title}</h4>
              <p className="text-xs text-muted-foreground">{content.link.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Reactions Footer */}
      <div className="grid grid-cols-3 divide-x divide-border border-t border-border text-sm text-center bg-background/30">
        <button
          onClick={onLike}
          className={cn(
            "py-3 flex items-center justify-center gap-2 transition hover:bg-red-500/10 hover:text-red-500",
            engagement?.isLiked ? "text-red-500 font-semibold" : "text-muted-foreground"
          )}
        >
          <Heart className={cn("w-4 h-4", engagement?.isLiked && "fill-current")} />
          {engagement?.likes}
        </button>
        <button
          onClick={onComment}
          className="py-3 flex items-center justify-center gap-2 text-muted-foreground hover:bg-blue-500/10 hover:text-blue-500 transition"
        >
          <MessageCircle className="w-4 h-4" />
          {engagement?.comments}
        </button>
        <button
          onClick={onShare}
          className="py-3 flex items-center justify-center gap-2 text-muted-foreground hover:bg-green-500/10 hover:text-green-500 transition"
        >
          <Share2 className="w-4 h-4" />
          {engagement?.shares}
        </button>
      </div>
    </div>
  );
}
