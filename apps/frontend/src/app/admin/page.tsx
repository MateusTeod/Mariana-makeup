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

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.replace('/login');
      return;
    }

    if (!isAuthenticated || user?.role !== 'ADMIN') return;

    const loadAppointments = async () => {
      try {
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar agenda');
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [isAuthenticated, isLoading, router, user?.role]);

  if (isLoading || loading) {
    return (
      <main style={{ padding: '48px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <p>Carregando agenda do administrador...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: '48px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <h1>Agenda</h1>
        <div style={{ color: '#B00020', marginBottom: 24 }}>{error}</div>
        <Link href="/login" className="btn btn--primary">Voltar para login</Link>
      </main>
    );
  }

  return (
    <main style={{ padding: '48px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <p style={{ textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8b6a73', fontSize: 12 }}>Painel administrativo</p>
          <h1 style={{ fontSize: '2rem', marginTop: 8 }}>Agenda</h1>
        </div>
        <Link href="/" className="btn btn--outline">Voltar para Home</Link>
      </div>

      <div style={{ display: 'grid', gap: 18 }}>
        {appointments.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #ead9de', borderRadius: 16, padding: 24 }}>
            Nenhum agendamento encontrado.
          </div>
        ) : (
          appointments.map((appointment) => (
            <article
              key={appointment.id}
              style={{
                background: '#fff',
                border: '1px solid #ead9de',
                borderRadius: 16,
                padding: 20,
                boxShadow: '0 6px 18px rgba(53, 28, 42, 0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                <div>
                  <strong style={{ fontSize: 18 }}>{appointment.service.name}</strong>
                  <div style={{ color: '#765d68', marginTop: 4 }}>
                    {appointment.customer.name || 'Cliente sem nome'} • {appointment.customer.email}
                  </div>
                </div>
                <span
                  style={{
                    background: appointment.status === 'CONFIRMED' ? '#d4edda' : '#fff3cd',
                    color: appointment.status === 'CONFIRMED' ? '#155724' : '#856404',
                    padding: '8px 12px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {appointment.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, color: '#351c2a' }}>
                <div><strong>Data:</strong><br />{new Date(appointment.startAt).toLocaleString('pt-BR')}</div>
                <div><strong>Telefone:</strong><br />{appointment.customer.phone || '—'}</div>
                <div><strong>Valor:</strong><br />R$ {Number(appointment.price || appointment.service.price).toFixed(2)}</div>
                <div><strong>Duração:</strong><br />{appointment.service.duration} min</div>
              </div>

              {appointment.notes && (
                <div style={{ marginTop: 12, color: '#765d68' }}>
                  <strong>Observações:</strong> {appointment.notes}
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </main>
  );
}
