"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, AlertCircle, DollarSign, Sparkles, Gift, CreditCard, Heart, Cloud, RotateCcw } from "lucide-react";

interface QuizData {
  // Bloco 1: Dados de Contato
  name: string;
  age: number;
  email: string;
  phone: string;
  countryCode: string;
  
  // Blocos 2 e 3: Pontuação
  score: number;
  
  // Bloco 4 e 5: Hábito (condicional) - NÃO AFETA PONTUAÇÃO
  hasHabit: boolean;
  habitType?: string;
  habitFrequency?: string;
  habitMonthlySpending?: number;
  habitDuration?: string;
}

// Histórico de pontos para reversão
interface PointsHistory {
  step: number;
  points: number;
}

// Detectar launcher (PlayStore, AppStore, ou Web/Dev)
const detectLauncher = (): 'playstore' | 'appstore' | 'web' => {
  if (typeof window === 'undefined') return 'web';
  
  const userAgent = navigator.userAgent || navigator.vendor;
  
  // Detectar iOS/AppStore
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return 'appstore';
  }
  
  // Detectar Android/PlayStore
  if (/android/i.test(userAgent)) {
    return 'playstore';
  }
  
  // Web ou Dev (pula pagamento)
  return 'web';
};

// Componente de Parede de Pagamento
function PaymentWall({ 
  plan, 
  onBack, 
  onComplete 
}: { 
  plan: 'premium' | 'basic' | 'trial';
  onBack: () => void;
  onComplete: (data: any) => void;
}) {
  const [launcher, setLauncher] = useState<'playstore' | 'appstore' | 'web'>('web');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const detectedLauncher = detectLauncher();
    setLauncher(detectedLauncher);
    
    // Se for web/dev, pula automaticamente após 1 segundo
    if (detectedLauncher === 'web') {
      const timer = setTimeout(() => {
        onComplete({ plan, skipped: true, paymentCompleted: true });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simular processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (launcher === 'playstore') {
      // Integração com Google Play Billing
      // window.AndroidBridge?.initiatePurchase(plan);
      console.log('Iniciando compra via Google Play:', plan);
    } else if (launcher === 'appstore') {
      // Integração com Apple StoreKit
      // window.webkit?.messageHandlers.purchase.postMessage({ plan });
      console.log('Iniciando compra via App Store:', plan);
    }
    
    setIsProcessing(false);
    onComplete({ plan, paid: true, paymentCompleted: true });
  };

  // Versão de desenvolvedor - pula automaticamente (SEM TELA VISÍVEL)
  if (launcher === 'web') {
    return null; // Não renderiza nada, apenas redireciona
  }

  const planDetails = {
    premium: { name: 'Premium', price: 'R$ 49,90', color: '#FFC947' },
    basic: { name: 'Básico', price: 'R$ 29,90', color: '#4E6E75' },
    trial: { name: 'Teste Grátis', price: 'R$ 0,00', color: '#1A535C' }
  };

  const currentPlan = planDetails[plan];

  return (
    <div className="min-h-screen bg-[#F7FFF7] p-6 flex flex-col animate-fadeIn">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#1A535C] hover:text-[#2a6570] transition-colors duration-300 mb-4 group max-w-md mx-auto w-full"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="font-medium">Voltar</span>
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="text-center mb-8 animate-slideDown">
          <div className="w-20 h-20 bg-gradient-to-br from-[#1A535C] to-[#2a6570] rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <CreditCard className="w-10 h-10 text-[#FFC947]" />
          </div>
          <h1 className="text-3xl font-bold text-[#1E2D2F] mb-2">
            Finalizar Assinatura
          </h1>
          <p className="text-[#4E6E75] text-lg">
            Plano {currentPlan.name} - {currentPlan.price}/mês
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl mb-6 animate-slideUp">
          <div className="text-center mb-6">
            <p className="text-[#4E6E75] mb-4">
              {launcher === 'playstore' 
                ? 'Você será redirecionado para o Google Play para concluir a compra.'
                : 'Você será redirecionado para a App Store para concluir a compra.'}
            </p>
            <div className="flex items-center justify-center gap-3 mb-6">
              {launcher === 'playstore' ? (
                <div className="text-5xl">📱</div>
              ) : (
                <div className="text-5xl">🍎</div>
              )}
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-[#1A535C] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#2a6570] transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processando...
              </>
            ) : (
              <>
                Continuar para {launcher === 'playstore' ? 'Google Play' : 'App Store'}
              </>
            )}
          </button>

          <p className="text-xs text-[#4E6E75] text-center mt-4">
            Pagamento seguro via {launcher === 'playstore' ? 'Google Play' : 'App Store'}
          </p>
        </div>
      </div>
    </div>
  );
}

export function OnboardingQuiz({ onComplete }: { onComplete: (data: any) => void }) {
  const [step, setStep] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [showPremiumOffer, setShowPremiumOffer] = useState(false);
  const [showBasicOffer, setShowBasicOffer] = useState(false);
  const [showFinalOffer, setShowFinalOffer] = useState(false);
  const [showPaymentWall, setShowPaymentWall] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'basic' | 'trial'>('premium');
  const [emailError, setEmailError] = useState("");
  const [pointsHistory, setPointsHistory] = useState<PointsHistory[]>([]);
  const [quizData, setQuizData] = useState<QuizData>({
    name: "",
    age: 0,
    email: "",
    phone: "",
    countryCode: "+55",
    score: 50, // Pontuação inicial
    hasHabit: false,
  });

  const questions = [
    // BLOCO 1: DADOS DE CONTATO
    {
      id: "name",
      block: 1,
      title: "Qual é o seu nome?",
      subtitle: "Vamos começar nos conhecendo",
      type: "text-input",
      placeholder: "Digite seu nome completo",
    },
    {
      id: "age",
      block: 1,
      title: "Qual é a sua idade?",
      subtitle: "Isso nos ajuda a personalizar sua experiência",
      type: "number-input",
      placeholder: "Digite sua idade",
    },
    {
      id: "email",
      block: 1,
      title: "Qual é o seu e-mail?",
      subtitle: "Para manter contato e enviar seu progresso",
      type: "email-input",
      placeholder: "seu@email.com",
    },
    {
      id: "phone",
      block: 1,
      title: "Qual é o seu telefone?",
      subtitle: "Opcional, mas útil para suporte",
      type: "phone-input",
      placeholder: "00000-0000",
    },
    
    // BLOCO 2: BEM-ESTAR GERAL
    {
      id: "sleep",
      block: 2,
      title: "Com que frequência você se sente descansado(a) ao acordar?",
      subtitle: "Seja honesto sobre seu descanso",
      type: "scale",
      options: [
        { value: 1, label: "Nunca", points: -10 },
        { value: 2, label: "Raramente", points: -5 },
        { value: 3, label: "Às vezes", points: 0 },
        { value: 4, label: "Frequentemente", points: 5 },
        { value: 5, label: "Sempre", points: 10 },
      ],
    },
    {
      id: "relationships",
      block: 2,
      title: "Qual o seu nível de satisfação com seus relacionamentos?",
      subtitle: "Familiar, social, amoroso",
      type: "scale",
      options: [
        { value: 1, label: "Muito Insatisfeito", points: -10 },
        { value: 2, label: "Insatisfeito", points: -5 },
        { value: 3, label: "Neutro", points: 0 },
        { value: 4, label: "Satisfeito", points: 5 },
        { value: 5, label: "Muito Satisfeito", points: 10 },
      ],
    },
    {
      id: "motivation",
      block: 2,
      title: "Com que frequência você se sente motivado(a) e com um propósito claro?",
      subtitle: "Pense no seu dia a dia",
      type: "scale",
      options: [
        { value: 1, label: "Nunca", points: -10 },
        { value: 2, label: "Raramente", points: -5 },
        { value: 3, label: "Às vezes", points: 0 },
        { value: 4, label: "Frequentemente", points: 5 },
        { value: 5, label: "Sempre", points: 10 },
      ],
    },
    
    // BLOCO 3: PILARES DA SAÚDE
    {
      id: "stress",
      block: 3,
      title: "Com que frequência você se sente sobrecarregado(a) ou incapaz de relaxar?",
      subtitle: "Pense na última semana",
      type: "scale",
      options: [
        { value: 1, label: "Diariamente", points: -10 },
        { value: 2, label: "Semanalmente", points: -5 },
        { value: 3, label: "Mensalmente", points: 0 },
        { value: 4, label: "Raramente", points: 5 },
        { value: 5, label: "Nunca", points: 10 },
      ],
    },
    {
      id: "support",
      block: 3,
      title: "Você tem pessoas em quem confia para compartilhar seus problemas?",
      subtitle: "Rede de apoio é fundamental",
      type: "scale",
      options: [
        { value: 1, label: "Não", points: -10 },
        { value: 2, label: "Poucas", points: -5 },
        { value: 3, label: "Algumas", points: 0 },
        { value: 4, label: "Sim, várias", points: 5 },
        { value: 5, label: "Sim, sempre", points: 10 },
      ],
    },
    
    // BLOCO 4: FILTRO DE HÁBITO
    {
      id: "hasHabit",
      block: 4,
      title: "Você sente que perde o controle sobre o uso de alguma substância ou comportamento?",
      subtitle: "Ex: jogos, internet, álcool, compras",
      type: "yes-no",
    },
  ];

  // Perguntas condicionais do BLOCO 5 (só aparecem se hasHabit = true)
  // IMPORTANTE: Estas perguntas NÃO afetam a pontuação de saúde mental
  const habitQuestions = [
    {
      id: "habitType",
      block: 5,
      title: "Qual o tipo de hábito?",
      subtitle: "Selecione o que mais se aplica",
      type: "options",
      options: [
        { value: "alcohol", label: "Álcool" },
        { value: "drugs", label: "Drogas" },
        { value: "gambling", label: "Jogos/Apostas" },
        { value: "internet", label: "Internet/Redes Sociais" },
        { value: "shopping", label: "Compras Compulsivas" },
        { value: "other", label: "Outro" },
      ],
    },
    {
      id: "habitFrequency",
      block: 5,
      title: "Frequência de uso/prática?",
      subtitle: "Com que frequência você pratica esse hábito?",
      type: "options",
      options: [
        { value: "daily", label: "Diariamente" },
        { value: "weekly", label: "Semanalmente" },
        { value: "monthly", label: "Mensalmente" },
      ],
    },
    {
      id: "habitMonthlySpending",
      block: 5,
      title: "Gasto mensal aproximado com o hábito?",
      subtitle: "Seja o mais preciso possível",
      type: "number-input",
      placeholder: "Ex: 500.00",
      prefix: "R$",
    },
    {
      id: "habitDuration",
      block: 5,
      title: "Há quanto tempo pratica o hábito?",
      subtitle: "Isso nos ajuda a entender melhor",
      type: "options",
      options: [
        { value: "less6months", label: "Menos de 6 meses" },
        { value: "6to12months", label: "6 meses a 1 ano" },
        { value: "moreThan1year", label: "Mais de 1 ano" },
      ],
    },
  ];

  // Determina as perguntas a exibir
  const allQuestions = quizData.hasHabit 
    ? [...questions, ...habitQuestions]
    : questions;

  // Validação de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAnswer = (value: any, points?: number) => {
    const currentQuestion = allQuestions[step];
    
    // Validação de email
    if (currentQuestion.id === "email") {
      if (!validateEmail(value)) {
        setEmailError("Por favor, insira um e-mail válido (ex: seu@email.com)");
        return;
      }
      setEmailError("");
    }
    
    // Atualiza os dados do quiz
    const updates: any = {};
    
    if (currentQuestion.id === "name") updates.name = value;
    else if (currentQuestion.id === "age") updates.age = parseInt(value);
    else if (currentQuestion.id === "email") updates.email = value;
    else if (currentQuestion.id === "phone") updates.phone = value;
    else if (currentQuestion.id === "hasHabit") {
      updates.hasHabit = value === "yes";
      
      // CORREÇÃO: Se respondeu "sim", atualiza estado e avança
      setQuizData(prev => ({ ...prev, ...updates }));
      
      // Se respondeu "sim", avança para as perguntas extras
      if (value === "yes") {
        setTimeout(() => setStep(step + 1), 150);
      } else {
        // Se respondeu "não", pula para o relatório
        setTimeout(() => setShowReport(true), 150);
      }
      return;
    }
    else if (currentQuestion.id === "habitType") updates.habitType = value;
    else if (currentQuestion.id === "habitFrequency") updates.habitFrequency = value;
    else if (currentQuestion.id === "habitMonthlySpending") updates.habitMonthlySpending = parseFloat(value);
    else if (currentQuestion.id === "habitDuration") updates.habitDuration = value;
    
    // Adiciona pontos APENAS se for uma pergunta de escala dos Blocos 2 e 3
    if (points !== undefined) {
      updates.score = quizData.score + points;
      // Salva no histórico para reversão
      setPointsHistory(prev => [...prev, { step, points }]);
    }
    
    setQuizData(prev => ({ ...prev, ...updates }));

    // Avança para próxima pergunta ou mostra relatório
    if (step < allQuestions.length - 1) {
      setTimeout(() => setStep(step + 1), 150);
    } else {
      setTimeout(() => setShowReport(true), 150);
    }
  };

  const handleBack = () => {
    if (showPaymentWall) {
      setShowPaymentWall(false);
      if (selectedPlan === 'trial') {
        setShowFinalOffer(true);
      } else if (selectedPlan === 'basic') {
        setShowBasicOffer(true);
      } else {
        setShowPremiumOffer(true);
      }
      return;
    }
    
    if (showFinalOffer) {
      setShowFinalOffer(false);
      setShowBasicOffer(true);
      return;
    }
    
    if (showBasicOffer) {
      setShowBasicOffer(false);
      setShowPremiumOffer(true);
      return;
    }
    
    if (showPremiumOffer) {
      setShowPremiumOffer(false);
      setShowReport(true);
      return;
    }
    
    if (showReport) {
      setShowReport(false);
      return;
    }
    
    if (step > 0) {
      // Reverte pontos se voltar de uma pergunta com pontuação
      const lastPointEntry = pointsHistory.find(entry => entry.step === step - 1);
      if (lastPointEntry) {
        setQuizData(prev => ({
          ...prev,
          score: prev.score - lastPointEntry.points
        }));
        setPointsHistory(prev => prev.filter(entry => entry.step !== step - 1));
      }
      
      setStep(step - 1);
    }
  };

  const handleRestartQuiz = () => {
    // Reseta tudo
    setStep(0);
    setShowReport(false);
    setShowPremiumOffer(false);
    setShowBasicOffer(false);
    setShowFinalOffer(false);
    setShowPaymentWall(false);
    setPointsHistory([]);
    setQuizData({
      name: "",
      age: 0,
      email: "",
      phone: "",
      countryCode: "+55",
      score: 50,
      hasHabit: false,
    });
  };

  const calculateFinalScore = () => {
    // A pontuação final é APENAS baseada nos Blocos 2 e 3
    // O Bloco 5 (hábitos) NÃO afeta a pontuação de saúde mental
    let finalScore = quizData.score;
    
    // Limita entre 0 e 100
    return Math.max(0, Math.min(100, finalScore));
  };

  const handlePlanSelection = (plan: 'premium' | 'basic' | 'trial') => {
    setSelectedPlan(plan);
    setShowPaymentWall(true);
  };

  const handlePaymentComplete = (paymentData: any) => {
    onComplete({ 
      finalScore: calculateFinalScore(),
      dailySavings: quizData.habitMonthlySpending ? quizData.habitMonthlySpending / 30 : 0,
      quizData,
      paymentCompleted: true,
      ...paymentData
    });
  };

  // Função para determinar ícone e mensagem baseado na pontuação
  const getEmotionalState = (score: number) => {
    if (score >= 70) {
      return {
        icon: <Heart className="w-16 h-16 text-emerald-500" />,
        gradient: "from-emerald-400 to-teal-500",
        title: "Seu Nível de Energia Emocional",
        message: "Seu coração está vibrante e cheio de energia! Continue cultivando esse bem-estar.",
        support: "Continue assim! Você está no caminho certo para uma vida plena e equilibrada."
      };
    } else if (score >= 50) {
      return {
        icon: <Cloud className="w-16 h-16 text-amber-500" />,
        gradient: "from-amber-400 to-orange-500",
        title: "Seu Nível de Energia Emocional",
        message: "Seu coração está em equilíbrio, mas há espaço para mais luz e cuidado.",
        support: "Lembre-se: pequenos passos diários fazem grande diferença. Estamos aqui para te apoiar."
      };
    } else if (score >= 30) {
      return {
        icon: (
          <svg className="w-16 h-16 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
            <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3" />
          </svg>
        ),
        gradient: "from-slate-400 to-slate-600",
        title: "Seu Nível de Energia Emocional",
        message: "Seu coração está pedindo um pouco mais de atenção e cuidado neste momento.",
        support: "Lembre-se: pedir ajuda é um ato de coragem. Estamos aqui para te guiar."
      };
    } else {
      return {
        icon: (
          <svg className="w-16 h-16 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" opacity="0.3" />
            <path d="M12 8l-1 1-1-1m4 0l-1 1-1-1" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        ),
        gradient: "from-rose-400 to-red-500",
        title: "Seu Nível de Energia Emocional",
        message: "Seu coração precisa de cuidado especial e atenção urgente neste momento.",
        support: "Lembre-se: pedir ajuda é um ato de coragem. Estamos aqui para te guiar e apoiar."
      };
    }
  };

  // Parede de Pagamento
  if (showPaymentWall) {
    return (
      <PaymentWall 
        plan={selectedPlan}
        onBack={handleBack}
        onComplete={handlePaymentComplete}
      />
    );
  }

  // Tela de Oferta Final (7 dias grátis ou 50% desconto)
  if (showFinalOffer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A535C] to-[#2a6570] p-6 flex flex-col animate-fadeIn">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300 mb-4 group max-w-md mx-auto w-full"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Voltar</span>
        </button>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="text-center mb-8 animate-slideDown">
            <div className="w-20 h-20 bg-[#FFC947] rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <Gift className="w-10 h-10 text-[#1A535C]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              🎁 Última Chance Especial!
            </h1>
            <p className="text-white/90 text-lg">
              Não perca esta oportunidade única
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl mb-6 animate-slideUp">
            <div className="text-center mb-6">
              <div className="inline-block bg-[#FFC947] text-[#1A535C] px-4 py-2 rounded-full font-bold text-sm mb-4">
                OFERTA LIMITADA
              </div>
              <h2 className="text-2xl font-bold text-[#1E2D2F] mb-2">
                Teste Grátis por 7 Dias
              </h2>
              <p className="text-[#4E6E75] mb-4">
                Experimente todos os recursos Premium sem compromisso
              </p>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-4xl font-bold text-[#1A535C]">R$ 0,00</span>
              </div>
              <p className="text-sm text-[#4E6E75]">
                Depois apenas R$ 29,90/mês (cancele quando quiser)
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#1A535C] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-[#1E2D2F] text-sm">Acesso completo por 7 dias</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#1A535C] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-[#1E2D2F] text-sm">Sem cartão de crédito necessário</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#1A535C] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-[#1E2D2F] text-sm">Cancele a qualquer momento</p>
              </div>
            </div>

            <button
              onClick={() => handlePlanSelection('trial')}
              className="w-full bg-[#1A535C] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#2a6570] transform hover:scale-105 transition-all duration-300 mb-3"
            >
              Começar Teste Grátis
            </button>

            <button
              onClick={() => onComplete({ 
                finalScore: calculateFinalScore(),
                dailySavings: quizData.habitMonthlySpending ? quizData.habitMonthlySpending / 30 : 0,
                quizData,
                plan: "free",
                paymentCompleted: true
              })}
              className="w-full text-[#4E6E75] py-3 rounded-xl font-medium hover:text-[#1E2D2F] transition-colors duration-300"
            >
              Continuar com versão gratuita
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tela de Oferta Básica (R$ 29,90)
  if (showBasicOffer) {
    return (
      <div className="min-h-screen bg-[#F7FFF7] p-6 flex flex-col animate-fadeIn">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-[#1A535C] hover:text-[#2a6570] transition-colors duration-300 mb-4 group max-w-md mx-auto w-full"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Voltar</span>
        </button>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="text-center mb-8 animate-slideDown">
            <h1 className="text-3xl font-bold text-[#1E2D2F] mb-2">
              Tudo bem, entendemos! 😊
            </h1>
            <p className="text-[#4E6E75] text-lg">
              Que tal começar com um investimento menor?
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-[#FFC947] mb-6 animate-slideUp">
            <div className="text-center mb-6">
              <div className="inline-block bg-[#FFC947] text-[#1A535C] px-4 py-2 rounded-full font-bold text-sm mb-4">
                PLANO BÁSICO
              </div>
              <h2 className="text-2xl font-bold text-[#1E2D2F] mb-2">
                Comece sua jornada
              </h2>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-4xl font-bold text-[#1A535C]">R$ 29,90</span>
                <span className="text-[#4E6E75]">/mês</span>
              </div>
              <p className="text-sm text-[#4E6E75] mb-4">
                Apenas <span className="font-bold text-[#1A535C]">R$ 0,99 por dia</span> ☕
              </p>
              <p className="text-[#4E6E75]">
                Menos que um café por dia para transformar sua vida
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#1A535C] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-[#1E2D2F] text-sm">Controle de hábitos essencial</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#1A535C] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-[#1E2D2F] text-sm">Acompanhamento de economia</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#1A535C] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-[#1E2D2F] text-sm">Metas personalizadas</p>
              </div>
            </div>

            <button
              onClick={() => handlePlanSelection('basic')}
              className="w-full bg-[#1A535C] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#2a6570] transform hover:scale-105 transition-all duration-300 mb-3"
            >
              Sim, este valor é ideal para começar
            </button>

            <button
              onClick={() => setShowFinalOffer(true)}
              className="w-full text-[#4E6E75] py-3 rounded-xl font-medium hover:text-[#1E2D2F] transition-colors duration-300"
            >
              Não, prefiro continuar com a versão gratuita
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tela de Oferta Premium (R$ 49,90)
  if (showPremiumOffer) {
    return (
      <div className="min-h-screen bg-[#F7FFF7] p-6 flex flex-col animate-fadeIn">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-[#1A535C] hover:text-[#2a6570] transition-colors duration-300 mb-4 group max-w-md mx-auto w-full"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Voltar</span>
        </button>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="text-center mb-8 animate-slideDown">
            <div className="w-20 h-20 bg-gradient-to-br from-[#1A535C] to-[#2a6570] rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Sparkles className="w-10 h-10 text-[#FFC947]" />
            </div>
            <h1 className="text-3xl font-bold text-[#1E2D2F] mb-2">
              Invista em você! 💪
            </h1>
            <p className="text-[#4E6E75] text-lg">
              Transforme sua vida com nosso plano completo
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#1A535C] to-[#2a6570] rounded-2xl p-8 shadow-2xl mb-6 animate-slideUp">
            <div className="text-center mb-6">
              <div className="inline-block bg-[#FFC947] text-[#1A535C] px-4 py-2 rounded-full font-bold text-sm mb-4">
                PLANO PREMIUM
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Experiência Completa
              </h2>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-4xl font-bold text-[#FFC947]">R$ 49,90</span>
                <span className="text-white/80">/mês</span>
              </div>
              <p className="text-sm text-white/90 mb-4">
                Apenas <span className="font-bold text-[#FFC947]">R$ 1,66 por dia</span> ☕
              </p>
              <p className="text-white/90">
                Menos que um lanche para melhorar seus hábitos, dia a dia e saúde mental
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#FFC947] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#1A535C] text-xs font-bold">✓</span>
                </div>
                <p className="text-white text-sm">Todos os recursos do Básico</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#FFC947] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#1A535C] text-xs font-bold">✓</span>
                </div>
                <p className="text-white text-sm">Análises avançadas de progresso</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#FFC947] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#1A535C] text-xs font-bold">✓</span>
                </div>
                <p className="text-white text-sm">Suporte prioritário 24/7</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#FFC947] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#1A535C] text-xs font-bold">✓</span>
                </div>
                <p className="text-white text-sm">Conteúdo exclusivo de bem-estar</p>
              </div>
            </div>

            <button
              onClick={() => handlePlanSelection('premium')}
              className="w-full bg-[#FFC947] text-[#1A535C] py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#ffb627] transform hover:scale-105 transition-all duration-300 mb-3"
            >
              Sim, quero investir em mim!
            </button>

            <button
              onClick={() => setShowBasicOffer(true)}
              className="w-full text-white/80 py-3 rounded-xl font-medium hover:text-white transition-colors duration-300"
            >
              Não, prefiro um plano mais acessível
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showReport) {
    const finalScore = calculateFinalScore();
    const dailySavings = quizData.habitMonthlySpending ? quizData.habitMonthlySpending / 30 : 0;
    const emotionalState = getEmotionalState(finalScore);

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F7FFF7] to-[#E8F5E9] p-6 flex flex-col animate-fadeIn">
        {/* Botão Refazer Quiz */}
        <button
          onClick={handleRestartQuiz}
          className="flex items-center gap-2 text-[#1A535C] hover:text-[#2a6570] transition-colors duration-300 mb-4 group max-w-md mx-auto w-full"
        >
          <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          <span className="font-medium">Refazer o Quiz</span>
        </button>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          {/* Indicador de Energia Emocional com Ícone Visual */}
          <div className="text-center mb-8 animate-slideDown">
            <div className={`w-24 h-24 bg-gradient-to-br ${emotionalState.gradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
              {emotionalState.icon}
            </div>
            <h1 className="text-3xl font-bold text-[#1E2D2F] mb-4">
              {emotionalState.title}
            </h1>
            <p className="text-lg text-[#4E6E75] leading-relaxed mb-4 px-4">
              {emotionalState.message}
            </p>
            <p className="text-base text-[#1A535C] font-medium leading-relaxed px-4">
              {emotionalState.support}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {/* Card de Hábito (se aplicável) */}
            {quizData.hasHabit && quizData.habitMonthlySpending && (
              <>
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300 animate-slideUp border border-[#1A535C]/10" style={{ animationDelay: '0.1s' }}>
                  <span className="text-sm text-[#4E6E75] font-medium">Gasto Mensal com Hábito</span>
                  <p className="text-3xl font-bold text-[#1E2D2F] mt-1">
                    R$ {quizData.habitMonthlySpending.toFixed(2)}
                  </p>
                </div>

                <div className={`bg-gradient-to-br ${emotionalState.gradient} rounded-3xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300 animate-slideUp`} style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-5 h-5 text-white" />
                    <span className="text-sm text-white font-medium">Economia Potencial Diária</span>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    R$ {dailySavings.toFixed(2)}
                  </p>
                </div>
              </>
            )}

            {/* Informações de Contato */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300 animate-slideUp border border-[#1A535C]/10" style={{ animationDelay: '0.3s' }}>
              <span className="text-sm text-[#4E6E75] font-medium mb-3 block">Seus Dados</span>
              <div className="space-y-2 text-sm">
                <p className="text-[#1E2D2F]"><strong>Nome:</strong> {quizData.name}</p>
                <p className="text-[#1E2D2F]"><strong>Idade:</strong> {quizData.age} anos</p>
                <p className="text-[#1E2D2F]"><strong>E-mail:</strong> {quizData.email}</p>
                {quizData.phone && <p className="text-[#1E2D2F]"><strong>Telefone:</strong> {quizData.countryCode} {quizData.phone}</p>}
              </div>
            </div>
          </div>

          {/* Próximo Passo Reformulado */}
          <div className="bg-gradient-to-br from-[#1A535C] to-[#2a6570] rounded-3xl p-8 shadow-2xl mb-6 animate-slideUp border-2 border-white/20" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-white font-bold text-2xl mb-3 text-center">
              🌱 Seu Caminho de Cuidado
            </h3>
            <p className="text-white/95 text-base leading-relaxed text-center">
              Vamos juntos transformar pequenas decisões em grandes passos de autocuidado e bem-estar. Sua jornada começa agora.
            </p>
          </div>

          <button
            onClick={() => setShowPremiumOffer(true)}
            className="w-full bg-gradient-to-r from-[#FFC947] to-[#FFD700] text-[#1E2D2F] py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 animate-slideUp"
            style={{ animationDelay: '0.5s' }}
          >
            Começar Minha Jornada
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = allQuestions[step];

  // Proteção contra undefined (quando array é recalculado)
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-[#F7FFF7] p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1A535C]/30 border-t-[#1A535C] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4E6E75]">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FFF7] p-6 flex flex-col">
      {/* Botão Voltar */}
      {step > 0 && (
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-[#1A535C] hover:text-[#2a6570] transition-colors duration-300 mb-4 group max-w-md mx-auto w-full"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Voltar</span>
        </button>
      )}

      {/* Progress bar */}
      <div className="max-w-md mx-auto w-full mb-8">
        <div className="flex gap-2">
          {allQuestions.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                index <= step ? "bg-[#1A535C]" : "bg-[#1A535C]/20"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-[#4E6E75] mt-2 text-center">
          Pergunta {step + 1} de {allQuestions.length}
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="mb-8 animate-slideDown">
          <h2 className="text-2xl font-bold text-[#1E2D2F] mb-2">
            {currentQuestion.title}
          </h2>
          <p className="text-[#4E6E75]">
            {currentQuestion.subtitle}
          </p>
        </div>

        {/* Input de Texto */}
        {currentQuestion.type === "text-input" && (
          <div className="animate-slideUp">
            <input
              type="text"
              placeholder={currentQuestion.placeholder}
              className="w-full p-4 rounded-xl border-2 border-[#1A535C]/20 focus:border-[#1A535C] outline-none text-lg font-medium text-[#1E2D2F] transition-all duration-300"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value = (e.target as HTMLInputElement).value;
                  if (value.trim()) {
                    handleAnswer(value);
                  }
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                const value = input?.value || "";
                if (value.trim()) {
                  handleAnswer(value);
                }
              }}
              className="mt-4 w-full bg-[#1A535C] text-white py-4 rounded-xl font-bold hover:bg-[#2a6570] transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Input de Email com Validação */}
        {currentQuestion.type === "email-input" && (
          <div className="animate-slideUp">
            <input
              type="email"
              placeholder={currentQuestion.placeholder}
              className={`w-full p-4 rounded-xl border-2 ${emailError ? 'border-red-500' : 'border-[#1A535C]/20'} focus:border-[#1A535C] outline-none text-lg font-medium text-[#1E2D2F] transition-all duration-300`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value = (e.target as HTMLInputElement).value;
                  if (value.trim()) {
                    handleAnswer(value);
                  }
                }
              }}
              onChange={() => setEmailError("")}
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-2">{emailError}</p>
            )}
            <button
              onClick={() => {
                const input = document.querySelector('input[type="email"]') as HTMLInputElement;
                const value = input?.value || "";
                if (value.trim()) {
                  handleAnswer(value);
                }
              }}
              className="mt-4 w-full bg-[#1A535C] text-white py-4 rounded-xl font-bold hover:bg-[#2a6570] transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Input de Telefone com Código de Área */}
        {currentQuestion.type === "phone-input" && (
          <div className="animate-slideUp">
            <div className="flex gap-3">
              <select
                value={quizData.countryCode}
                onChange={(e) => setQuizData(prev => ({ ...prev, countryCode: e.target.value }))}
                className="w-32 p-4 rounded-xl border-2 border-[#1A535C]/20 focus:border-[#1A535C] outline-none text-base font-medium text-[#1E2D2F] transition-all duration-300 bg-white"
              >
                <option value="+55">🇧🇷 +55</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+351">🇵🇹 +351</option>
                <option value="+34">🇪🇸 +34</option>
                <option value="+44">🇬🇧 +44</option>
              </select>
              <input
                type="tel"
                placeholder={currentQuestion.placeholder}
                className="flex-1 p-4 rounded-xl border-2 border-[#1A535C]/20 focus:border-[#1A535C] outline-none text-lg font-medium text-[#1E2D2F] transition-all duration-300"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const value = (e.target as HTMLInputElement).value;
                    if (value.trim()) {
                      handleAnswer(value);
                    }
                  }
                }}
              />
            </div>
            <button
              onClick={() => {
                const input = document.querySelector('input[type="tel"]') as HTMLInputElement;
                const value = input?.value || "";
                if (value.trim()) {
                  handleAnswer(value);
                }
              }}
              className="mt-4 w-full bg-[#1A535C] text-white py-4 rounded-xl font-bold hover:bg-[#2a6570] transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Input Numérico */}
        {currentQuestion.type === "number-input" && (
          <div className="animate-slideUp">
            <div className="relative">
              {currentQuestion.prefix && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E2D2F] font-bold text-lg">
                  {currentQuestion.prefix}
                </span>
              )}
              <input
                type="number"
                placeholder={currentQuestion.placeholder}
                className={`w-full p-4 ${currentQuestion.prefix ? 'pl-12' : ''} rounded-xl border-2 border-[#1A535C]/20 focus:border-[#1A535C] outline-none text-lg font-medium text-[#1E2D2F] transition-all duration-300`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const value = (e.target as HTMLInputElement).value;
                    if (value && parseFloat(value) > 0) {
                      handleAnswer(value);
                    }
                  }
                }}
              />
            </div>
            <button
              onClick={() => {
                const input = document.querySelector('input[type="number"]') as HTMLInputElement;
                const value = input?.value || "";
                if (value && parseFloat(value) > 0) {
                  handleAnswer(value);
                }
              }}
              className="mt-4 w-full bg-[#1A535C] text-white py-4 rounded-xl font-bold hover:bg-[#2a6570] transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Escala de Pontuação */}
        {currentQuestion.type === "scale" && (
          <div className="space-y-3 animate-slideUp">
            {currentQuestion.options?.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value, option.points)}
                className="w-full p-4 rounded-xl border-2 transition-all duration-300 text-left flex items-center justify-between group hover:border-[#1A535C] hover:shadow-lg hover:scale-105 border-[#1A535C]/20 bg-white animate-slideUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-[#1E2D2F] font-medium">{option.label}</span>
                <ChevronRight className="w-5 h-5 text-[#4E6E75] group-hover:text-[#1A535C] group-hover:translate-x-1 transition-all duration-300" />
              </button>
            ))}
          </div>
        )}

        {/* Sim/Não */}
        {currentQuestion.type === "yes-no" && (
          <div className="space-y-3 animate-slideUp">
            <button
              onClick={() => handleAnswer("yes")}
              className="w-full p-4 rounded-xl border-2 transition-all duration-300 text-left flex items-center justify-between group hover:border-[#1A535C] hover:shadow-lg hover:scale-105 border-[#1A535C]/20 bg-white"
            >
              <span className="text-[#1E2D2F] font-medium">Sim</span>
              <ChevronRight className="w-5 h-5 text-[#4E6E75] group-hover:text-[#1A535C] group-hover:translate-x-1 transition-all duration-300" />
            </button>
            <button
              onClick={() => handleAnswer("no")}
              className="w-full p-4 rounded-xl border-2 transition-all duration-300 text-left flex items-center justify-between group hover:border-[#1A535C] hover:shadow-lg hover:scale-105 border-[#1A535C]/20 bg-white"
            >
              <span className="text-[#1E2D2F] font-medium">Não</span>
              <ChevronRight className="w-5 h-5 text-[#4E6E75] group-hover:text-[#1A535C] group-hover:translate-x-1 transition-all duration-300" />
            </button>
          </div>
        )}

        {/* Opções Múltiplas */}
        {currentQuestion.type === "options" && (
          <div className="space-y-3 animate-slideUp">
            {currentQuestion.options?.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className="w-full p-4 rounded-xl border-2 transition-all duration-300 text-left flex items-center justify-between group hover:border-[#1A535C] hover:shadow-lg hover:scale-105 border-[#1A535C]/20 bg-white animate-slideUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-[#1E2D2F] font-medium">{option.label}</span>
                <ChevronRight className="w-5 h-5 text-[#4E6E75] group-hover:text-[#1A535C] group-hover:translate-x-1 transition-all duration-300" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
