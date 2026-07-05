"use client";

import { enrichTweet, type EnrichedTweet } from "react-tweet";
import { cn } from "@/lib/utils";
import { Check, Link2, Bookmark, Share, MessageCircle, Trash2 } from "lucide-react";
import { UpvoteIconButton } from "@/components/ui/upvote-icon-button";
import { useState } from "react";
import { Facehash } from "facehash";
import { useRouter } from "next/navigation";

const VerifiedBadge = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 22 22"
    className={className}
    fill="currentColor"
    aria-label="Verified account"
    role="img"
  >
    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
  </svg>
);

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${hour12}:${minutes.toString().padStart(2, "0")} ${ampm} · ${month} ${day}, ${year}`;
};

const TweetHeader = ({ tweet }: { tweet: EnrichedTweet }) => (
  <div className="flex items-start justify-between">
    <div className="flex items-center gap-2">
      <div className="size-[38px] shrink-0 rounded-full overflow-hidden border border-border">
        {/* Using facehash based on the screen_name */}
        <Facehash name={tweet.user.screen_name} size={38} enableBlink={true} />
      </div>
      <div className="flex flex-col">
        <span className="flex items-center gap-1 text-[15px] font-semibold text-primary">
          {tweet.user.name}
          {(tweet.user.verified || tweet.user.is_blue_verified) && (
            <VerifiedBadge className="size-4 text-[#1C9BF1]" />
          )}
        </span>
        <span className="-mt-0.5 text-[13px] text-muted-foreground">
          @{tweet.user.screen_name}
        </span>
      </div>
    </div>
    <a href={tweet.url} target="_blank" rel="noopener noreferrer">
      <Bookmark className="size-5 text-muted-foreground transition-colors hover:text-primary" />
    </a>
  </div>
);

const TweetBody = ({ tweet }: { tweet: any }) => {
  if (tweet.title && tweet.excerpt) {
    return (
      <div className="mt-4 flex flex-col gap-3">
        <h2 className="font-serif text-[15px] text-foreground uppercase tracking-wider leading-snug">
          {tweet.title}
        </h2>
        <p className="text-muted-foreground text-[13px] font-light leading-relaxed">
          {tweet.excerpt}
        </p>
      </div>
    );
  }

  return (
    <p className="mt-3 leading-6 text-foreground font-serif text-lg tracking-wide">
      {tweet.entities?.map((entity: any, idx: number) => {
        switch (entity.type) {
          case "url":
          case "symbol":
          case "hashtag":
          case "mention":
            return (
              <a
                key={idx}
                href={entity.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {entity.text}
              </a>
            );
          case "text":
            return (
              <span
                key={idx}
                dangerouslySetInnerHTML={{ __html: entity.text }}
              />
            );
          default:
            return null;
        }
      })}
    </p>
  );
};

const TweetMedia = ({ tweet }: { tweet: EnrichedTweet }) => {
  if (!tweet.video && !tweet.photos) return null;

  const getVideoSource = () => {
    if (!tweet.video?.variants) return null;

    const getResolution = (url: string): number => {
      const match = url.match(/\/(\d+)x(\d+)\//);
      if (match) {
        return parseInt(match[1]) * parseInt(match[2]);
      }
      return 0;
    };

    const mp4Variants = tweet.video.variants
      .filter((v) => v.type === "video/mp4")
      .sort((a, b) => getResolution(b.src) - getResolution(a.src));

    if (mp4Variants.length > 0) {
      return { src: mp4Variants[0].src, type: "video/mp4" };
    }

    const firstVariant = tweet.video.variants[0];
    return { src: firstVariant.src, type: firstVariant.type };
  };

  const videoSource = getVideoSource();

  return (
    <div className="mt-4">
      {tweet.video && videoSource && (
        <video
          poster={tweet.video.poster}
          autoPlay
          loop
          muted
          playsInline
          className="w-full rounded-lg"
        >
          <source src={videoSource.src} type={videoSource.type} />
        </video>
      )}
      {tweet.photos && (
        <div
          className={cn(
            "grid gap-1",
            tweet.photos.length === 1 && "grid-cols-1",
            tweet.photos.length === 2 && "grid-cols-2",
            tweet.photos.length >= 3 && "grid-cols-2"
          )}
        >
          {tweet.photos.map((photo, idx) => (
            <img
              key={photo.url}
              src={photo.url}
              alt={`Photo ${idx + 1}`}
              loading="lazy"
              className={cn(
                "w-full rounded-lg object-cover",
                tweet.photos &&
                tweet.photos.length === 3 &&
                idx === 0 &&
                "row-span-2"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface TweetFooterProps {
  tweet: EnrichedTweet;
  showDate?: boolean;
  showLikeButton?: boolean;
  showCopyLink?: boolean;
  initialUpvoted?: boolean;
  onUpvote?: (isUpvoted: boolean) => boolean | Promise<boolean> | void;
}

const TweetFooter = ({
  tweet,
  showDate = true,
  showLikeButton = true,
  showCopyLink = true,
  initialUpvoted = false,
  onUpvote,
}: TweetFooterProps) => {
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = window.location.origin + "/theory/" + tweet.id_str;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Theory",
          text: "Check out this theory on Raobahadur!",
          url: url,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(url).catch(() => { });
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    }
  };

  const showActions = showLikeButton || showCopyLink;

  if (!showDate && !showActions) return null;

  return (
    <>
      {showDate && (
        <div className="mt-4 flex items-center justify-between">
          <time
            className="text-xs font-medium text-muted-foreground"
            dateTime={tweet.created_at}
          >
            {formatDate(tweet.created_at)}
          </time>
        </div>
      )}
      {showActions && (
        <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
          <div className="flex items-center gap-2">
            {showLikeButton && (
              <UpvoteIconButton
                count={tweet.favorite_count}
                initialUpvoted={initialUpvoted}
                onUpvote={onUpvote}
              />
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/theory/${tweet.id_str}?action=comment`);
              }}
              className="pointer-events-auto flex cursor-pointer items-center gap-1.5 text-muted-foreground transition-colors hover:text-accent h-10 px-3 rounded-full hover:bg-[#f5c66d]/10 group"
            >
              <MessageCircle className="size-5 opacity-60 group-hover:text-[#f5c66d] transition-colors" />
              <span className="text-sm font-bold group-hover:text-[#f5c66d] transition-colors">
                {tweet.conversation_count}
              </span>
            </button>
          </div>
          {showCopyLink && (
            <button
              onClick={handleCopyLink}
              className="flex cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-accent h-10 w-10 rounded-full hover:bg-accent/10 pointer-events-auto"
            >
              {isCopied ? (
                <Check className="size-5 text-emerald-500" />
              ) : (
                <Share className="size-5" />
              )}
            </button>
          )}
        </div>
      )}
    </>
  );
};

