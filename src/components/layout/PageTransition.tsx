"use client";

/* Transición suave entre páginas usando pathname como key */

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <div key={pathname} className="relative w-full h-full">
        {/* Contenido principal de la página */}
        <motion.div
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.4, ease: "easeOut" } }}
           exit={{ opacity: 0, y: -15, transition: { duration: 0.3, ease: "easeIn" } }}
        >
          {children}
        </motion.div>

        {/* "Wiper" de entrada: Al salir de la página actual, el panel negro cubre la pantalla desde la derecha */}
        <motion.div
          className="fixed inset-0 z-[150] pointer-events-none"
          style={{ background: "#0c0c0c" }}
          initial={{ x: "100%" }}
          animate={{ x: "100%", transition: { duration: 0 } }}
          exit={{ x: "0%", transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
        />

        {/* "Wiper" de salida: Al entrar a la nueva página, el panel negro descubre la pantalla hacia la izquierda */}
        <motion.div
          className="fixed inset-0 z-[150] pointer-events-none"
          style={{ background: "#0c0c0c" }}
          initial={{ x: "0%" }}
          animate={{ x: "-100%", transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 } }}
          exit={{ x: "-100%", transition: { duration: 0 } }}
        />
      </div>
    </AnimatePresence>
  );
}
