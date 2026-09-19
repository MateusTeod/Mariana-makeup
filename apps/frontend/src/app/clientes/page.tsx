'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Header } from '../Header';
import styles from '../page.module.css';

type Client = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  createdAt: string;
  totalAppointments: number;
  totalSpent: number;
  lastAppointment: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api/v1';

export default function ClientesPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'totalSpent' | 'totalAppointments' | 'lastAppointment'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, user?.role, router]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchClients();
    }
  }, [isAuthenticated, user?.role]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/admin/clients`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Falha ao carregar lista de clientes');

      const data: Client[] = await res.json();
      setClients(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir(column === 'name' ? 'asc' : 'desc');
    }
  };

  const filteredAndSorted = clients
    .filter((c) => {
      if (!searchTerm) return true;
      const s = searchTerm.toLowerCase();
      return (
        (c.name?.toLowerCase() || '').includes(s) ||
        c.email.toLowerCase().includes(s) ||
        (c.phone || '').includes(s)
      );
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      switch (sortBy) {
        case 'name':
          return dir * (a.name || '').localeCompare(b.name || '');
        case 'totalSpent':
          return dir * (a.totalSpent - b.totalSpent);
        case 'totalAppointments':
          return dir * (a.totalAppointments - b.totalAppointments);
        case 'lastAppointment': {
          const da = a.lastAppointment ? new Date(a.lastAppointment).getTime() : 0;
          const db = b.lastAppointment ? new Date(b.lastAppointment).getTime() : 0;
          return dir * (da - db);
        }
        default:
          return 0;
      }
    });

  const formatDate = (iso: string | null) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const formatPhone = (phone: string | null) => {
    if (!phone) return '—';
    return phone;
  };

  const SortArrow = ({ column }: { column: typeof sortBy }) => {
    if (sortBy !== column) return <span style={{ opacity: 0.3, marginLeft: 4, fontSize: 11 }}>↕</span>;
    return <span style={{ marginLeft: 4, fontSize: 11 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  if (authLoading || !isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', backgroundColor: '#fcf8f9' }}>
        <p style={{ color: '#7a6871', fontWeight: 600 }}>Carregando...</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#fcf8f9' }}>
      <Header />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {/* Page Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#351c2a', margin: '0 0 6px 0' }}>
            👥 Clientes
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: '#7a6871' }}>
            Gerencie e visualize informações de todos os seus clientes
          </p>
        </div>

        {/* Search and Stats Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 20,
          flexWrap: 'wrap',
        }}>
          <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: 400 }}>
            <input
              type="text"
              placeholder="Buscar por nome, e-mail ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 40px',
                borderRadius: 12,
                border: '1px solid #eedde4',
                backgroundColor: '#fff',
                fontSize: 14,
                color: '#351c2a',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#d6ae65')}
              onBlur={(e) => (e.target.style.borderColor = '#eedde4')}
            />
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.5 }}>
              🔍
            </span>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{
              backgroundColor: '#fff',
              border: '1px solid #eedde4',
              borderRadius: 10,
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 600,
              color: '#351c2a',
            }}>
              {filteredAndSorted.length} {filteredAndSorted.length === 1 ? 'cliente' : 'clientes'}
            </span>
            <button
              onClick={fetchClients}
              style={{
                backgroundColor: '#fff',
                border: '1px solid #eedde4',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              title="Atualizar lista"
            >
              🔄
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '14px 18px',
            borderRadius: 10,
            marginBottom: 20,
            border: '1px solid #ffcdd2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span>⚠️ {error}</span>
            <button
              onClick={fetchClients}
              style={{ background: 'none', border: 'none', color: '#c62828', fontWeight: 600, cursor: 'pointer' }}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Table */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          border: '1px solid #eedde4',
          boxShadow: '0 4px 20px rgba(53, 28, 42, 0.05)',
          overflow: 'hidden',
        }}>
          {loading ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <p style={{ color: '#7a6871', fontWeight: 600 }}>Carregando clientes...</p>
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <p style={{ fontSize: 40, marginBottom: 8 }}>👥</p>
              <p style={{ color: '#7a6871', fontWeight: 600, fontSize: 15 }}>
                {searchTerm ? 'Nenhum cliente encontrado para esta busca' : 'Nenhum cliente cadastrado ainda'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f0e6eb' }}>
                    <th
                      onClick={() => handleSort('name')}
                      style={thStyle}
                    >
                      Nome <SortArrow column="name" />
                    </th>
                    <th style={{ ...thStyle, cursor: 'default' }}>WhatsApp</th>
                    <th style={{ ...thStyle, cursor: 'default' }}>E-mail</th>
                    <th
                      onClick={() => handleSort('lastAppointment')}
                      style={thStyle}
                    >
                      Último Atendimento <SortArrow column="lastAppointment" />
                    </th>
                    <th
                      onClick={() => handleSort('totalAppointments')}
                      style={{ ...thStyle, textAlign: 'center' }}
                    >
                      Atendimentos <SortArrow column="totalAppointments" />
                    </th>
                    <th
                      onClick={() => handleSort('totalSpent')}
                      style={{ ...thStyle, textAlign: 'right' }}
                    >
                      Valor Gasto <SortArrow column="totalSpent" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSorted.map((client) => (
                    <tr
                      key={client.id}
                      style={{
                        borderBottom: '1px solid #f5eef1',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fdf8fa')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 34,
                            height: 34,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #d6ae65, #b86d83)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: 13,
                            flexShrink: 0,
                          }}>
                            {(client.name || client.email)[0].toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, color: '#351c2a' }}>
                            {client.name || 'Sem nome'}
                          </span>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        {client.phone ? (
                          <a
                            href={`https://wa.me/${client.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: '#25D366',
                              textDecoration: 'none',
                              fontWeight: 500,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            📱 {formatPhone(client.phone)}
                          </a>
                        ) : (
                          <span style={{ color: '#b5a0a8' }}>—</span>
                        )}
                      </td>
                      <td style={{ ...tdStyle, color: '#7a6871' }}>
                        {client.email}
                      </td>
                      <td style={tdStyle}>
                        {client.lastAppointment ? (
                          <span style={{ color: '#351c2a' }}>{formatDate(client.lastAppointment)}</span>
                        ) : (
                          <span style={{ color: '#b5a0a8', fontStyle: 'italic' }}>Nenhum</span>
                        )}
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <span style={{
                          backgroundColor: client.totalAppointments > 0 ? '#e8f5e9' : '#f5f5f5',
                          color: client.totalAppointments > 0 ? '#2e7d32' : '#999',
                          fontWeight: 700,
                          fontSize: 13,
                          padding: '4px 12px',
                          borderRadius: 20,
                        }}>
                          {client.totalAppointments}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, color: '#351c2a' }}>
                        {formatCurrency(client.totalSpent)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        {!loading && filteredAndSorted.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            marginTop: 24,
          }}>
            <SummaryCard
              emoji="👥"
              label="Total de Clientes"
              value={String(clients.length)}
            />
            <SummaryCard
              emoji="💰"
              label="Receita Total"
              value={formatCurrency(clients.reduce((s, c) => s + c.totalSpent, 0))}
            />
            <SummaryCard
              emoji="📋"
              label="Total de Atendimentos"
              value={String(clients.reduce((s, c) => s + c.totalAppointments, 0))}
            />
            <SummaryCard
              emoji="⭐"
              label="Ticket Médio"
              value={(() => {
                const total = clients.reduce((s, c) => s + c.totalSpent, 0);
                const count = clients.reduce((s, c) => s + c.totalAppointments, 0);
                return count > 0 ? formatCurrency(total / count) : 'R$ 0,00';
              })()}
            />
          </div>
        )}
      </div>
    </main>
  );
}

function SummaryCard({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: 14,
      border: '1px solid #eedde4',
      padding: '18px 20px',
      boxShadow: '0 2px 10px rgba(53, 28, 42, 0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 18 }}>{emoji}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#7a6871', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: '#351c2a' }}>{value}</div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '14px 16px',
  textAlign: 'left',
  fontSize: 12,
  fontWeight: 700,
  color: '#7a6871',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  cursor: 'pointer',
  userSelect: 'none',
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: '14px 16px',
  whiteSpace: 'nowrap',
};

