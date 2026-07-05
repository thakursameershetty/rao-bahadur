import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

// CVA for card variants
const cardVariants = cva(
  "relative flex flex-col justify-between w-full p-6 overflow-hidden rounded-xl shadow-sm transition-shadow duration-300 ease-in-out group hover:shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border border-border/50 hover:border-primary/50",
        red: "bg-red-900/40 text-primary-foreground border border-red-500/30",
        blue: "bg-blue-900/40 text-primary-foreground border border-blue-500/30",
        gray: "bg-secondary/40 text-secondary-foreground border border-border/50 hover:border-accent/50",
        gold: "bg-primary/10 text-primary-foreground border border-primary/30 hover:border-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ServiceCardProps
  extends Omit<HTMLMotionProps<"div">, "title">,
  VariantProps<typeof cardVariants> {
  /**
   * The eyebrow text above the title.
   */
  eyebrow?: string;
  /**
   * The main title of the card.
   */
  title: string;
  /**
   * Subtitle or description.
   */
  description?: string;
  /**
   * The URL the card's link should point to.
   */
  href: string;
  /**
   * The source URL for the decorative image.
   */
  imgSrc: string;
  /**
   * The alt text for the decorative image, for accessibility.
   */
  imgAlt: string;
}

const ServiceCard = React.forwardRef<HTMLDivElement, ServiceCardProps>(
  ({ className, variant, eyebrow, title, description, href, imgSrc, imgAlt, ...props }, ref) => {

    // Animation variants for Framer Motion
    const cardAnimation: Variants = {
      hover: {
        scale: 1.02,
        transition: { duration: 0.3 },
      },
    };

    const imageAnimation: Variants = {
      hover: {
        scale: 1.1,
        rotate: 3,
        x: 10,
        transition: { duration: 0.4, ease: "easeInOut" },
      },
    };

    const arrowAnimation: Variants = {
      hover: {
        x: 5,
        transition: { duration: 0.3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" },
      }
    };

    return (
      <motion.div
        className={cn(cardVariants({ variant, className }), "rounded-3xl")}
        ref={ref}
        variants={cardAnimation}
        whileHover="hover"
        {...props}
      >
        <div className="relative z-10 flex flex-col h-full">
          {eyebrow && <span className="text-accent text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-2">{eyebrow}</span>}
          <h3 className="text-3xl font-serif text-foreground uppercase tracking-tight mb-4">{title}</h3>
          {description && <p className="text-muted-foreground text-sm font-light leading-relaxed mb-8 max-w-[85%]">{description}</p>}
          <Link
            href={href}
            aria-label={`Learn more about ${title}`}
            className="mt-auto flex items-center text-sm font-semibold text-primary group-hover:underline uppercase tracking-wider before:absolute before:inset-0 before:z-20"
          >
            ENTER
            <motion.div variants={arrowAnimation}>
              <ArrowRight className="ml-2 h-4 w-4" />
            </motion.div>
          </Link>
        </div>

        <motion.img
          src={imgSrc}
          alt={imgAlt}
          className="absolute -right-8 -bottom-8 w-48 h-48 object-contain opacity-70 group-hover:opacity-100 transition-opacity drop-shadow-2xl"
          variants={imageAnimation}
        />
      </motion.div>
    );
  }
);
ServiceCard.displayName = "ServiceCard";

export { ServiceCard };
