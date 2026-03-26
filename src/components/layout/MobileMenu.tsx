"use client";

/* Menú móvil — overlay fullscreen */

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { href: "/", label: "Inicio", anchor: "inicio" },
  { href: "/#productos", label: "Productos", anchor: "productos" },
  { href: "/#servicios", label: "Servicios", anchor: "servicios" },
  { href: "/#nosotros", label: "Nosotros", anchor: "nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent, anchor?: string) => {
    onClose();
    if (!anchor) return;
    e.preventDefault();
    if (pathname === "/") {
      setTimeout(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
      }, 300); // esperar que el menú se cierre
    } else {
      router.push(`/#${anchor}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] bg-background/95 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 rounded-full
                       bg-secondary flex items-center justify-center
                       hover:bg-secondary/80 transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Nav links */}
          <nav className="flex flex-col items-center justify-center h-full gap-6">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <a
                  href={link.href}
                  onClick={(e) => handleClick(e, link.anchor)}
                  className="text-3xl font-semibold text-foreground
                             hover:text-brand transition-colors cursor-pointer"
                >
                  {link.label}
                </a>
              </motion.div>
            ))}

          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
