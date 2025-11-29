"use client";

import { AlertCircle } from "lucide-react";

export function SOSButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 w-14 h-14 bg-red-500 rounded-full shadow-2xl flex items-center justify-center hover:bg-red-600 transition-all hover:scale-110 z-50 animate-pulse"
      aria-label="Botão SOS"
    >
      <AlertCircle className="w-7 h-7 text-white" />
    </button>
  );
}
