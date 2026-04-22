"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      theme="system"
      richColors
      position="top-center"
      expand={true}
      visibleToasts={1}
      closeButton
      duration={4000}
      style={{
        "--sonner-color-success": "#22c55e",
        "--sonner-color-error": "#ef4444",
        "--sonner-color-warning": "#f59e0b",
        "--sonner-color-info": "#3b82f6",
        "--sonner-color-loading": "#f27f0d",
      } as React.CSSProperties}
    />
  );
}
