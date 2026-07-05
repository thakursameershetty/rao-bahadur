"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

type ProgressiveBlurProps = {
  className?: string;
  backgroundColor?: string;
  position?: "top" | "bottom";
  height?: string;
  blurAmount?: string;
};

export const ProgressiveBlur = ({
  className = "",
  backgroundColor = "transparent",
  position = "top",
  height = "120px",
  blurAmount = "8px",
}: ProgressiveBlurProps) => {
  const isTop = position === "top";
  const pathname = usePathname();
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 100);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHeroSection = pathname === "/" && isAtTop;
  const currentHeight = isHeroSection ? "40px" : height;

  return (
    <div
      className={`pointer-events-none fixed left-0 w-full select-none z-40 transition-all duration-700 ease-in-out ${className}`}
      style={{
        [isTop ? "top" : "bottom"]: 0,
        height: currentHeight,
        background: isTop
          ? `linear-gradient(to top, transparent, ${backgroundColor})`
          : `linear-gradient(to bottom, transparent, ${backgroundColor})`,
        maskImage: isTop
          ? `linear-gradient(to bottom, black 20%, transparent)`
          : `linear-gradient(to top, black 20%, transparent)`,
        WebkitBackdropFilter: `blur(${blurAmount})`,
        backdropFilter: `blur(${blurAmount})`,
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    />
  );
};
