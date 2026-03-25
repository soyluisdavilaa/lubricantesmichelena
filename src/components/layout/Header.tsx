"use client";

/* Header fijo — transparente al inicio, glassmorphism al scroll */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, MessageCircle, Search } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { openWhatsApp } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Links del menú: los que tienen 'anchor' hacen scroll suave en el home
const navLinks = [
  { href: "/", label: "Inicio", anchor: "inicio" },
  { href: "/#productos", label: "Productos", anchor: "productos" },
  { href: "/#servicios", label: "Servicios", anchor: "servicios" },
  { href: "/#nosotros", label: "Nosotros", anchor: "nosotros" },
  { href: "/contacto", label: "Contacto" },
];

interface HeaderProps {
  onSearchOpen?: () => void;
}

export function Header({ onSearchOpen }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { config } = useSiteConfig();

  // Scroll suave a una sección del home
  const handleNavClick = useCallback((e: React.MouseEvent, anchor?: string) => {
    if (!anchor) return; // link normal, sin intercepción
    e.preventDefault();
    if (pathname === "/") {
      // Ya estamos en el home → scroll directo
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
    } else {
      // Otra página → navegar al home y luego al anchor
      router.push(`/#${anchor}`);
    }
  }, [pathname, router]);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    // Always show and remove blur if near the top
    if (latest <= 60) {
      setIsHidden(false);
      setIsScrolled(latest > 30);
    } else {
      setIsScrolled(true);
      // Hide if scrolling down past 100px, show if scrolling up
      if (latest > previous && latest > 150) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
    }
  });

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-100%", opacity: 0 }
        }}
        initial="visible"
        animate={isHidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-[80] transition-colors duration-500",
          "border-b border-white/5 shadow-2xl shadow-black/30 bg-[#050505]/95 backdrop-blur-md"
        )}
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg
                         transition-transform hover:scale-105 active:scale-95"
            >
              <div className="transition-all duration-300 hover:scale-105 active:scale-95">
                <Image 
                  src="/logo.png" 
                  alt="Lubricantes Michelena" 
                  width={280} 
                  height={110} 
                  className="w-auto h-[60px] lg:h-[80px] object-contain drop-shadow-md"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.anchor
                    ? pathname === "/"
                    : link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.anchor)}
                    className={cn(
                      "relative px-4 lg:px-5 py-2 text-base lg:text-lg font-medium rounded-lg transition-all duration-200 cursor-pointer",
                      isActive && !link.anchor
                        ? "text-brand"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </a>
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