interface TweetContentProps {
  tweet: EnrichedTweet;
  className?: string;
  showDate?: boolean;
  showLikeButton?: boolean;
  showCopyLink?: boolean;
  initialUpvoted?: boolean;
  showDelete?: boolean;
  onDelete?: () => void;
  onUpvote?: (isUpvoted: boolean) => boolean | Promise<boolean> | void;
}

const TweetContent = ({
  tweet,
  className,
  showDate,
  showLikeButton,
  showCopyLink,
  initialUpvoted,
  showDelete,
  onDelete,
  onUpvote,
}: TweetContentProps) => {
  return (
    <div
      className={cn(
        "w-full h-full rounded-2xl bg-card/40 backdrop-blur-sm border border-border/50 p-6 shadow-sm hover:border-primary/50 transition-colors flex flex-col justify-between",
        className
      )}
    >
      <div>
        <TweetHeader tweet={tweet} />
        <TweetBody tweet={tweet} />
        <TweetMedia tweet={tweet} />
        {showDelete && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete?.();
            }}
            className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-500/10 z-10"
            title="Delete theory"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
      <TweetFooter
        tweet={tweet}
        showDate={showDate}
        showLikeButton={showLikeButton}
        showCopyLink={showCopyLink}
        initialUpvoted={initialUpvoted}
        onUpvote={onUpvote}
      />
    </div>
  );
};

interface TweetProps {
  tweetData: any; // We'll pass our mapped Theory data here
  className?: string;
  showDate?: boolean;
  showLikeButton?: boolean;
  showCopyLink?: boolean;
  initialUpvoted?: boolean;
  showDelete?: boolean;
  onDelete?: () => void;
  onUpvote?: (isUpvoted: boolean) => boolean | Promise<boolean> | void;
}

export const Tweet = ({
  tweetData,
  className,
  showDate = true,
  showLikeButton = true,
  showCopyLink = true,
  initialUpvoted = false,
  showDelete = false,
  onDelete,
  onUpvote
}: TweetProps) => {
  const enrichedTweet = enrichTweet(tweetData as any);

  return (
    <TweetContent
      tweet={enrichedTweet}
      className={className}
      showDate={showDate}
      showLikeButton={showLikeButton}
      showCopyLink={showCopyLink}
      initialUpvoted={initialUpvoted}
      showDelete={showDelete}
      onDelete={onDelete}
      onUpvote={onUpvote}
    />
  );
};
