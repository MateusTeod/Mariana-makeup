'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/minha-agenda');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/minha-agenda');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <main className="auth">
        <div className="auth__container">
          <div className="auth__card card">
            <p style={{ textAlign: 'center' }}>Carregando...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="auth">
      <div className="auth__container">
        <div className="auth__card card">
          <h1 className="auth__title">Entrar</h1>
          <p className="auth__subtitle">
            Acesse sua conta para gerenciar seus agendamentos
          </p>

          {error && <div className="auth__error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input
                type="email"
                className="form-input"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-input"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Link href="/recuperar-senha" className="auth__forgot">
              Esqueceu a senha?
            </Link>
            <button
              type="submit"
              className="btn btn--primary"
              style={{ width: '100%', marginTop: '16px' }}
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="auth__register">
            Não tem conta?{' '}
            <Link href="/cadastro">Criar conta</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
