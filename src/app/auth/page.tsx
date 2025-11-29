"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        if (data.user) {
          router.push('/');
        }
      } else {
        // Cadastro
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          // Criar perfil do usuário
          await supabase.from('profiles').insert([
            {
              user_id: data.user.id,
              full_name: formData.fullName,
            },
          ]);

          setSuccess('Conta criada com sucesso! Você pode fazer login agora.');
          setIsLogin(true);
          setFormData({ email: '', password: '', fullName: '' });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FFF7] via-[#E8F5E8] to-[#D4E9D7] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-full p-4 shadow-lg mb-4">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/29d8e322-e64d-4808-a5e6-1eab5edce914.png" 
              alt="Saldo Mental Logo" 
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-4xl font-bold text-[#1E2D2F] mb-2">
            Saldo Mental
          </h1>
          <p className="text-[#4E6E75] text-lg">
            Transforme hábitos em conquistas 💪
          </p>
        </div>

        {/* Card de Autenticação */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-[#1A535C]/10">
          {/* Toggle Login/Cadastro */}
          <div className="flex gap-2 mb-6 bg-[#F7FFF7] rounded-2xl p-1">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                isLogin
                  ? 'bg-[#1A535C] text-white shadow-lg'
                  : 'text-[#4E6E75] hover:text-[#1A535C]'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                !isLogin
                  ? 'bg-[#1A535C] text-white shadow-lg'
                  : 'text-[#4E6E75] hover:text-[#1A535C]'
              }`}
            >
              Cadastrar
            </button>
          </div>

          {/* Mensagens */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
              {success}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[#1E2D2F] mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4E6E75]" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Seu nome completo"
                    required={!isLogin}
                    className="w-full pl-12 pr-4 py-3 bg-[#F7FFF7] border border-[#1A535C]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A535C] focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#1E2D2F] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4E6E75]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="seu@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-[#F7FFF7] border border-[#1A535C]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A535C] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1E2D2F] mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4E6E75]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-12 pr-12 py-3 bg-[#F7FFF7] border border-[#1A535C]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A535C] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4E6E75] hover:text-[#1A535C] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {!isLogin && (
                <p className="mt-1 text-xs text-[#4E6E75]">
                  Mínimo de 6 caracteres
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A535C] text-white py-4 rounded-xl font-semibold hover:bg-[#2a6570] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Aguarde...'
                : isLogin
                ? 'Entrar'
                : 'Criar Conta'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#4E6E75]">
            Ao continuar, você concorda com nossos{' '}
            <span className="text-[#1A535C] font-medium">Termos de Uso</span> e{' '}
            <span className="text-[#1A535C] font-medium">Política de Privacidade</span>
          </p>
        </div>
      </div>
    </div>
  );
}
