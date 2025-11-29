"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! Sou seu Coach Virtual. Estou aqui para te apoiar 24/7, de forma totalmente confidencial. Como posso te ajudar hoje?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simular resposta da IA (em produção, usar API real)
    setTimeout(() => {
      const aiResponses = [
        "Entendo como você está se sentindo. Vamos trabalhar isso juntos. O que especificamente está te incomodando agora?",
        "Essa é uma observação muito importante. Reconhecer o que sentimos é o primeiro passo. Como você lidou com situações parecidas antes?",
        "Você está fazendo um trabalho incrível ao buscar ajuda. Lembre-se: cada conversa é um passo em direção ao seu bem-estar.",
        "Vamos usar uma técnica de TCC aqui. Quando esse pensamento surgir, tente identificar: é um fato ou uma interpretação? Isso pode te ajudar a ganhar perspectiva.",
        "Estou aqui para você. Que tal explorarmos estratégias práticas para lidar com esse momento? Você já tentou técnicas de respiração ou distração?",
      ];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F7FFF7] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#1A535C]/10 p-4 shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1A535C] rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-[#FFC947]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1E2D2F]">Coach Virtual</h2>
            <p className="text-xs text-[#4E6E75]">Sempre disponível para você</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="max-w-md mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.sender === "user"
                    ? "bg-white text-[#1E2D2F] shadow-md"
                    : "bg-[#1A535C] text-white shadow-md"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.sender === "user" ? "text-[#4E6E75]" : "text-white/70"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#1A535C] text-white rounded-2xl px-4 py-3 shadow-md">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-[#1A535C]/10 p-4 shadow-lg">
        <div className="max-w-md mx-auto flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-4 py-3 rounded-xl border-2 border-[#1A535C]/20 focus:border-[#1A535C] focus:outline-none text-[#1E2D2F] placeholder:text-[#4E6E75]"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="w-12 h-12 bg-[#1A535C] rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2a6570] transition-all shadow-md"
          >
            <Send className="w-5 h-5 text-[#FFC947]" />
          </button>
        </div>
      </div>
    </div>
  );
}
