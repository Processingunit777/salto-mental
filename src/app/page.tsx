"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentUser, getUserData, createUserData, getUserProfile, createUserProfile } from "@/lib/auth-helpers";
import { DashboardScreen } from "./components/DashboardScreen";
import { ChatScreen } from "./components/ChatScreen";
import { ProgressScreen } from "./components/ProgressScreen";
import { OnboardingQuiz } from "./components/OnboardingQuiz";
import { PaymentScreen } from "./components/PaymentScreen";
import { GoalsScreen } from "./components/GoalsScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { BottomNav } from "./components/BottomNav";
import { SOSButton } from "./components/SOSButton";
import { SOSModal } from "./components/SOSModal";

export default function Home() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<"dashboard" | "chat" | "progress" | "goals" | "settings">("dashboard");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    savedMoney: 0,
    daysClean: 0,
    mood: 7,
    dailySavings: 0,
    goals: [] as Array<{ id: string; name: string; target: number; icon: string }>,
  });

  useEffect(() => {
    // Verifica autenticação
    checkAuth();

    // Escuta mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/auth');
      } else {
        setUserId(session.user.id);
        loadUserData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  async function checkAuth() {
    try {
      const user = await getCurrentUser();
      
      if (!user) {
        router.push('/auth');
        return;
      }

      setUserId(user.id);
      await loadUserData(user.id);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  }

  async function loadUserData(uid: string) {
    try {
      // Busca dados do usuário
      let data = await getUserData(uid);
      
      // Se não existir, verifica se precisa fazer onboarding
      if (!data) {
        // Verifica se tem perfil
        const profile = await getUserProfile(uid);
        if (!profile) {
          // Novo usuário - mostrar onboarding
          setShowOnboarding(true);
          return;
        }
        
        // Tem perfil mas não tem dados - criar dados padrão
        data = await createUserData(uid, 0);
      }

      // Atualiza estado com dados do banco
      setUserData({
        savedMoney: parseFloat(data.saved_money?.toString() || '0'),
        daysClean: data.days_clean || 0,
        mood: data.mood || 7,
        dailySavings: parseFloat(data.daily_savings?.toString() || '0'),
        goals: [],
      });
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  }

  const handleOnboardingComplete = async (data: any) => {
    if (!userId) return;

    try {
      // Cria perfil se não existir
      const profile = await getUserProfile(userId);
      if (!profile) {
        await createUserProfile(userId);
      }

      // Cria dados do usuário
      await createUserData(userId, data.dailySavings || 0);

      setQuizResults(data);
      setShowOnboarding(false);
      
      // Se o pagamento já foi processado no OnboardingQuiz, pula o PaymentScreen
      if (data.paymentCompleted) {
        setShowPayment(false);
      } else {
        setShowPayment(true);
      }
      
      setUserData(prev => ({
        ...prev,
        dailySavings: data.dailySavings || 0,
      }));

      // Recarrega dados do banco
      await loadUserData(userId);
    } catch (error) {
      console.error('Erro ao completar onboarding:', error);
    }
  };

  const handlePaymentComplete = () => {
    setShowPayment(false);
  };

  const handleBackToQuiz = () => {
    setShowPayment(false);
    setShowOnboarding(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FFF7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A535C]"></div>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingQuiz onComplete={handleOnboardingComplete} />;
  }

  if (showPayment && quizResults) {
    return <PaymentScreen quizData={quizResults} onComplete={handlePaymentComplete} onBack={handleBackToQuiz} />;
  }

  return (
    <div className="min-h-screen bg-[#F7FFF7] relative pb-20">
      {/* Telas principais */}
      <div className="max-w-md mx-auto">
        {currentScreen === "dashboard" && userId && <DashboardScreen userData={userData} setUserData={setUserData} userId={userId} />}
        {currentScreen === "chat" && <ChatScreen />}
        {currentScreen === "progress" && <ProgressScreen userData={userData} />}
        {currentScreen === "goals" && userId && <GoalsScreen userData={userData} setUserData={setUserData} userId={userId} />}
        {currentScreen === "settings" && userId && <SettingsScreen userId={userId} />}
      </div>

      {/* Navegação inferior */}
      <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />

      {/* Botão SOS flutuante */}
      <SOSButton onClick={() => setShowSOS(true)} />

      {/* Modal SOS */}
      {showSOS && <SOSModal onClose={() => setShowSOS(false)} />}
    </div>
  );
}
