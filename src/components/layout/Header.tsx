"use client";

/* Header fijo — transparente al inicio, glassmorphism al scroll */

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, Droplets, Search } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { openWhatsApp } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
];

interface HeaderProps {
  onSearchOpen?: () => void;
}

export function Header({ onSearchOpen }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { config } = useSiteConfig();

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 30);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-[80] transition-all duration-500",
          isScrolled
            ? "border-b border-white/5 shadow-2xl shadow-black/30"
            : "bg-transparent"
        )}
        style={
          isScrolled
            ? { background: "rgba(5,5,5,0.82)", backdropFilter: "blur(24px) saturate(180%)" }
            : {}
        }
      >
        {/* Top accent line */}
        {!isScrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg
                         transition-transform hover:scale-105 active:scale-95"
            >
              <motion.div
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={cn("transition-all duration-500 origin-left", isScrolled ? "scale-90" : "scale-100")}
              >
                <Image 
                  src="/logo.png" 
                  alt="Lubricantes Michelena" 
                  width={200} 
                  height={80} 
                  className="w-auto h-14 md:h-16 object-contain"
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "text-brand"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full"
                        style={{ background: "#069542" }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              {onSearchOpen && (
                <button
                  onClick={onSearchOpen}
                  className="w-9 h-9 rounded-full flex items-center justify-center
                             text-muted-foreground hover:text-foreground hover:bg-white/10
                             transition-all duration-200"
                  aria-label="Buscar"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}

              <ThemeToggle />

              {/* WhatsApp button */}
              <button
                onClick={() => openWhatsApp(config.site.waNumber, config.waMessage)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full
                           bg-whatsapp text-white text-sm font-medium
                           hover:bg-whatsapp-hover hover:scale-105 hover:shadow-lg hover:shadow-whatsapp/30
                           active:scale-95 transition-all duration-200"
                aria-label="Contactar por WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>

              {/* Mobile menu */}
              <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden w-10 h-10 rounded-full bg-white/5 border border-white/10
                           flex items-center justify-center
                           hover:bg-white/10 transition-colors"
                aria-label="Abrir menú"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileMenu isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </>
  );
}
