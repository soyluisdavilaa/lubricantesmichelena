"use client";

/* Hero principal — animación palabra x palabra, shimmer buttons, partículas flotantes */

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MessageCircle, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { openWhatsApp } from "@/lib/utils";

/* Partícula flotante */
function Particle({
  x,
  y,
  size,
  delay,
  duration,
}: {
  x: string;
  y: string;
  size: number;
  delay: number;
  duration: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: "radial-gradient(circle, rgba(249,115,22,0.5) 0%, transparent 70%)",
      }}
      animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

const PARTICLES = [
  { x: "10%", y: "20%", size: 6, delay: 0, duration: 4 },
  { x: "25%", y: "70%", size: 4, delay: 1, duration: 5 },
  { x: "50%", y: "15%", size: 5, delay: 0.5, duration: 3.5 },
  { x: "70%", y: "60%", size: 7, delay: 1.5, duration: 4.5 },
  { x: "85%", y: "30%", size: 4, delay: 0.8, duration: 3.8 },
  { x: "90%", y: "75%", size: 5, delay: 2, duration: 5.2 },
  { x: "40%", y: "85%", size: 3, delay: 0.3, duration: 4.2 },
  { x: "60%", y: "45%", size: 6, delay: 1.2, duration: 3.2 },
];

function HeroCarousel({ slides }: { slides: string[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setCurrent(i => (i + 1) % slides.length), 15000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (!slides.length) return null;

  const prev = () => setCurrent(i => (i - 1 + slides.length) % slides.length);
  const next = () => setCurrent(i => (i + 1) % slides.length);

  return (
    <>
      {/* Slides — cada una ocupa el espacio completo, se deslizan con translateX */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {slides.map((src, i) => (
          <div
            key={src + i}
            className="absolute inset-0"
            style={{
              transform: `translateX(${(i - current) * 100}%)`,
              transition: "transform 0.75s cubic-bezier(0.32, 0.72, 0, 1)",
            }}
          >
            <img
              src={src}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover bg-ken-burns"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        ))}
      </div>

      {/* Controls */}
      {slides.length > 1 && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <button
            type="button"
            onClick={prev}
            className="pointer-events-auto absolute left-3 sm:left-5 top-1/2 -translate-y-1/2
                       w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white
                       flex items-center justify-center transition-all backdrop-blur-sm border border-white/10"
            aria-label="Anterior"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button
            type="button"
            onClick={next}
            className="pointer-events-auto absolute right-3 sm:right-5 top-1/2 -translate-y-1/2
                       w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white
                       flex items-center justify-center transition-all backdrop-blur-sm border border-white/10"
            aria-label="Siguiente"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          <div className="pointer-events-auto absolute bottom-16 left-1/2 -translate-x-1/2 hidden sm:flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all ${i === current ? "w-6 h-2 bg-brand" : "w-2 h-2 bg-white/50 hover:bg-white/80"}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export function HeroSection() {
  const { config } = useSiteConfig();
  const { hero, site } = config;
  const shouldReduce = useReducedMotion();
  const words = hero.titulo.split(" ");
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Deep background */}
      <div className="absolute inset-0 bg-background -z-20" />

      {/* Hero carousel / background image */}
      <HeroCarousel slides={hero.slides?.length ? hero.slides : hero.imagen ? [hero.imagen] : []} />
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(249,115,22,0.25) 0%, transparent 65%)",
        }}
      />

      {/* Radial glow bottom-left */}
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at bottom left, rgba(34,197,94,0.2) 0%, transparent 65%)",
        }}
      />

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating particles */}
      {!shouldReduce && PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 24 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                     bg-brand/10 border border-brand/20 text-brand text-sm font-medium mb-8"
        >
          <span className="relative flex w-2 h-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-60" />
            <span className="relative inline-flex rounded-full w-2 h-2 bg-brand" />
          </span>
          Centro de Lubricación Automotriz · Valencia
        </motion.div>

        {/* Title — word by word */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: 0.3 + i * 0.08,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`inline-block mr-[0.25em] ${i >= words.length - 2 ? "text-gradient" : ""}`}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + words.length * 0.08 + 0.2, duration: 0.6 }}
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-2"
        >
          {hero.subtitulo}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + words.length * 0.08 + 0.45, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          {/* Primary — Pulse */}
          <motion.button
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(249, 115, 22, 0.4)",
                "0 0 0 20px rgba(249, 115, 22, 0)"
              ]
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              repeatType: "loop"
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openWhatsApp(site.waNumber, config.waMessage)}
            className="relative inline-flex items-center gap-2.5 px-8 py-4 rounded-full
                       bg-brand text-white font-semibold text-base overflow-hidden
                       shadow-xl shadow-brand/30 group"
          >
            <span
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full
                         transition-transform duration-700 ease-in-out
                         bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
            <MessageCircle className="w-5 h-5 relative z-10" />
            <span className="relative z-10">{hero.btnTexto}</span>
          </motion.button>

          {/* Secondary */}
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full
                       bg-white text-gray-900 font-semibold text-base
                       hover:bg-white/90 hover:scale-105
                       active:scale-95 transition-all duration-200 shadow-lg"
          >
            Ver Catálogo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Trust pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-12 max-w-lg sm:max-w-none mx-auto"
        >
          {(hero.trustPills || []).map((text, i) => {
            const cleanText = text.replace("✓ ", "");
            return (
              <span
                key={i}
                className="flex items-center gap-1.5 text-sm sm:text-base font-medium text-white bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full whitespace-nowrap backdrop-blur-md transition-all shadow-lg"
              >
                <div className="w-4 h-4 rounded-full bg-brand flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 text-white">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {cleanText}
              </span>
            );
          })}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        whileHover={{ scale: 1.3, transition: { type: "spring", stiffness: 400, damping: 10 } }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="text-white/60 hover:text-white transition-colors"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </motion.div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none">
        <svg
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          className="w-full h-12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,24 C240,48 480,0 720,24 C960,48 1200,0 1440,24 L1440,48 L0,48 Z"
            className="fill-card/50"
          />
        </svg>
      </div>
    </section>
  );
}
