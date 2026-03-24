"use client";

/* Separador de ola entre secciones */

interface WaveDividerProps {
  /** Color de relleno de la ola (CSS color) */
  fill?: string;
  /** Voltear verticalmente para ola inversa */
  flip?: boolean;
  className?: string;
}

export function WaveDivider({ fill = "var(--card)", flip = false, className = "" }: WaveDividerProps) {
  return (
    <div
      className={`overflow-hidden leading-none pointer-events-none ${className}`}
      style={{ transform: flip ? "scaleY(-1)" : undefined }}
    >
      <svg
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        className="w-full h-12"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,24 C240,48 480,0 720,24 C960,48 1200,0 1440,24 L1440,48 L0,48 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
