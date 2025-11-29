"use client";

import { Trophy, Award, Star, Target, Heart, Zap } from "lucide-react";
import { useState } from "react";

interface UserData {
  savedMoney: number;
  daysClean: number;
  mood: number;
}

interface Achievement {
  id: number;
  name: string;
  icon: any;
  unlocked: boolean;
  requirement: string;
  progress: number;
  total: number;
}

export function ProgressScreen({ userData }: { userData: UserData }) {
  const [hoveredAchievement, setHoveredAchievement] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const moodHistory = [5, 6, 7, 6, 8, 7, userData.mood];
  const maxMood = 10;

  const achievements: Achievement[] = [
    { 
      id: 1, 
      name: "Primeiro Dia", 
      icon: Star, 
      unlocked: userData.daysClean >= 1,
      requirement: "Complete 1 dia de foco",
      progress: Math.min(userData.daysClean, 1),
      total: 1
    },
    { 
      id: 2, 
      name: "Uma Semana", 
      icon: Award, 
      unlocked: userData.daysClean >= 7,
      requirement: "Complete 7 dias consecutivos",
      progress: Math.min(userData.daysClean, 7),
      total: 7
    },
    { 
      id: 3, 
      name: "Primeiro Passo", 
      icon: Target, 
      unlocked: userData.savedMoney > 0,
      requirement: "Economize qualquer valor",
      progress: userData.savedMoney > 0 ? 1 : 0,
      total: 1
    },
    { 
      id: 4, 
      name: "30 Dias de Foco", 
      icon: Trophy, 
      unlocked: userData.daysClean >= 30,
      requirement: "Complete 30 dias consecutivos",
      progress: Math.min(userData.daysClean, 30),
      total: 30
    },
    { 
      id: 5, 
      name: "Resiliência", 
      icon: Heart, 
      unlocked: userData.daysClean >= 90,
      requirement: "Complete 90 dias consecutivos",
      progress: Math.min(userData.daysClean, 90),
      total: 90
    },
    { 
      id: 6, 
      name: "Inquebravél", 
      icon: Zap, 
      unlocked: userData.daysClean >= 180,
      requirement: "Complete 180 dias consecutivos",
      progress: Math.min(userData.daysClean, 180),
      total: 180
    },
  ];

  const handleMouseMove = (achievementId: number, event: React.MouseEvent) => {
    setHoveredAchievement(achievementId);
    setTooltipPosition({
      x: event.clientX,
      y: event.clientY
    });
  };

  const handleMouseLeave = () => {
    setHoveredAchievement(null);
  };

  const handleTouchStart = (achievementId: number, event: React.TouchEvent) => {
    setHoveredAchievement(achievementId);
    const touch = event.touches[0];
    setTooltipPosition({
      x: touch.clientX,
      y: touch.clientY
    });
  };

  const handleTouchEnd = () => {
    setHoveredAchievement(null);
  };

  return (
    <div className="min-h-screen bg-[#F7FFF7] p-6 pt-12 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1E2D2F] mb-1">Seu Progresso</h1>
          <p className="text-[#4E6E75]">Reconheça cada passo da sua jornada</p>
        </div>

        {/* Gráfico de Evolução do Humor - LINE CHART MELHORADO */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8 border-2 border-[#1A535C]/20">
          <h2 className="text-2xl font-bold text-[#1E2D2F] mb-8 flex items-center gap-2">
            <span className="text-3xl">📈</span>
            Evolução do Humor
          </h2>
          
          <div className="relative h-80">
            {/* Grid lines com valores */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[10, 8, 6, 4, 2, 0].map((value) => (
                <div key={value} className="flex items-center">
                  <span className="text-sm font-bold text-[#1A535C] w-8">{value}</span>
                  <div className="flex-1 h-px bg-[#1A535C]/20 ml-2" />
                </div>
              ))}
            </div>

            {/* SVG Line Chart */}
            <svg className="absolute inset-0 w-full h-full" style={{ paddingLeft: "40px" }}>
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1A535C" />
                  <stop offset="100%" stopColor="#FFC947" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Área preenchida sob a linha */}
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFC947" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#FFC947" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              <polygon
                points={`0%,100% ${moodHistory
                  .map((mood, index) => {
                    const x = (index / (moodHistory.length - 1)) * 100;
                    const y = 100 - (mood / maxMood) * 100;
                    return `${x}%,${y}%`;
                  })
                  .join(" ")} 100%,100%`}
                fill="url(#areaGradient)"
              />
              
              {/* Linha do gráfico */}
              <polyline
                points={moodHistory
                  .map((mood, index) => {
                    const x = (index / (moodHistory.length - 1)) * 100;
                    const y = 100 - (mood / maxMood) * 100;
                    return `${x}%,${y}%`;
                  })
                  .join(" ")}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              />
              
              {/* Círculo APENAS no último ponto (mais recente) */}
              {(() => {
                const lastIndex = moodHistory.length - 1;
                const lastMood = moodHistory[lastIndex];
                const x = (lastIndex / (moodHistory.length - 1)) * 100;
                const y = 100 - (lastMood / maxMood) * 100;
                return (
                  <>
                    <circle
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r="12"
                      fill="#FFC947"
                      opacity="0.3"
                      className="animate-ping"
                    />
                    <circle
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r="8"
                      fill="#FFC947"
                      stroke="#1A535C"
                      strokeWidth="3"
                    />
                  </>
                );
              })()}
            </svg>
          </div>

          <div className="flex justify-between mt-6 px-10">
            {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day) => (
              <span key={day} className="text-sm font-medium text-[#4E6E75]">
                {day}
              </span>
            ))}
          </div>
        </div>

        {/* Conquistas Desbloqueadas */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-[#1A535C]/10 relative">
          <h2 className="text-lg font-bold text-[#1E2D2F] mb-6">Conquistas Desbloqueadas</h2>
          
          <div className="grid grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              const progressPercentage = (achievement.progress / achievement.total) * 100;
              
              return (
                <div
                  key={achievement.id}
                  className="flex flex-col items-center gap-2 relative"
                  onMouseMove={(e) => handleMouseMove(achievement.id, e)}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={(e) => handleTouchStart(achievement.id, e)}
                  onTouchEnd={handleTouchEnd}
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      achievement.unlocked
                        ? "bg-[#1A535C] shadow-lg"
                        : "bg-[#E5E5E5]"
                    }`}
                  >
                    <Icon
                      className={`w-7 h-7 ${
                        achievement.unlocked ? "text-[#FFC947]" : "text-[#9CA3AF]"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs text-center font-medium ${
                      achievement.unlocked ? "text-[#1E2D2F]" : "text-[#9CA3AF]"
                    }`}
                  >
                    {achievement.name}
                  </span>

                  {/* Tooltip Flutuante - APARECE IMEDIATAMENTE NO MOUSE */}
                  {hoveredAchievement === achievement.id && (
                    <div 
                      className="fixed z-50 bg-white rounded-2xl shadow-2xl p-4 border-2 border-[#1A535C]/20 min-w-[220px] max-w-[280px] pointer-events-none"
                      style={{
                        left: `${tooltipPosition.x}px`,
                        top: `${tooltipPosition.y - 20}px`,
                        transform: 'translate(-50%, -100%)',
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          achievement.unlocked ? "bg-[#1A535C]" : "bg-[#E5E5E5]"
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            achievement.unlocked ? "text-[#FFC947]" : "text-[#9CA3AF]"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-[#1E2D2F] text-sm">{achievement.name}</h3>
                          <p className={`text-xs ${achievement.unlocked ? "text-[#1A535C]" : "text-[#9CA3AF]"}`}>
                            {achievement.unlocked ? "Desbloqueada!" : "Bloqueada"}
                          </p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs text-[#4E6E75] mb-2">{achievement.requirement}</p>
                        
                        {/* Barra de Progresso */}
                        <div className="w-full bg-[#E5E5E5] rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-[#1A535C] to-[#FFC947] h-full rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        
                        <p className="text-xs text-[#4E6E75] mt-1 text-right font-medium">
                          {achievement.progress}/{achievement.total}
                        </p>
                      </div>

                      {/* Seta do Tooltip */}
                      <div 
                        className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-[#1A535C] to-[#2a6570] rounded-2xl p-5 shadow-lg">
            <p className="text-white/80 text-sm mb-1">Total Economizado</p>
            <p className="text-2xl font-bold text-[#FFC947]">
              R$ {userData.savedMoney.toFixed(2)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#1A535C] to-[#2a6570] rounded-2xl p-5 shadow-lg">
            <p className="text-white/80 text-sm mb-1">Sequência Atual</p>
            <p className="text-2xl font-bold text-[#FFC947]">
              {userData.daysClean} dias
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
