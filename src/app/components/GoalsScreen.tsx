"use client";

import { useState, useEffect } from "react";
import { Plus, Target, Trash2, Car, Home, Plane, GraduationCap, Heart, Sparkles } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  createdAt: string;
}

interface UserData {
  savedMoney: number;
  goals: Goal[];
}

export function GoalsScreen({ 
  userData, 
  setUserData 
}: { 
  userData: UserData;
  setUserData: (data: any) => void;
}) {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("target");
  const [goals, setGoals] = useState<Goal[]>([]);

  const iconOptions = [
    { value: "target", icon: Target, label: "Meta" },
    { value: "car", icon: Car, label: "Carro" },
    { value: "home", icon: Home, label: "Casa" },
    { value: "plane", icon: Plane, label: "Viagem" },
    { value: "graduation", icon: GraduationCap, label: "Educação" },
    { value: "heart", icon: Heart, label: "Saúde" },
    { value: "sparkles", icon: Sparkles, label: "Sonho" },
  ];

  // Carrega objetivos do localStorage ao montar
  useEffect(() => {
    const savedGoals = localStorage.getItem('userGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Salva objetivos no localStorage sempre que mudar
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem('userGoals', JSON.stringify(goals));
    }
  }, [goals]);

  const handleAddGoal = () => {
    if (!newGoalName.trim() || !newGoalTarget) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      name: newGoalName,
      targetAmount: parseFloat(newGoalTarget),
      currentAmount: userData.savedMoney,
      icon: selectedIcon,
      createdAt: new Date().toISOString(),
    };

    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    localStorage.setItem('userGoals', JSON.stringify(updatedGoals));

    setNewGoalName("");
    setNewGoalTarget("");
    setSelectedIcon("target");
    setShowAddGoal(false);
  };

  const handleDeleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter((g: Goal) => g.id !== goalId);
    setGoals(updatedGoals);
    localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
  };

  const getIconComponent = (iconValue: string) => {
    const option = iconOptions.find(opt => opt.value === iconValue);
    return option ? option.icon : Target;
  };

  return (
    <div className="min-h-screen bg-[#F7FFF7] p-6 pt-12 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1E2D2F] mb-1">Seus Objetivos</h1>
          <p className="text-[#4E6E75]">Transforme seu esforço em recompensas</p>
        </div>

        {/* Recompensa Disponível */}
        <div className="bg-gradient-to-br from-[#1A535C] to-[#2a6570] rounded-3xl p-6 shadow-xl mb-6">
          <p className="text-white/80 text-sm mb-2">Recompensa Disponível</p>
          <p className="text-4xl font-bold text-[#FFC947]">
            R$ {userData.savedMoney.toFixed(2)}
          </p>
          <p className="text-white/70 text-xs mt-2">
            Pronto para investir no seu bem-estar
          </p>
        </div>

        {/* Lista de Objetivos */}
        <div className="space-y-4 mb-6">
          {goals.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-md border border-[#1A535C]/10">
              <Target className="w-12 h-12 text-[#4E6E75] mx-auto mb-3" />
              <p className="text-[#1E2D2F] font-medium mb-1">
                Nenhum objetivo criado ainda
              </p>
              <p className="text-sm text-[#4E6E75]">
                Adicione seu primeiro objetivo e veja seu progresso crescer!
              </p>
            </div>
          ) : (
            goals.map((goal) => {
              const IconComponent = getIconComponent(goal.icon);
              const progress = Math.min((userData.savedMoney / goal.targetAmount) * 100, 100);

              return (
                <div
                  key={goal.id}
                  className="bg-white rounded-2xl p-5 shadow-md border border-[#1A535C]/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#1A535C] rounded-full flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-[#FFC947]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#1E2D2F]">{goal.name}</h3>
                        <p className="text-sm text-[#4E6E75]">
                          Meta: R$ {goal.targetAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-[#4E6E75] hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#4E6E75]">Progresso</span>
                      <span className="font-bold text-[#1A535C]">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-3 bg-[#F7FFF7] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#1A535C] to-[#FFC947] transition-all duration-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-[#4E6E75]">
                      Faltam R$ {Math.max(goal.targetAmount - userData.savedMoney, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Botão Adicionar Objetivo */}
        {!showAddGoal ? (
          <button
            onClick={() => setShowAddGoal(true)}
            className="w-full bg-[#1A535C] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#2a6570] transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Adicionar Novo Objetivo
          </button>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#1A535C]/10">
            <h3 className="text-lg font-bold text-[#1E2D2F] mb-4">Novo Objetivo</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#1E2D2F] mb-2 block">
                  Nome do Objetivo
                </label>
                <input
                  type="text"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  placeholder="Ex: Viagem para Europa"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#1A535C]/20 focus:border-[#1A535C] focus:outline-none text-[#1E2D2F]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#1E2D2F] mb-2 block">
                  Valor do Objetivo (R$)
                </label>
                <input
                  type="number"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#1A535C]/20 focus:border-[#1A535C] focus:outline-none text-[#1E2D2F]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#1E2D2F] mb-2 block">
                  Escolha um Ícone
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {iconOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setSelectedIcon(option.value)}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          selectedIcon === option.value
                            ? "border-[#1A535C] bg-[#1A535C]/5"
                            : "border-[#1A535C]/20 hover:border-[#1A535C]/40"
                        }`}
                      >
                        <Icon className="w-6 h-6 text-[#1A535C] mx-auto" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowAddGoal(false)}
                  className="flex-1 py-3 rounded-xl border-2 border-[#1A535C]/20 text-[#1E2D2F] font-medium hover:bg-[#F7FFF7] transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddGoal}
                  disabled={!newGoalName.trim() || !newGoalTarget}
                  className="flex-1 py-3 rounded-xl bg-[#1A535C] text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2a6570] transition-all"
                >
                  Salvar Objetivo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
