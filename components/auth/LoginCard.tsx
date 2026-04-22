import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * Presentational card shell for all auth pages.
 * Keep this a Server Component — no interactivity needed.
 */
export function LoginCard({ children }: Props) {
  return (
    <div
      className="
        w-full max-w-sm mx-auto px-6
        animate-in fade-in slide-in-from-bottom-4 duration-500
      "
    >
      <div
        className="
          relative
          bg-white dark:bg-[#292524]
          rounded-2xl
          shadow-xl shadow-[#F2651A]/10 dark:shadow-[#C96442]/20
          border border-orange-100 dark:border-[#C96442]/15
          p-8 space-y-6
          overflow-hidden
        "
      >
        {/* Top accent stripe — KMITL orange */}
        <div
          className="
            absolute inset-x-0 top-0 h-[4px]
            bg-gradient-to-r from-[#F2651A] via-[#FF8C42] to-[#F2651A]
          "
          aria-hidden="true"
        />

        {/* Soft radial glow top-right corner */}
        <div
          className="
            pointer-events-none absolute -top-20 -right-20
            w-56 h-56 rounded-full
            bg-[#C96442]/6 dark:bg-[#C96442]/10
            blur-3xl
          "
          aria-hidden="true"
        />

        {children}
      </div>
    </div>
  );
}