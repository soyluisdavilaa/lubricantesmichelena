"use client";

/* Wrapper que aplica animaciones de reveal al entrar en viewport.
   Usa useInView propio (IntersectionObserver) en lugar de whileInView
   para evitar problemas de hidratación SSR con framer-motion v12 + React 19. */

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "scale";

interface RevealOnScrollProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

const HIDDEN: Record<Direction, any> = {
  up:    { opacity: 0, y: 64 },
  down:  { opacity: 0, y: -64 },
  left:  { opacity: 0, x: -64 },
  right: { opacity: 0, x: 64 },
  scale: { opacity: 0, scale: 0.82 },
};

const VISIBLE = { opacity: 1, y: 0, x: 0, scale: 1 };

export function RevealOnScroll({
  children,
  direction = "up",
  delay = 0,
  duration,
  className = "",
  once = true,
}: RevealOnScrollProps) {
  const { ref, isInView } = useInView({ triggerOnce: once, rootMargin: "-60px" });

  return (
    <motion.div
      ref={ref}
      variants={{ hidden: HIDDEN[direction], visible: VISIBLE }}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={
        duration
          ? { duration, delay, ease: [0.22, 1, 0.36, 1] }
          : { type: "spring", stiffness: 260, damping: 22, delay }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
