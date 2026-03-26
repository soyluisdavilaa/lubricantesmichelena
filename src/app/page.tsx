"use client";

/* ═══════════════════════════════════════════════
   HOME PAGE — Lubricantes Michelena
   ═══════════════════════════════════════════════ */


import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ServicesSection } from "@/components/home/ServicesSection";
import { AboutSection } from "@/components/home/AboutSection";
import { GallerySection } from "@/components/home/GallerySection";
import { CTASection } from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <section id="inicio"><HeroSection /></section>
      <StatsSection />
      <section id="productos"><FeaturedProducts /></section>
      <section id="servicios"><ServicesSection /></section>
      <section id="nosotros"><AboutSection /></section>
      <GallerySection />
      <CTASection />
    </>
  );
}
