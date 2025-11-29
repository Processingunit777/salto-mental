"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Calendar, Smile, Plus, Target, RotateCcw } from "lucide-react";
import { updateUserData, getUserGoals, updateGoal } from "@/lib/auth-helpers";

interface UserData {
  savedMoney: number;
  daysClean: number;
  mood: number;
  dailySavings: number;
}

interface Goal {
  id: string;
  name: string;
  icon: string;
  target_amount: number;
  current_amount: number;
  created_at: string;
}

export function DashboardScreen({ 
  userData, 
  setUserData,
  userId
}: { 
  userData: UserData;
  setUserData: (data: any) => void;
  userId: string;
}) {
  const moodEmojis = ["😢", "😟", "😐", "🙂", "😊", "😄", "🤩", "🎉", "🌟", "✨"];
  const [showSavingsAnimation, setShowSavingsAnimation] = useState(false);
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [showCustomAmount, setShowCustomAmount] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Carrega objetivos do Supabase
  useEffect(() => {
    loadGoals();
  }, [userId]);

  // Atualiza objetivos periodicamente
  useEffect(() => {
    const interval = setInterval(loadGoals, 2000);
    return () => clearInterval(interval);
  }, [userId]);

  async function loadGoals() {
    const goalsData = await getUserGoals(userId);
    setGoals(goalsData);
  }

  // Carrega o último clique do localStorage ao iniciar
  useEffect(() => {
    const savedLastClick = localStorage.getItem(`lastSavingsClick_${userId}`);
    if (savedLastClick) {
      setLastClickTime(parseInt(savedLastClick));
    }
  }, [userId]);

  // Atualiza o tempo restante a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastClickTime > 0) {
        const now = Date.now();
        const elapsed = now - lastClickTime;
        const twentyFourHours = 24 * 60 * 60 * 1000;
        const remaining = twentyFourHours - elapsed;

        if (remaining > 0) {
          const hours = Math.floor(remaining / (60 * 60 * 1000));
          const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
          setTimeRemaining(`${hours}h ${minutes}m`);
        } else {
          setTimeRemaining("");
          setLastClickTime(0);
          localStorage.removeItem(`lastSavingsClick_${userId}`);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastClickTime, userId]);

  const handleMoodUpdate = async (newMood: number) => {
    setUserData((prev: any) => ({ ...prev, mood: newMood }));
    
    // Atualiza no Supabase
    await updateUserData(userId, { mood: newMood });
    
    // Feedback visual
    const button = document.querySelector(`button[data-mood="${newMood}"]`);
    if (button) {
      button.classList.add('animate-ping');
      setTimeout(() => button.classList.remove('animate-ping'), 500);
    }
  };

  const canClickButton = () => {
    if (lastClickTime === 0) return true;
    const now = Date.now();
    const elapsed = now - lastClickTime;
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return elapsed >= twentyFourHours;
  };

  const handleAddSavings = async () => {
    if (!canClickButton()) return;

    const dailySavingsAmount = userData.dailySavings || 0;
    const newSavedAmount = userData.savedMoney + dailySavingsAmount;
    const newDaysClean = userData.daysClean + 1;
    
    // Atualiza userData localmente
    setUserData((prev: any) => ({
      ...prev,
      savedMoney: newSavedAmount,
      daysClean: newDaysClean,
    }));

    // Atualiza no Supabase
    const now = new Date().toISOString();
    await updateUserData(userId, {
      saved_money: newSavedAmount,
      days_clean: newDaysClean,
      last_savings_click: now,
    });

    // Atualiza TODAS as metas existentes adicionando o valor da economia diária
    if (goals.length > 0) {
      for (const goal of goals) {
        const newAmount = goal.current_amount + dailySavingsAmount;
        await updateGoal(goal.id, {
          current_amount: newAmount,
        });
      }
      // Recarrega objetivos
      await loadGoals();
    }

    const nowTimestamp = Date.now();
    setLastClickTime(nowTimestamp);
    localStorage.setItem(`lastSavingsClick_${userId}`, nowTimestamp.toString());
    
    setShowSavingsAnimation(true);
    setTimeout(() => setShowSavingsAnimation(false), 1000);
  };

  const handleAddCustomAmount = async () => {
    const amount = parseFloat(customAmount);
    if (amount > 0) {
      const newSavedAmount = userData.savedMoney + amount;
      
      setUserData((prev: any) => ({
        ...prev,
        savedMoney: newSavedAmount,
      }));

      // Atualiza no Supabase
      await updateUserData(userId, {
        saved_money: newSavedAmount,
      });

      setShowSavingsAnimation(true);
      setTimeout(() => setShowSavingsAnimation(false), 1000);
      setCustomAmount("");
      setShowCustomAmount(false);
    }
  };

  const handleResetBalance = async () => {
    setUserData((prev: any) => ({
      ...prev,
      savedMoney: 0,
    }));

    // Atualiza no Supabase
    await updateUserData(userId, {
      saved_money: 0,
    });

    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-[#F7FFF7] p-6 pt-12">
      <div className="max-w-md mx-auto">
        {/* Header com Logo */}
        <div className="mb-8 animate-slideDown">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/29d8e322-e64d-4808-a5e6-1eab5edce914.png" 
              alt="Saldo Mental Logo" 
              className="h-12 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-[#1E2D2F] mb-1">Meu Progresso</h1>
          <p className="text-[#4E6E75]">Seu progresso hoje</p>
        </div>

        {/* Card Principal - Investimento em Você */}
        <div className={`bg-white rounded-3xl p-8 shadow-xl mb-6 border border-[#1A535C]/10 transition-all duration-500 ${
          showSavingsAnimation ? 'scale-105 shadow-2xl' : ''
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#1A535C] rounded-full flex items-center justify-center animate-pulse">
              <TrendingUp className="w-5 h-5 text-[#FFC947]" />
            </div>
            <span className="text-sm font-medium text-[#4E6E75] uppercase tracking-wide">
              Investimento em Você
            </span>
          </div>
          <p className={`text-6xl font-bold text-[#FFC947] mb-2 transition-all duration-500 ${
            showSavingsAnimation ? 'scale-110' : ''
          }`}>
            {userData.daysClean} Dias
          </p>
          <p className="text-sm text-[#4E6E75] mb-4">
            Seu esforço em ação
          </p>
          
          {/* Botão de adicionar economia (24 horas) */}
          <button
            onClick={handleAddSavings}
            disabled={!canClickButton()}
            className={`w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transform transition-all duration-300 shadow-md mb-3 ${
              canClickButton() 
                ? 'bg-[#1A535C] text-white hover:bg-[#2a6570] hover:scale-105' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
            {canClickButton() 
              ? 'Registrar Conquista de Hoje' 
              : `Disponível em ${timeRemaining}`}
          </button>

          {/* Botão para adicionar valor customizado */}
          {!showCustomAmount ? (
            <button
              onClick={() => setShowCustomAmount(true)}
              className="w-full bg-[#FFC947] text-[#1E2D2F] py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#ffb627] transform hover:scale-105 transition-all duration-300 shadow-md"
            >
              <Plus className="w-4 h-4" />
              Marcar um Marco
            </button>
          ) : (
            <div className="space-y-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1E2D2F] font-bold">
                  R$
                </span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#1A535C]/20 focus:border-[#1A535C] outline-none text-lg font-medium text-[#1E2D2F]"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddCustomAmount}
                  className="flex-1 bg-[#1A535C] text-white py-2 rounded-lg font-medium text-sm hover:bg-[#2a6570] transition-all duration-300"
                >
                  Adicionar
                </button>
                <button
                  onClick={() => {
                    setShowCustomAmount(false);
                    setCustomAmount("");
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium text-sm hover:bg-gray-300 transition-all duration-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Botão de Reset do Saldo */}
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full mt-3 text-red-500 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4" />
              Reiniciar Saldo
            </button>
          ) : (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-red-600 text-center font-medium">
                Tem certeza? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleResetBalance}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium text-sm hover:bg-red-600 transition-all duration-300"
                >
                  Sim, Reiniciar
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium text-sm hover:bg-gray-300 transition-all duration-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Seção de Objetivos - APENAS VISUALIZAÇÃO COM ÍCONES */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#1A535C]/10 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-[#1A535C]" />
            <h3 className="text-lg font-bold text-[#1E2D2F]">Meus Objetivos</h3>
          </div>

          {goals.length === 0 ? (
            <p className="text-sm text-[#4E6E75] text-center py-4">
              Nenhum objetivo criado ainda. Vá para a aba "Objetivos" para adicionar!
            </p>
          ) : (
            <div className="space-y-3">
              {goals.map(goal => {
                const progress = (goal.current_amount / goal.target_amount) * 100;
                const isCompleted = goal.current_amount >= goal.target_amount;

                return (
                  <div key={goal.id} className="border border-[#1A535C]/10 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{goal.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-[#1E2D2F]">{goal.name}</h4>
                        </div>
                        <div className="flex justify-between text-sm text-[#4E6E75]">
                          <span>R$ {goal.current_amount.toFixed(2)}</span>
                          <span>R$ {goal.target_amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          isCompleted ? 'bg-green-500' : 'bg-[#FFC947]'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    
                    {isCompleted && (
                      <p className="text-xs text-green-600 font-bold mt-2 text-center">
                        🎉 Objetivo Concluído!
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cards Secundários */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Dias de Conquista */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-[#1A535C]/10 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-[#1A535C]" />
              <span className="text-xs text-[#4E6E75] font-medium">Dias de Conquista</span>
            </div>
            <p className="text-3xl font-bold text-[#1E2D2F]">
              {userData.daysClean}
            </p>
            <p className="text-xs text-[#4E6E75] mt-1">dias consecutivos</p>
          </div>

          {/* Check-in de Humor */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-[#1A535C]/10 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-2 mb-3">
              <Smile className="w-4 h-4 text-[#1A535C]" />
              <span className="text-xs text-[#4E6E75] font-medium">Como está?</span>
            </div>
            <p className="text-3xl font-bold text-[#1E2D2F]">
              {moodEmojis[userData.mood - 1] || "😊"}
            </p>
            <p className="text-xs text-[#4E6E75] mt-1">humor atual</p>
          </div>
        </div>

        {/* Check-in de Humor Interativo */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#1A535C]/10 mb-6 hover:shadow-lg transition-all duration-300">
          <h3 className="text-sm font-medium text-[#1E2D2F] mb-4">
            Como você está se sentindo agora?
          </h3>
          <div className="flex justify-between items-center gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <button
                key={level}
                data-mood={level}
                onClick={() => handleMoodUpdate(level)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                  userData.mood === level
                    ? "bg-[#1A535C] scale-110 shadow-lg"
                    : "bg-[#F7FFF7] hover:bg-[#1A535C]/10 hover:scale-110"
                }`}
              >
                {moodEmojis[level - 1]}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-2 px-1">
            <span className="text-xs text-[#4E6E75]">Difícil</span>
            <span className="text-xs text-[#4E6E75]">Excelente</span>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#1A535C]/10 mb-6 hover:shadow-lg transition-all duration-300">
          <h3 className="text-sm font-medium text-[#1E2D2F] mb-4">
            📊 Suas Conquistas
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4E6E75]">Economia por dia</span>
              <span className="text-sm font-bold text-[#1A535C]">
                R$ {(userData.savedMoney / (userData.daysClean || 1)).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4E6E75]">Projeção mensal</span>
              <span className="text-sm font-bold text-[#1A535C]">
                R$ {((userData.savedMoney / (userData.daysClean || 1)) * 30).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4E6E75]">Projeção anual</span>
              <span className="text-sm font-bold text-[#FFC947]">
                R$ {((userData.savedMoney / (userData.daysClean || 1)) * 365).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Mensagem Motivacional */}
        <div className="bg-gradient-to-br from-[#1A535C] to-[#2a6570] rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
          <h3 className="text-white font-bold text-lg mb-2">
            💪 Continue assim!
          </h3>
          <p className="text-white/90 text-sm leading-relaxed">
            Cada dia é uma vitória. Você está construindo um futuro melhor, 
            um passo de cada vez. Já economizou R$ {userData.savedMoney.toFixed(2)}!
          </p>
        </div>
      </div>
    </div>
  );
}
