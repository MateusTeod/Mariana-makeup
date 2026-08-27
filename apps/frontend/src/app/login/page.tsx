'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erro ao fazer login');
      }

      const data = await res.json();
      localStorage.setItem('accessToken', data.accessToken);
      window.location.href = '/minha-agenda';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
