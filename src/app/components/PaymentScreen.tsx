"use client";

import { Check, Sparkles, Crown, Shield, ChevronLeft } from "lucide-react";

interface PaymentScreenProps {
  quizData: {
    dailySavings: number;
    monthlyLoss: number;
  };
  onComplete: () => void;
  onBack: () => void;
}

export function PaymentScreen({ quizData, onComplete, onBack }: PaymentScreenProps) {
  const recommendedPlan = quizData.monthlyLoss > 200 ? "premium" : "essential";

  const plans = [
    {
      id: "essential",
      name: "Essencial",
      price: 29,
      icon: Shield,
      description: "Perfeito para começar sua jornada",
      features: [
        "Coach Virtual com IA 24/7",
        "Contador de Economia em tempo real",
        "Criador de Metas personalizado",
        "Botão SOS de emergência",
        "Relatórios de progresso semanais",
        "Acesso a comunidade de apoio",
      ],
      color: "from-[#1A535C] to-[#2a6570]",
      recommended: recommendedPlan === "essential",
    },
    {
      id: "premium",
      name: "Premium",
      price: 49,
      icon: Crown,
      description: "Para quem busca transformação completa",
      features: [
        "Tudo do plano Essencial",
        "Interações ilimitadas com Coach IA",
        "Relatórios avançados de progresso",
        "Conteúdo exclusivo (áudios e cursos)",
        "Sessões de meditação guiada",
        "Suporte prioritário",
        "Análise comportamental profunda",
      ],
      color: "from-[#FFC947] to-[#ffb627]",
      recommended: recommendedPlan === "premium",
    },
  ];

  const handleSelectPlan = (planId: string) => {
    // Aqui você integraria com o sistema de pagamento real
    console.log("Plano selecionado:", planId);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F7FFF7] p-6 flex flex-col animate-fadeIn">
      {/* Botão Voltar */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#1A535C] hover:text-[#2a6570] transition-colors duration-300 mb-4 group max-w-md mx-auto w-full"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="font-medium">Voltar ao Diagnóstico</span>
      </button>

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-slideDown">
          <div className="w-16 h-16 bg-gradient-to-br from-[#1A535C] to-[#2a6570] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-[#FFC947]" />
          </div>
          <h1 className="text-3xl font-bold text-[#1E2D2F] mb-2">
            Escolha Seu Plano
          </h1>
          <p className="text-[#4E6E75]">
            Investimento em você mesmo
          </p>
        </div>

        {/* Economia Potencial */}
        <div className="bg-gradient-to-br from-[#1A535C] to-[#2a6570] rounded-2xl p-6 shadow-xl mb-8 animate-slideUp">
          <div className="text-center">
            <p className="text-white/80 text-sm mb-2">Você pode economizar</p>
            <p className="text-4xl font-bold text-[#FFC947] mb-1">
              R$ {(quizData.dailySavings * 30).toFixed(2)}
            </p>
            <p className="text-white/80 text-sm">por mês com o Saldo Mental</p>
          </div>
        </div>

        {/* Planos */}
        <div className="space-y-4 mb-6">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-slideUp ${
                  plan.recommended
                    ? "border-[#FFC947]"
                    : "border-[#1A535C]/20"
                }`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Badge Recomendado */}
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFC947] text-[#1E2D2F] px-4 py-1 rounded-full text-xs font-bold shadow-md animate-bounce">
                    ⭐ Recomendado para você
                  </div>
                )}

                {/* Header do Plano */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1E2D2F]">{plan.name}</h3>
                    <p className="text-sm text-[#4E6E75]">{plan.description}</p>
                  </div>
                </div>

                {/* Preço */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[#1A535C]">R$ {plan.price}</span>
                    <span className="text-[#4E6E75]">/mês</span>
                  </div>
                  <p className="text-xs text-[#4E6E75] mt-1">
                    Apenas {((plan.price / quizData.dailySavings) * 100).toFixed(0)}% da sua economia mensal
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-[#1A535C]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#1A535C]" />
                      </div>
                      <span className="text-sm text-[#1E2D2F]">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Botão de Seleção */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                    plan.recommended
                      ? "bg-gradient-to-r from-[#FFC947] to-[#ffb627] text-[#1E2D2F]"
                      : "bg-[#1A535C] text-white hover:bg-[#2a6570]"
                  }`}
                >
                  {plan.recommended ? "Começar Agora" : "Selecionar Plano"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Garantia */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#1A535C]/10 animate-slideUp" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#1A535C] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[#1E2D2F] mb-1">Garantia de 7 dias</h4>
              <p className="text-sm text-[#4E6E75] leading-relaxed">
                Experimente sem compromisso. Se não for para você, devolvemos 100% do seu investimento.
              </p>
            </div>
          </div>
        </div>

        {/* Nota de Rodapé */}
        <p className="text-xs text-[#4E6E75] text-center mt-6">
          Pagamento seguro • Cancele quando quiser • Suporte 24/7
        </p>
      </div>
    </div>
  );
}
