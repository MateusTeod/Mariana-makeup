'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Appointment {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  price: number;
  service: {
    name: string;
    duration: number;
  };
}

export default function MinhaAgendaPage() {
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  const [history, setHistory] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [upcomingRes, historyRes] = await Promise.all([
        fetch('/api/v1/appointments/me/upcoming', { headers }),
        fetch('/api/v1/appointments/me/history', { headers }),
      ]);

      if (upcomingRes.ok) setUpcoming(await upcomingRes.json());
      if (historyRes.ok) setHistory(await historyRes.json());
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/api/v1/appointments/${id}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchAppointments();
      }
    } catch (err) {
      console.error('Error cancelling:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      CONFIRMED: { label: 'Confirmado', className: 'badge--confirmed' },
      PENDING: { label: 'Pendente', className: 'badge--pending' },
      CANCELLED: { label: 'Cancelado', className: 'badge--cancelled' },
      COMPLETED: { label: 'Concluido', className: 'badge--completed' },
    };
    const s = statusMap[status] || { label: status, className: '' };
    return <span className={`badge ${s.className}`}>{s.label}</span>;
  };

  const nextAppointment = upcoming[0];
  const daysUntil = nextAppointment
    ? Math.ceil(
        (new Date(nextAppointment.startAt).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  if (loading) {
    return (
      <main className="dashboard">
        <nav className="nav">
          <div className="nav__container">
            <Link href="/" className="nav__logo">Mariana Aparicio</Link>
          </div>
        </nav>
        <div className="container" style={{ padding: '48px 24px' }}>
          <div className="skeleton" style={{ height: 200, marginBottom: 24 }} />
          <div className="skeleton" style={{ height: 300 }} />
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <nav className="nav">
        <div className="nav__container">
          <Link href="/" className="nav__logo">Mariana Aparicio</Link>
          <div className="nav__links">
            <Link href="/agendar" className="btn btn--primary btn--sm">
              Novo Agendamento
            </Link>
          </div>
        </div>
      </nav>

      <div className="container" style={{ padding: '48px 24px' }}>
        <h1 style={{ marginBottom: 32 }}>Minha Agenda</h1>

        {/* Next Appointment */}
        {nextAppointment && (
          <div className="card" style={{ padding: 32, marginBottom: 32 }}>
            <h2 style={{ marginBottom: 16, fontSize: 20 }}>Proximo Agendamento</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <span style={{ color: 'var(--color-text-secondary)' }}>Servico</span>
                <strong style={{ display: 'block' }}>{nextAppointment.service.name}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-secondary)' }}>Data</span>
                <strong style={{ display: 'block' }}>
                  {new Date(nextAppointment.startAt).toLocaleDateString('pt-BR')}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-secondary)' }}>Horario</span>
                <strong style={{ display: 'block' }}>
                  {new Date(nextAppointment.startAt).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-secondary)' }}>Status</span>
                <div>{getStatusBadge(nextAppointment.status)}</div>
              </div>
            </div>
            {daysUntil !== null && (
              <p style={{ marginTop: 16, color: 'var(--color-primary)', fontWeight: 500 }}>
                Seu atendimento acontece em {daysUntil} dia{daysUntil !== 1 ? 's' : ''}
              </p>
            )}
            <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
              <button
                className="btn btn--outline btn--sm"
                onClick={() => handleCancel(nextAppointment.id)}
              >
                Cancelar
              </button>
              <a
                href={`https://wa.me/5511916379775?text=${encodeURIComponent(
                  `Ola! Gostaria de falar sobre meu agendamento de ${nextAppointment.service.name}.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost btn--sm"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
        )}

        {!nextAppointment && (
          <div className="card" style={{ padding: 32, marginBottom: 32, textAlign: 'center' }}>
            <p style={{ marginBottom: 16, color: 'var(--color-text-secondary)' }}>
              Voce nao possui agendamentos proximos.
            </p>
            <Link href="/agendar" className="btn btn--primary">
              Agendar Agora
            </Link>
          </div>
        )}

        {/* History */}
        <h2 style={{ marginBottom: 16, fontSize: 20 }}>Historico</h2>
        {history.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Nenhum atendimento anterior.
          </p>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {history.map((appt) => (
              <div key={appt.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{appt.service.name}</strong>
                    <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
                      {new Date(appt.startAt).toLocaleDateString('pt-BR')} as{' '}
                      {new Date(appt.startAt).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {getStatusBadge(appt.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
