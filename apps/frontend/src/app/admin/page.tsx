'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

type Appointment = {
  id: string;
  status: string;
  startAt: string;
  endAt: string;
  price: number;
  notes?: string;
  service: { name: string; price: number; duration: number };
  customer: {
    id: string;
    name: string | null;
    email: string;
    phone?: string | null;
  };
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api/v1';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE}/appointments/all`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || 'Falha ao carregar agenda');
      }

      const data = await response.json();
      setAppointments(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar agenda');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.replace('/login');
      return;
    }

    if (!isAuthenticated || user?.role !== 'ADMIN') return;

    loadAppointments();
  }, [isAuthenticated, isLoading, router, user?.role]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE}/appointments/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar status do agendamento');
      }

      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao atualizar');
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading || loading) {
    return (
      <main style={{ padding: '48px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <p>Carregando agenda administrativa da Mariana...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: '48px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <h1>Agenda da Administradora</h1>
        <div style={{ color: '#B00020', marginBottom: 24, padding: 16, background: '#fce4ec', borderRadius: 8 }}>{error}</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={loadAppointments} className="btn btn--primary" style={{ padding: '10px 20px' }}>Tentar novamente</button>
          <Link href="/login" className="btn btn--outline" style={{ padding: '10px 20px' }}>Voltar para login</Link>
        </div>
      </main>
    );
  }

  const filteredAppointments = filterStatus === 'ALL'
    ? appointments
    : appointments.filter((a) => a.status === filterStatus);

  const totalCount = appointments.length;
  const confirmedCount = appointments.filter((a) => a.status === 'CONFIRMED').length;
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length;
  const cancelledCount = appointments.filter((a) => a.status === 'CANCELLED').length;
  const totalRevenue = appointments
    .filter((a) => a.status === 'CONFIRMED' || a.status === 'COMPLETED')
    .reduce((acc, curr) => acc + (curr.price || curr.service.price || 0), 0);

  return (
    <main style={{ padding: '48px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.12em', color: '#b86d83', fontSize: 12, fontWeight: 700 }}>Painel Administrativo Oficial</span>
          <h1 style={{ fontSize: '2.2rem', marginTop: 4, color: '#351c2a' }}>Agenda Geral de Clientes</h1>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={loadAppointments} className="btn btn--outline" style={{ padding: '8px 16px', fontSize: 13 }}>
            🔄 Atualizar
          </button>
          <Link href="/" className="btn btn--outline" style={{ padding: '8px 16px', fontSize: 13 }}>
            Ver Site
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: '#fff', border: '1px solid #ead9de', borderRadius: 16, padding: '20px', boxShadow: '0 4px 12px rgba(53, 28, 42, 0.04)' }}>
          <span style={{ fontSize: 12, color: '#765d68', fontWeight: 600 }}>Total de Agendamentos</span>
          <p style={{ fontSize: 28, fontWeight: 700, margin: '8px 0 0', color: '#351c2a' }}>{totalCount}</p>
        </div>
        <div style={{ background: '#fff', border: '1px solid #c3e6cb', borderRadius: 16, padding: '20px', boxShadow: '0 4px 12px rgba(53, 28, 42, 0.04)' }}>
          <span style={{ fontSize: 12, color: '#155724', fontWeight: 600 }}>Confirmados</span>
          <p style={{ fontSize: 28, fontWeight: 700, margin: '8px 0 0', color: '#155724' }}>{confirmedCount}</p>
        </div>
        <div style={{ background: '#fff', border: '1px solid #bee5eb', borderRadius: 16, padding: '20px', boxShadow: '0 4px 12px rgba(53, 28, 42, 0.04)' }}>
          <span style={{ fontSize: 12, color: '#0c5460', fontWeight: 600 }}>Concluídos</span>
          <p style={{ fontSize: 28, fontWeight: 700, margin: '8px 0 0', color: '#0c5460' }}>{completedCount}</p>
        </div>
        <div style={{ background: '#fff', border: '1px solid #f5c6cb', borderRadius: 16, padding: '20px', boxShadow: '0 4px 12px rgba(53, 28, 42, 0.04)' }}>
          <span style={{ fontSize: 12, color: '#721c24', fontWeight: 600 }}>Cancelados</span>
          <p style={{ fontSize: 28, fontWeight: 700, margin: '8px 0 0', color: '#721c24' }}>{cancelledCount}</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #351c2a 0%, #4e263c 100%)', borderRadius: 16, padding: '20px', color: '#fff', boxShadow: '0 6px 18px rgba(53, 28, 42, 0.12)' }}>
          <span style={{ fontSize: 12, color: '#d6ae65', fontWeight: 700, textTransform: 'uppercase' }}>Faturamento Estimado</span>
          <p style={{ fontSize: 28, fontWeight: 700, margin: '8px 0 0', color: '#fff' }}>R$ {totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { key: 'ALL', label: `Todos (${totalCount})` },
          { key: 'CONFIRMED', label: `Confirmados (${confirmedCount})` },
          { key: 'COMPLETED', label: `Concluídos (${completedCount})` },
          { key: 'CANCELLED', label: `Cancelados (${cancelledCount})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            style={{
              padding: '8px 18px',
              borderRadius: 999,
              border: filterStatus === tab.key ? '2px solid #b86d83' : '1px solid #ead9de',
              backgroundColor: filterStatus === tab.key ? '#fff0f3' : '#fff',
              color: filterStatus === tab.key ? '#b86d83' : '#765d68',
              fontWeight: filterStatus === tab.key ? 700 : 500,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div style={{ display: 'grid', gap: 18 }}>
        {filteredAppointments.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #ead9de', borderRadius: 16, padding: 36, textAlign: 'center', color: '#765d68' }}>
            Nenhum agendamento encontrado para o filtro selecionado.
          </div>
        ) : (
          filteredAppointments.map((appointment) => {
            const phoneDigits = appointment.customer.phone ? appointment.customer.phone.replace(/\D/g, '') : null;
            const waPhone = phoneDigits && !phoneDigits.startsWith('55') && phoneDigits.length >= 10 ? `55${phoneDigits}` : phoneDigits;
            const isUpdating = updatingId === appointment.id;

            return (
              <article
                key={appointment.id}
                style={{
                  background: '#fff',
                  border: '1px solid #ead9de',
                  borderRadius: 16,
                  padding: 24,
                  boxShadow: '0 6px 18px rgba(53, 28, 42, 0.04)',
                  transition: 'transform var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#d6ae65', textTransform: 'uppercase', letterSpacing: 1 }}>
                      {appointment.service.name}
                    </span>
                    <h3 style={{ fontSize: 20, marginTop: 4, marginBottom: 4, color: '#351c2a' }}>
                      {appointment.customer.name || 'Cliente sem nome'}
                    </h3>
                    <div style={{ color: '#765d68', fontSize: 13 }}>
                      ✉️ {appointment.customer.email} • 📱 {appointment.customer.phone || 'Sem telefone'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        background:
                          appointment.status === 'CONFIRMED'
                            ? '#d4edda'
                            : appointment.status === 'COMPLETED'
                            ? '#d1ecf1'
                            : appointment.status === 'CANCELLED'
                            ? '#f8d7da'
                            : '#fff3cd',
                        color:
                          appointment.status === 'CONFIRMED'
                            ? '#155724'
                            : appointment.status === 'COMPLETED'
                            ? '#0c5460'
                            : appointment.status === 'CANCELLED'
                            ? '#721c24'
                            : '#856404',
                        padding: '6px 14px',
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, padding: '16px 0', borderTop: '1px solid #f3e9ec', borderBottom: '1px solid #f3e9ec', color: '#351c2a', fontSize: 14 }}>
                  <div>
                    <span style={{ fontSize: 12, color: '#765d68' }}>Data e Horário:</span><br />
                    <strong>📅 {new Date(appointment.startAt).toLocaleString('pt-BR')}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: '#765d68' }}>Valor do Atendimento:</span><br />
                    <strong>💵 R$ {Number(appointment.price || appointment.service.price).toFixed(2)}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: '#765d68' }}>Duração Estimada:</span><br />
                    <strong>⏱️ {appointment.service.duration} minutos</strong>
                  </div>
                </div>

                {appointment.notes && (
                  <div style={{ marginTop: 12, padding: 12, background: '#fff9fa', borderRadius: 8, color: '#532a39', fontSize: 13, border: '1px dashed #ead9de' }}>
                    <strong>Observações da Cliente:</strong> {appointment.notes}
                  </div>
                )}

                {/* Actions Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {waPhone && (
                      <a
                        href={`https://wa.me/${waPhone}?text=${encodeURIComponent(
                          `Olá, ${appointment.customer.name || 'cliente'}! Aqui é a Mariana Aparicio sobre o seu agendamento de ${appointment.service.name} no dia ${new Date(appointment.startAt).toLocaleDateString('pt-BR')}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          background: '#25D366',
                          color: '#fff',
                          padding: '8px 14px',
                          borderRadius: 8,
                          textDecoration: 'none',
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        💬 Contatar WhatsApp
                      </a>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    {appointment.status !== 'CONFIRMED' && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(appointment.id, 'CONFIRMED')}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 8,
                          border: '1px solid #c3e6cb',
                          backgroundColor: '#d4edda',
                          color: '#155724',
                          fontWeight: 600,
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        {isUpdating ? '...' : '✓ Confirmar'}
                      </button>
                    )}
                    {appointment.status !== 'COMPLETED' && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(appointment.id, 'COMPLETED')}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 8,
                          border: '1px solid #bee5eb',
                          backgroundColor: '#d1ecf1',
                          color: '#0c5460',
                          fontWeight: 600,
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        {isUpdating ? '...' : '⭐ Marcar Concluído'}
                      </button>
                    )}
                    {appointment.status !== 'CANCELLED' && (
                      <button
                        disabled={isUpdating}
                        onClick={() => {
                          if (confirm(`Deseja realmente cancelar o agendamento de ${appointment.customer.name || 'cliente'}?`)) {
                            handleUpdateStatus(appointment.id, 'CANCELLED');
                          }
                        }}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 8,
                          border: '1px solid #f5c6cb',
                          backgroundColor: '#f8d7da',
                          color: '#721c24',
                          fontWeight: 600,
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        {isUpdating ? '...' : '✕ Cancelar'}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </main>
  );
}
