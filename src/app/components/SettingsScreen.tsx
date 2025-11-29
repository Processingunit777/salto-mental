"use client";

import { Bell, Shield, CreditCard, HelpCircle, LogOut, ChevronRight } from "lucide-react";

export function SettingsScreen() {
  return (
    <div className="min-h-screen bg-[#F7FFF7] p-6 pt-12 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1E2D2F] mb-1">Configurações</h1>
          <p className="text-[#4E6E75]">Gerencie sua conta</p>
        </div>

        {/* Plano Atual */}
        <div className="bg-gradient-to-br from-[#1A535C] to-[#2a6570] rounded-3xl p-6 shadow-xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm mb-1">Plano Atual</p>
              <p className="text-2xl font-bold text-[#FFC947]">Essencial</p>
            </div>
            <CreditCard className="w-8 h-8 text-[#FFC947]" />
          </div>
          <p className="text-white/90 text-sm mb-4">
            R$ 29,00/mês • Renovação em 15 dias
          </p>
          <button className="w-full bg-[#FFC947] text-[#1E2D2F] py-3 rounded-xl font-bold hover:bg-[#ffb627] transition-all">
            Fazer Upgrade para Premium
          </button>
        </div>

        {/* Opções de Configuração */}
        <div className="bg-white rounded-2xl shadow-md border border-[#1A535C]/10 mb-6 overflow-hidden">
          <button className="w-full p-4 flex items-center justify-between hover:bg-[#F7FFF7] transition-all border-b border-[#1A535C]/10">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#1A535C]" />
              <span className="text-[#1E2D2F] font-medium">Notificações</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#4E6E75]" />
          </button>

          <button className="w-full p-4 flex items-center justify-between hover:bg-[#F7FFF7] transition-all border-b border-[#1A535C]/10">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#1A535C]" />
              <span className="text-[#1E2D2F] font-medium">Privacidade e Segurança</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#4E6E75]" />
          </button>

          <button className="w-full p-4 flex items-center justify-between hover:bg-[#F7FFF7] transition-all">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-[#1A535C]" />
              <span className="text-[#1E2D2F] font-medium">Ajuda e Suporte</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#4E6E75]" />
          </button>
        </div>

        {/* Comparação de Planos */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#1A535C]/10 mb-6">
          <h3 className="text-lg font-bold text-[#1E2D2F] mb-4">Compare os Planos</h3>
          
          <div className="space-y-4">
            <div className="border-2 border-[#1A535C]/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-[#1E2D2F]">Essencial</h4>
                <span className="text-[#1A535C] font-bold">R$ 29/mês</span>
              </div>
              <ul className="space-y-2 text-sm text-[#4E6E75]">
                <li>✓ Contador de Economia</li>
                <li>✓ Criador de Metas</li>
                <li>✓ Acompanhamento de Humor</li>
                <li>✓ Coach Virtual (5 msgs/dia)</li>
                <li>✓ Botão SOS</li>
              </ul>
            </div>

            <div className="border-2 border-[#FFC947] rounded-xl p-4 bg-[#FFC947]/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[#1E2D2F]">Premium</h4>
                  <span className="text-xs bg-[#FFC947] text-[#1E2D2F] px-2 py-1 rounded-full font-bold">
                    RECOMENDADO
                  </span>
                </div>
                <span className="text-[#1A535C] font-bold">R$ 49/mês</span>
              </div>
              <ul className="space-y-2 text-sm text-[#4E6E75]">
                <li>✓ Tudo do Essencial</li>
                <li>✓ Coach Virtual Ilimitado</li>
                <li>✓ Relatórios Avançados</li>
                <li>✓ Trilhas de Áudio Exclusivas</li>
                <li>✓ Cursos de Bem-Estar</li>
                <li>✓ Suporte Prioritário</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Aviso Legal */}
        <div className="bg-[#FFC947]/10 rounded-2xl p-4 mb-6 border border-[#FFC947]/30">
          <p className="text-xs text-[#1E2D2F] leading-relaxed">
            <strong>Aviso Legal:</strong> Este aplicativo é uma ferramenta de suporte e bem-estar. 
            Ele não substitui o diagnóstico ou tratamento por um psicólogo ou psiquiatra. 
            Se você está em crise ou acredita que pode machucar a si mesmo ou a outros, 
            por favor, procure ajuda profissional de emergência ou ligue para o CVV (188).
          </p>
        </div>

        {/* Botão Sair */}
        <button className="w-full p-4 rounded-xl border-2 border-red-500/20 text-red-500 font-medium flex items-center justify-center gap-2 hover:bg-red-50 transition-all">
          <LogOut className="w-5 h-5" />
          Sair da Conta
        </button>
      </div>
    </div>
  );
}
