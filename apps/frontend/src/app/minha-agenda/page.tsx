'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

type Appointment = {
  id: string;
  serviceId: string;
  service: {
    id: string;
    name: string;
    price: number;
    duration: number;
  };
  startAt: string;
  endAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api/v1';

export default function MinhaAgendaPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch appointments
  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');

        if (!token) {
          throw new Error('Token não encontrado');
        }

        const endpoint = activeTab === 'upcoming' ? '/appointments/me/upcoming' : '/appointments/me/history';
        const response = await fetch(`${API_BASE}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar agendamentos');
        }

        const data = await response.json();
        setAppointments(data);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [isAuthenticated, authLoading, activeTab]);

  if (authLoading) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <p>Carregando...</p>
      </main>
    );
  }

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    PENDING: { bg: '#fff3cd', text: '#856404', label: '⏳ Pendente' },
    CONFIRMED: { bg: '#d4edda', text: '#155724', label: '✅ Confirmado' },
    COMPLETED: { bg: '#d1ecf1', text: '#0c5460', label: '✓ Realizado' },
    CANCELLED: { bg: '#f8d7da', text: '#721c24', label: '❌ Cancelado' },
    NO_SHOW: { bg: '#f8d7da', text: '#721c24', label: '⚠️ Não compareceu' },
  };

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
          <span style={{ color: 'var(--color-text-secondary)' }}>
            Olá, {user?.name.split(' ')[0]}
          </span>
        </div>
      </nav>

      {/* Main Content */}

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px', boxShadow: 'var(--shadow-sm)', backgroundColor: 'white', borderRadius: '12px', marginTop: '32px' }}>
        <h1 style={{ marginBottom: '8px', fontSize: '2rem' }}>Meus Agendamentos</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
          Visualize e gerencie seus agendamentos
        </p>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '32px',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <button
            onClick={() => setActiveTab('upcoming')}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 0',
              paddingBottom: '16px',
              fontSize: '16px',
              fontWeight: activeTab === 'upcoming' ? '600' : '500',
              color: activeTab === 'upcoming' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === 'upcoming' ? '2px solid var(--color-primary)' : 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-base)',
            }}
          >
            📅 Próximos ({appointments.filter(a => new Date(a.startAt) > new Date()).length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 0',
              paddingBottom: '16px',
              fontSize: '16px',
              fontWeight: activeTab === 'history' ? '600' : '500',
              color: activeTab === 'history' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === 'history' ? '2px solid var(--color-primary)' : 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-base)',
            }}
          >
            📜 Histórico
          </button>
        </div>

        {/* Error Message */}
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

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--color-text-secondary)' }}>
            Carregando agendamentos...
          </div>
        )}

        {/* Empty State */}
        {!loading && appointments.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '48px 24px',
            color: 'var(--color-text-secondary)',
          }}>
            <p style={{ fontSize: '18px', marginBottom: '16px' }}>
              {activeTab === 'upcoming' ? '📭' : '📜'} {activeTab === 'upcoming' ? 'Você ainda não tem agendamentos próximos' : 'Sem histórico de agendamentos'}
            </p>
            {activeTab === 'upcoming' && (
              <Link
                href="/agendar"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  marginTop: '16px',
                  transition: 'all var(--transition-base)',
                }}
              >
                Fazer um Agendamento
              </Link>
            )}
          </div>
        )}

        {/* Appointments List */}
        {!loading && appointments.length > 0 && (
          <div style={{ display: 'grid', gap: '16px' }}>
            {appointments.map((apt) => {
              const startDate = new Date(apt.startAt);
              const statusInfo = statusColors[apt.status];
              const daysUntil = Math.ceil(
                (startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={apt.id}
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    padding: '24px',
                    backgroundColor: 'white',
                    transition: 'all var(--transition-base)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '16px',
                  }}>
                    <div>
                      <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>
                        {apt.service.name}
                      </h3>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                        {apt.service.duration} minutos
                      </p>
                    </div>
                    <div
                      style={{
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.text,
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {statusInfo.label}
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '16px',
                    marginBottom: '16px',
                  }}>
                    <div>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                        📅 Data
                      </span>
                      <p style={{ fontWeight: '600', fontSize: '16px' }}>
                        {startDate.toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                        ⏰ Horário
                      </span>
                      <p style={{ fontWeight: '600', fontSize: '16px' }}>
                        {startDate.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                        💰 Valor
                      </span>
                      <p style={{ fontWeight: '600', fontSize: '16px' }}>
                        R$ {apt.service.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {daysUntil > 0 && daysUntil <= 7 && (
                    <div style={{
                      backgroundColor: '#fff3cd',
                      color: '#856404',
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      marginBottom: '16px',
                    }}>
                      ⏳ Seu atendimento acontece em {daysUntil} {daysUntil === 1 ? 'dia' : 'dias'}
                    </div>
                  )}

                  {apt.notes && (
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                        📝 Observações
                      </span>
                      <p style={{ fontSize: '14px', color: 'var(--color-text)' }}>
                        {apt.notes}
                      </p>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    {apt.status === 'CONFIRMED' && startDate > new Date() && (
                      <button
                        onClick={() => {
                          if (confirm('Deseja cancelar este agendamento?')) {
                            // Handle cancellation
                          }
                        }}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: 'var(--color-danger)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                          transition: 'all var(--transition-base)',
                        }}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        {activeTab === 'upcoming' && appointments.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--color-border)' }}>
            <Link
              href="/agendar"
              style={{
                display: 'inline-block',
                padding: '14px 28px',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all var(--transition-base)',
              }}
            >
              Fazer Novo Agendamento
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
