"use client";

import { Home, MessageCircle, TrendingUp, Target, Settings } from "lucide-react";

interface BottomNavProps {
  currentScreen: "dashboard" | "chat" | "progress" | "goals" | "settings";
  setCurrentScreen: (screen: "dashboard" | "chat" | "progress" | "goals" | "settings") => void;
}

export function BottomNav({ currentScreen, setCurrentScreen }: BottomNavProps) {
  const navItems = [
    { id: "dashboard" as const, icon: Home, label: "Início" },
    { id: "progress" as const, icon: TrendingUp, label: "Progresso" },
    { id: "goals" as const, icon: Target, label: "Objetivos" },
    { id: "chat" as const, icon: MessageCircle, label: "Coach" },
    { id: "settings" as const, icon: Settings, label: "Config" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#1A535C]/10 shadow-lg">
      <div className="max-w-md mx-auto flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive ? "text-[#1A535C]" : "text-[#4E6E75]"
              }`}
            >
              <Icon
                className={`w-6 h-6 transition-all ${
                  isActive ? "scale-110" : ""
                }`}
              />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-[#FFC947] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
