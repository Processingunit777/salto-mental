"use client";

import { useState, useEffect } from "react";
import { X, Wind, Brain, MessageCircle, Phone } from "lucide-react";

export function SOSModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"breathing" | "distraction" | "chat">("breathing");
  const [breathCount, setBreathCount] = useState(0);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [distractionAnswer, setDistractionAnswer] = useState("");

  // Exercício de respiração automático
  useEffect(() => {
    if (step !== "breathing") return;

    const phases = [
      { phase: "inhale" as const, duration: 4000 },
      { phase: "hold" as const, duration: 4000 },
      { phase: "exhale" as const, duration: 4000 },
    ];

    let currentPhaseIndex = 0;
    let count = 0;

    const interval = setInterval(() => {
      const currentPhase = phases[currentPhaseIndex];
      setBreathPhase(currentPhase.phase);

      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      
      if (currentPhaseIndex === 0) {
        count++;
        setBreathCount(count);
        
        if (count >= 5) {
          clearInterval(interval);
          setTimeout(() => setStep("distraction"), 1000);
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [step]);

  const distractionQuestions = [
    "Nomeie 5 coisas que você pode ver ao seu redor",
    "Qual é a sua cor favorita e por quê?",
    "Descreva um lugar onde você se sente seguro",
    "Pense em 3 coisas pelas quais você é grato hoje",
  ];

  const currentQuestion = distractionQuestions[Math.floor(Math.random() * distractionQuestions.length)];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#F7FFF7] rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="bg-red-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold mb-1">Modo SOS Ativado</h2>
          <p className="text-white/90 text-sm">Vamos passar por isso juntos</p>
        </div>

        {/* Breathing Exercise */}
        {step === "breathing" && (
          <div className="p-8 text-center">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div
                className={`w-full h-full rounded-full bg-gradient-to-br from-[#1A535C] to-[#2a6570] flex items-center justify-center transition-all duration-4000 ${
                  breathPhase === "inhale"
                    ? "scale-100"
                    : breathPhase === "hold"
                    ? "scale-100"
                    : "scale-75"
                }`}
              >
                <Wind className="w-16 h-16 text-[#FFC947]" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-[#1E2D2F] mb-2">
              {breathPhase === "inhale" && "Inspire Profundamente"}
              {breathPhase === "hold" && "Segure o Ar"}
              {breathPhase === "exhale" && "Expire Lentamente"}
            </h3>

            <p className="text-[#4E6E75] mb-6">
              Ciclo {breathCount + 1} de 5
            </p>

            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className={`w-2 h-2 rounded-full transition-all ${
                    num <= breathCount + 1 ? "bg-[#1A535C]" : "bg-[#1A535C]/20"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Distraction Technique */}
        {step === "distraction" && (
          <div className="p-8">
            <div className="w-16 h-16 bg-[#1A535C] rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8 text-[#FFC947]" />
            </div>

            <h3 className="text-2xl font-bold text-[#1E2D2F] mb-4 text-center">
              Técnica de Distração
            </h3>

            <p className="text-[#4E6E75] mb-6 text-center">
              {currentQuestion}
            </p>

            <textarea
              value={distractionAnswer}
              onChange={(e) => setDistractionAnswer(e.target.value)}
              placeholder="Escreva aqui seus pensamentos..."
              className="w-full h-32 px-4 py-3 rounded-xl border-2 border-[#1A535C]/20 focus:border-[#1A535C] focus:outline-none text-[#1E2D2F] resize-none mb-4"
            />

            <button
              onClick={() => setStep("chat")}
              className="w-full bg-[#1A535C] text-white py-4 rounded-xl font-bold hover:bg-[#2a6570] transition-all"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Chat Option */}
        {step === "chat" && (
          <div className="p-8">
            <div className="w-16 h-16 bg-[#1A535C] rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-[#FFC947]" />
            </div>

            <h3 className="text-2xl font-bold text-[#1E2D2F] mb-4 text-center">
              Como você está se sentindo?
            </h3>

            <p className="text-[#4E6E75] mb-6 text-center">
              Escolha uma opção para continuar
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  onClose();
                  // Aqui você redirecionaria para o chat
                }}
                className="w-full bg-[#1A535C] text-white py-4 rounded-xl font-bold hover:bg-[#2a6570] transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Conversar com o Coach Virtual
              </button>

              <button
                onClick={onClose}
                className="w-full bg-white border-2 border-[#1A535C] text-[#1A535C] py-4 rounded-xl font-bold hover:bg-[#F7FFF7] transition-all"
              >
                Estou Melhor Agora
              </button>
            </div>

            {/* Linha de Crise */}
            <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-red-600" />
                <span className="text-sm font-bold text-red-600">Emergência?</span>
              </div>
              <p className="text-xs text-red-600 mb-2">
                Se você está em crise imediata, ligue para:
              </p>
              <a
                href="tel:188"
                className="text-sm font-bold text-red-600 underline"
              >
                CVV - 188 (24h, gratuito)
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
