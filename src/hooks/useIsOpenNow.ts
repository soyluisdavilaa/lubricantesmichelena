"use client";

/* Hook que calcula si el negocio está abierto ahora (timezone America/Caracas) */

import { useState, useEffect } from "react";
import type { Horario } from "@/lib/types";

const DAYS_ES = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

export function useIsOpenNow(horarios: Record<string, Horario>) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState("");

  useEffect(() => {
    function check() {
      // Obtener hora actual en Venezuela (UTC-4)
      const now = new Date(
        new Date().toLocaleString("en-US", { timeZone: "America/Caracas" })
      );
      const dayName = DAYS_ES[now.getDay()];
      setCurrentDay(dayName);

      const horario = horarios[dayName];
      if (!horario || horario.cerrado) {
        setIsOpen(false);
        return;
      }

      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const [openH, openM] = horario.abre.split(":").map(Number);
      const [closeH, closeM] = horario.cierra.split(":").map(Number);
      const openMinutes = openH * 60 + openM;
      const closeMinutes = closeH * 60 + closeM;

      setIsOpen(currentMinutes >= openMinutes && currentMinutes < closeMinutes);
    }

    check();
    // Recalcular cada minuto
    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, [horarios]);

  return { isOpen, currentDay };
}
