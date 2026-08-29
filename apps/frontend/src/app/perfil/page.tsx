'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api/v1';

export default function PerfilPage() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email) {
      setError('Nome e e-mail são obrigatórios');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE}/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          name,
          email,
          phone,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar perfil');
      }

      setSuccess('Perfil atualizado com sucesso!');
      setEditMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('As senhas não correspondem');
      return;
    }

    if (newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao alterar senha');
      }

      setSuccess('Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <p>Carregando...</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        padding: '18px 24px',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link href="/" style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '25px',
            color: 'var(--color-text)',
            textDecoration: 'none',
          }}>
            Mariana Aparicio
          </Link>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link href="/minha-agenda" style={{
              color: 'var(--color-text)',
              textDecoration: 'none',
              fontSize: '14px',
            }}>
              ← Meus Agendamentos
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ marginBottom: '8px', fontSize: '2rem' }}>Meu Perfil</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
          Gerenciar suas informações pessoais
        </p>

        {/* Messages */}
        {error && (
          <div style={{
            backgroundColor: '#fce4ec',
            color: 'var(--color-danger)',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
          }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
          }}>
            ✅ {success}
          </div>
        )}

        {/* Profile Card */}
        <div style={{
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '32px',
          backgroundColor: 'white',
          marginBottom: '32px',
        }}>
          <h2 style={{ marginBottom: '24px', fontSize: '18px', fontWeight: '600' }}>
            Informações Pessoais
          </h2>

          {editMode ? (
            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label className="form-label">Nome Completo</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">E-mail</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp</label>
                <input
                  type="tel"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <>
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  👤 Nome
                </span>
                <p style={{ fontSize: '16px', color: 'var(--color-text)', marginTop: '4px' }}>
                  {name}
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  📧 E-mail
                </span>
                <p style={{ fontSize: '16px', color: 'var(--color-text)', marginTop: '4px' }}>
                  {email}
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  📱 WhatsApp
                </span>
                <p style={{ fontSize: '16px', color: 'var(--color-text)', marginTop: '4px' }}>
                  {phone || '(Não informado)'}
                </p>
              </div>

              <button
                onClick={() => setEditMode(true)}
                className="btn btn--primary"
              >
                ✏️ Editar Perfil
              </button>
            </>
          )}
        </div>

        {/* Password Card */}
        <div style={{
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '32px',
          backgroundColor: 'white',
          marginBottom: '32px',
        }}>
          <h2 style={{ marginBottom: '24px', fontSize: '18px', fontWeight: '600' }}>
            Segurança
          </h2>

          {showPasswordForm ? (
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label">Senha Atual</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Digite sua senha atual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nova Senha</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirmar Nova Senha</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={loading}
                >
                  {loading ? 'Alterando...' : 'Alterar Senha'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="btn btn--primary"
            >
              🔐 Alterar Senha
            </button>
          )}
        </div>

        {/* Logout Card */}
        <div style={{
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '32px',
          backgroundColor: 'white',
        }}>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
            Sair da sua conta
          </p>
          <button
            onClick={async () => {
              await logout();
              router.push('/');
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: 'var(--color-danger)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            🚪 Sair
          </button>
        </div>
      </div>
    </main>
  );
}
