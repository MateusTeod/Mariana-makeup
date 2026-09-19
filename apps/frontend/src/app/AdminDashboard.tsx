'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
};

type Customer = {
  id: string;
  name: string | null;
  email: string;
  phone?: string | null;
};

export type Appointment = {
  id: string;
  status: string;
  startAt: string;
  endAt: string;
  price: number;
  notes?: string;
  service: Service;
  customer: Customer;
};

type DashboardData = {
  todayAppointments: number;
  upcomingAppointments: number;
  monthAppointments: number;
  completedThisMonth: number;
  cancelledThisMonth: number;
  monthRevenue: number;
  averageTicket: number;
  newClientsThisMonth: number;
  totalClients: number;
  recentAppointments: Appointment[];
  allAppointments: Appointment[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api/v1';

function formatGoogleDate(isoString: string): string {
  const d = new Date(isoString);
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function generateGoogleCalendarUrl(apt: Appointment): string {
  const clientName = apt.customer?.name || 'Cliente';
  const serviceName = apt.service?.name || 'Maquiagem';
  const title = encodeURIComponent(`Maquiagem: ${serviceName} - ${clientName}`);
  const dates = `${formatGoogleDate(apt.startAt)}/${formatGoogleDate(apt.endAt)}`;
  const details = encodeURIComponent(
    `Cliente: ${clientName}\nTelefone: ${apt.customer?.phone || 'Não informado'}\nServiço: ${serviceName}\nValor: R$ ${apt.price}\nStatus: ${apt.status}${apt.notes ? `\nObservações: ${apt.notes}` : ''}`
  );
  const location = encodeURIComponent('Estúdio Mariana Aparicio');
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

function generateOutlookCalendarUrl(apt: Appointment): string {
  const clientName = apt.customer?.name || 'Cliente';
  const serviceName = apt.service?.name || 'Maquiagem';
  const subject = encodeURIComponent(`Maquiagem: ${serviceName} - ${clientName}`);
  const startdt = encodeURIComponent(new Date(apt.startAt).toISOString());
  const enddt = encodeURIComponent(new Date(apt.endAt).toISOString());
  const body = encodeURIComponent(
    `Cliente: ${clientName}\nTelefone: ${apt.customer?.phone || 'Não informado'}\nServiço: ${serviceName}\nValor: R$ ${apt.price}\nStatus: ${apt.status}${apt.notes ? `\nObservações: ${apt.notes}` : ''}`
  );
  const location = encodeURIComponent('Estúdio Mariana Aparicio');
  return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${subject}&startdt=${startdt}&enddt=${enddt}&body=${body}&location=${location}`;
}

function downloadSingleIcs(apt: Appointment) {
  const clientName = apt.customer?.name || 'Cliente';
  const serviceName = apt.service?.name || 'Maquiagem';
  const formatIcs = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mariana Aparicio//Atendimento//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:apt-${apt.id}@marianaaparicio.com`,
    `DTSTAMP:${formatIcs(new Date())}`,
    `DTSTART:${formatIcs(new Date(apt.startAt))}`,
    `DTEND:${formatIcs(new Date(apt.endAt))}`,
    `SUMMARY:Maquiagem: ${serviceName} - ${clientName}`,
    `DESCRIPTION:Cliente: ${clientName}\\nTelefone: ${apt.customer?.phone || 'N/A'}\\nValor: R$ ${apt.price}`,
    'LOCATION:Estúdio Mariana Aparicio',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `atendimento-${clientName.replace(/\s+/g, '_')}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminDashboard({ onPreviewClientSite }: { onPreviewClientSite?: () => void }) {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [downloadingIcs, setDownloadingIcs] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Falha ao carregar métricas administrativas');
      }

      const resData: DashboardData = await res.json();
      setData(resData);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
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
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar status do agendamento');
      }

      // Update locally
      setData((prev) => {
        if (!prev) return prev;
        const updatedAll = prev.allAppointments.map((a) =>
          a.id === id ? { ...a, status: newStatus } : a
        );
        return {
          ...prev,
          allAppointments: updatedAll,
          recentAppointments: prev.recentAppointments.map((a) =>
            a.id === id ? { ...a, status: newStatus } : a
          ),
        };
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao atualizar');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownloadFullCalendar = async () => {
    try {
      setDownloadingIcs(true);
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/admin/calendar/export.ics`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Falha ao baixar calendário');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'agenda-mariana.ics';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao exportar calendário');
    } finally {
      setDownloadingIcs(false);
    }
  };

  // Appointments mapping for calendar
  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    if (!data?.allAppointments) return map;

    for (const apt of data.allAppointments) {
      const dateKey = apt.startAt.split('T')[0];
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(apt);
    }
    return map;
  }, [data?.allAppointments]);

  // Selected date appointments
  const selectedDateAppointments = useMemo(() => {
    return appointmentsByDate.get(selectedDate) || [];
  }, [appointmentsByDate, selectedDate]);

  // Filtered appointments for table
  const filteredAppointments = useMemo(() => {
    if (!data?.allAppointments) return [];
    return data.allAppointments.filter((apt) => {
      const matchesStatus = filterStatus === 'ALL' || apt.status === filterStatus;
      const clientName = apt.customer?.name?.toLowerCase() || '';
      const clientPhone = apt.customer?.phone || '';
      const serviceName = apt.service?.name?.toLowerCase() || '';
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        !search ||
        clientName.includes(search) ||
        clientPhone.includes(search) ||
        serviceName.includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [data?.allAppointments, filterStatus, searchTerm]);

  // Calendar navigation helpers
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));
  const goToToday = () => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now.toISOString().split('T')[0]);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return { bg: '#e8f5e9', text: '#2e7d32', label: 'Confirmado' };
      case 'COMPLETED':
        return { bg: '#e3f2fd', text: '#1565c0', label: 'Concluído' };
      case 'PENDING':
        return { bg: '#fff8e1', text: '#f57f17', label: 'Pendente' };
      case 'CANCELLED':
        return { bg: '#ffebee', text: '#c62828', label: 'Cancelado' };
      default:
        return { bg: '#f5f5f5', text: '#616161', label: status };
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fcf8f9', color: '#2b1b22', paddingBottom: '60px' }}>
      {/* Top Banner Navigation */}
      <header
        style={{
          backgroundColor: '#351c2a',
          color: '#fff',
          padding: '24px 32px',
          boxShadow: '0 4px 20px rgba(53, 28, 42, 0.2)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  background: 'linear-gradient(135deg, #d6ae65 0%, #b38b46 100%)',
                  color: '#351c2a',
                  fontWeight: 800,
                  fontSize: '11px',
                  letterSpacing: '1.2px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                }}
              >
                ADMIN DASHBOARD
              </span>
              <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>
                {user?.name || 'Mariana Aparicio'}
              </span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '6px 0 2px 0', color: '#fff' }}>
              Painel de Gestão & Agenda Geral
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)' }}>
              Acompanhe seus atendimentos, clientes, receitas e sincronização de calendários
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSyncModalOpen(true)}
              style={{
                backgroundColor: 'rgba(214, 174, 101, 0.18)',
                color: '#d6ae65',
                border: '1px solid #d6ae65',
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              📅 Sincronizar Calendários
            </button>

            <Link
              href="/agendar"
              style={{
                backgroundColor: '#d6ae65',
                color: '#351c2a',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(214, 174, 101, 0.3)',
              }}
            >
              + Novo Agendamento
            </Link>

            {onPreviewClientSite && (
              <button
                onClick={onPreviewClientSite}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                👁️ Ver Site como Cliente
              </button>
            )}

            <button
              onClick={fetchDashboardData}
              title="Atualizar dados"
              style={{
                backgroundColor: 'transparent',
                color: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              🔄
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1360px', margin: '32px auto 0 auto', padding: '0 24px' }}>
        {error && (
          <div
            style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '16px 20px',
              borderRadius: '10px',
              marginBottom: '24px',
              border: '1px solid #ffcdd2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>⚠️ {error}</span>
            <button
              onClick={fetchDashboardData}
              style={{ background: 'none', border: 'none', color: '#c62828', fontWeight: 600, cursor: 'pointer' }}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* 1. SEÇÃO DE INDICADORES (8 KPIs) */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#351c2a', margin: 0 }}>
              📊 Indicadores do Negócio
            </h2>
            <span style={{ fontSize: '13px', color: '#7a6871' }}>
              Mês de referência: <strong>{monthNames[new Date().getMonth()]} de {new Date().getFullYear()}</strong>
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            {/* KPI 1: Agendamentos de Hoje */}
            <div style={cardKpiStyle}>
              <div style={kpiHeaderStyle}>
                <span style={kpiTitleStyle}>Agendamentos de Hoje</span>
                <span style={{ fontSize: '20px' }}>🎯</span>
              </div>
              <div style={kpiNumberStyle}>{loading ? '...' : data?.todayAppointments || 0}</div>
              <div style={kpiSubStyle}>Atendimentos agendados para hoje</div>
            </div>

            {/* KPI 2: Próximos Agendamentos */}
            <div style={cardKpiStyle}>
              <div style={kpiHeaderStyle}>
                <span style={kpiTitleStyle}>Próximos Agendamentos</span>
                <span style={{ fontSize: '20px' }}>⏳</span>
              </div>
              <div style={kpiNumberStyle}>{loading ? '...' : data?.upcomingAppointments || 0}</div>
              <div style={kpiSubStyle}>Marcados de hoje em diante</div>
            </div>

            {/* KPI 3: Agendamentos do Mês */}
            <div style={cardKpiStyle}>
              <div style={kpiHeaderStyle}>
                <span style={kpiTitleStyle}>Agendamentos do Mês</span>
                <span style={{ fontSize: '20px' }}>🗓️</span>
              </div>
              <div style={kpiNumberStyle}>{loading ? '...' : data?.monthAppointments || 0}</div>
              <div style={kpiSubStyle}>Total reservado neste mês</div>
            </div>

            {/* KPI 4: Atendimentos Concluídos */}
            <div style={cardKpiStyle}>
              <div style={kpiHeaderStyle}>
                <span style={kpiTitleStyle}>Atendimentos Concluídos</span>
                <span style={{ fontSize: '20px' }}>✨</span>
              </div>
              <div style={{ ...kpiNumberStyle, color: '#2e7d32' }}>
                {loading ? '...' : data?.completedThisMonth || 0}
              </div>
              <div style={kpiSubStyle}>Clientes atendidas e finalizadas</div>
            </div>

            {/* KPI 5: Cancelamentos */}
            <div style={cardKpiStyle}>
              <div style={kpiHeaderStyle}>
                <span style={kpiTitleStyle}>Cancelamentos</span>
                <span style={{ fontSize: '20px' }}>🚫</span>
              </div>
              <div style={{ ...kpiNumberStyle, color: '#c62828' }}>
                {loading ? '...' : data?.cancelledThisMonth || 0}
              </div>
              <div style={kpiSubStyle}>Desistências no mês</div>
            </div>

            {/* KPI 6: Faturamento do Mês */}
            <div style={{ ...cardKpiStyle, background: 'linear-gradient(135deg, #fff 0%, #fffbf0 100%)', borderColor: '#d6ae65' }}>
              <div style={kpiHeaderStyle}>
                <span style={{ ...kpiTitleStyle, color: '#916d25' }}>Faturamento do Mês</span>
                <span style={{ fontSize: '20px' }}>💰</span>
              </div>
              <div style={{ ...kpiNumberStyle, color: '#351c2a' }}>
                {loading ? '...' : `R$ ${(data?.monthRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              </div>
              <div style={kpiSubStyle}>Confirmados e realizados</div>
            </div>

            {/* KPI 7: Ticket Médio */}
            <div style={cardKpiStyle}>
              <div style={kpiHeaderStyle}>
                <span style={kpiTitleStyle}>Ticket Médio</span>
                <span style={{ fontSize: '20px' }}>🏷️</span>
              </div>
              <div style={kpiNumberStyle}>
                {loading ? '...' : `R$ ${(data?.averageTicket || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              </div>
              <div style={kpiSubStyle}>Valor médio por atendimento</div>
            </div>

            {/* KPI 8: Novas Clientes */}
            <div style={cardKpiStyle}>
              <div style={kpiHeaderStyle}>
                <span style={kpiTitleStyle}>Novas Clientes</span>
                <span style={{ fontSize: '20px' }}>👥</span>
              </div>
              <div style={{ ...kpiNumberStyle, color: '#351c2a' }}>
                {loading ? '...' : data?.newClientsThisMonth || 0}
              </div>
              <div style={kpiSubStyle}>
                Total na base: <strong>{data?.totalClients || 0} clientes</strong>
              </div>
            </div>
          </div>
        </section>

        {/* 2. AGENDA & CALENDÁRIO COMPLETO */}
        <section style={{ marginBottom: '40px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(340px, 420px) 1fr',
              gap: '24px',
            }}
          >
            {/* Bloco 1: O Calendário Interativo */}
            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #eedde4',
                boxShadow: '0 4px 20px rgba(53, 28, 42, 0.05)',
                height: 'fit-content',
              }}
            >
              {/* Header do Mês */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#351c2a' }}>
                    {monthNames[month]} {year}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#7a6871' }}>Clique em um dia para ver horários</span>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={prevMonth}
                    style={calendarNavBtn}
                    title="Mês anterior"
                  >
                    ◀
                  </button>
                  <button
                    onClick={goToToday}
                    style={{ ...calendarNavBtn, fontSize: '11px', padding: '6px 10px', fontWeight: 600 }}
                  >
                    Hoje
                  </button>
                  <button
                    onClick={nextMonth}
                    style={calendarNavBtn}
                    title="Próximo mês"
                  >
                    ▶
                  </button>
                </div>
              </div>

              {/* Dias da semana */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#7a6871',
                  marginBottom: '10px',
                }}
              >
                <span>Dom</span>
                <span>Seg</span>
                <span>Ter</span>
                <span>Qua</span>
                <span>Qui</span>
                <span>Sex</span>
                <span>Sáb</span>
              </div>

              {/* Grade de dias */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: '6px',
                }}
              >
                {/* Espaços vazios antes do 1º dia */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} style={{ height: '42px' }} />
                ))}

                {/* Dias do mês */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                  const isSelected = selectedDate === dateStr;
                  const todayStr = new Date().toISOString().split('T')[0];
                  const isToday = todayStr === dateStr;
                  const dayApts = appointmentsByDate.get(dateStr) || [];
                  const hasApts = dayApts.length > 0;

                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      style={{
                        height: '46px',
                        borderRadius: '10px',
                        border: isSelected
                          ? '2px solid #351c2a'
                          : isToday
                          ? '2px solid #d6ae65'
                          : '1px solid #f0e6eb',
                        backgroundColor: isSelected
                          ? '#351c2a'
                          : hasApts
                          ? '#fff7f9'
                          : '#fff',
                        color: isSelected ? '#fff' : '#351c2a',
                        fontWeight: isSelected || isToday || hasApts ? 700 : 400,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{ fontSize: '13px' }}>{dayNum}</span>
                      {hasApts && (
                        <div style={{ display: 'flex', gap: '2px', marginTop: '3px' }}>
                          {dayApts.slice(0, 3).map((a, idx) => (
                            <span
                              key={idx}
                              style={{
                                width: '5px',
                                height: '5px',
                                borderRadius: '50%',
                                backgroundColor: isSelected
                                  ? '#d6ae65'
                                  : a.status === 'CONFIRMED'
                                  ? '#2e7d32'
                                  : a.status === 'COMPLETED'
                                  ? '#1565c0'
                                  : a.status === 'CANCELLED'
                                  ? '#c62828'
                                  : '#f57f17',
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legenda do Calendário */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '14px',
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid #f0e6eb',
                  fontSize: '11px',
                  color: '#7a6871',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2e7d32' }} />
                  Confirmado
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1565c0' }} />
                  Concluído
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f57f17' }} />
                  Pendente
                </span>
              </div>
            </div>

            {/* Bloco 2: Detalhes dos Agendamentos do Dia Selecionado */}
            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid #eedde4',
                boxShadow: '0 4px 20px rgba(53, 28, 42, 0.05)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #f0e6eb',
                  paddingBottom: '16px',
                  marginBottom: '24px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#d6ae65', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    AGENDA DO DIA
                  </span>
                  <h3 style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: 700, color: '#351c2a' }}>
                    {(() => {
                      const [y, m, d] = selectedDate.split('-').map(Number);
                      const dt = new Date(y, m - 1, d);
                      return dt.toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      });
                    })()}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      backgroundColor: '#fce4ec',
                      color: '#b86d83',
                      fontWeight: 700,
                      fontSize: '13px',
                      padding: '6px 12px',
                      borderRadius: '20px',
                    }}
                  >
                    {selectedDateAppointments.length}{' '}
                    {selectedDateAppointments.length === 1 ? 'atendimento' : 'atendimentos'}
                  </span>
                </div>
              </div>

              {/* Lista de Atendimentos no Dia */}
              {selectedDateAppointments.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '48px 24px',
                    color: '#7a6871',
                  }}
                >
                  <div style={{ fontSize: '42px', marginBottom: '12px' }}>☕</div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#351c2a' }}>
                    Nenhum agendamento para este dia
                  </h4>
                  <p style={{ margin: 0, fontSize: '13px', maxWidth: '300px', marginInline: 'auto' }}>
                    Aproveite para divulgar novos horários ou adicionar manualmente um agendamento.
                  </p>
                  <Link
                    href="/agendar"
                    style={{
                      display: 'inline-block',
                      marginTop: '20px',
                      padding: '10px 20px',
                      backgroundColor: '#d6ae65',
                      color: '#351c2a',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '13px',
                      textDecoration: 'none',
                    }}
                  >
                    Agendar Horário neste Dia
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {selectedDateAppointments.map((apt) => {
                    const badge = statusBadge(apt.status);
                    const startTime = new Date(apt.startAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    const endTime = new Date(apt.endAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    const cleanPhone = (apt.customer?.phone || '').replace(/\D/g, '');

                    return (
                      <div
                        key={apt.id}
                        style={{
                          border: '1px solid #f0e6eb',
                          borderRadius: '12px',
                          padding: '20px',
                          backgroundColor: '#faf6f8',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px',
                        }}
                      >
                        {/* Header do Card */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                backgroundColor: '#351c2a',
                                color: '#d6ae65',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                fontWeight: 700,
                                fontSize: '14px',
                                textAlign: 'center',
                              }}
                            >
                              ⏱️ {startTime} - {endTime}
                            </div>
                            <div>
                              <h4 style={{ margin: '0 0 2px 0', fontSize: '16px', fontWeight: 700, color: '#351c2a' }}>
                                {apt.service?.name}
                              </h4>
                              <span style={{ fontSize: '12px', color: '#7a6871' }}>
                                Duração: {apt.service?.duration} min | Valor: <strong>R$ {apt.price.toFixed(2)}</strong>
                              </span>
                            </div>
                          </div>

                          <span
                            style={{
                              backgroundColor: badge.bg,
                              color: badge.text,
                              fontSize: '12px',
                              fontWeight: 700,
                              padding: '4px 10px',
                              borderRadius: '20px',
                            }}
                          >
                            {badge.label}
                          </span>
                        </div>

                        {/* Dados da Cliente */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '10px',
                            backgroundColor: '#fff',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            fontSize: '13px',
                          }}
                        >
                          <div>
                            <span style={{ color: '#7a6871' }}>Cliente: </span>
                            <strong>{apt.customer?.name || 'Cliente'}</strong>
                          </div>
                          <div>
                            <span style={{ color: '#7a6871' }}>Telefone: </span>
                            <strong>{apt.customer?.phone || 'Não informado'}</strong>
                          </div>
                          <div>
                            <span style={{ color: '#7a6871' }}>Email: </span>
                            <span>{apt.customer?.email}</span>
                          </div>
                          {apt.notes && (
                            <div style={{ gridColumn: '1 / -1' }}>
                              <span style={{ color: '#7a6871' }}>Observações: </span>
                              <span style={{ fontStyle: 'italic' }}>{apt.notes}</span>
                            </div>
                          )}
                        </div>

                        {/* Barra de Ações Rápidas & Calendários Externos */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '10px',
                            paddingTop: '8px',
                          }}
                        >
                          {/* Ações de Contato e Calendários Externos */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            {cleanPhone && (
                              <a
                                href={`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
                                  `Olá, ${apt.customer?.name || 'tudo bem'}! Aqui é a Mariana Aparicio sobre o seu agendamento de ${apt.service?.name} marcado para ${new Date(apt.startAt).toLocaleDateString('pt-BR')} às ${startTime}.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  backgroundColor: '#25d366',
                                  color: '#fff',
                                  padding: '7px 12px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                }}
                              >
                                💬 WhatsApp
                              </a>
                            )}

                            {/* Google Calendar Link */}
                            <a
                              href={generateGoogleCalendarUrl(apt)}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Adicionar ao Google Agenda"
                              style={calendarBtnStyle}
                            >
                              📅 + Google
                            </a>

                            {/* Outlook Calendar Link */}
                            <a
                              href={generateOutlookCalendarUrl(apt)}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Adicionar ao Outlook Agenda"
                              style={calendarBtnStyle}
                            >
                              ✉️ + Outlook
                            </a>

                            {/* Apple Calendar Download */}
                            <button
                              onClick={() => downloadSingleIcs(apt)}
                              title="Baixar para Apple Calendar / iOS"
                              style={calendarBtnStyle}
                            >
                              🍎 + Apple iCal
                            </button>
                          </div>

                          {/* Alteração de Status */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {apt.status !== 'CONFIRMED' && (
                              <button
                                disabled={updatingId === apt.id}
                                onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')}
                                style={{ ...actionBtnStyle, backgroundColor: '#e8f5e9', color: '#2e7d32' }}
                              >
                                ✓ Confirmar
                              </button>
                            )}

                            {apt.status !== 'COMPLETED' && (
                              <button
                                disabled={updatingId === apt.id}
                                onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')}
                                style={{ ...actionBtnStyle, backgroundColor: '#e3f2fd', color: '#1565c0' }}
                              >
                                ⭐ Concluir
                              </button>
                            )}

                            {apt.status !== 'CANCELLED' && (
                              <button
                                disabled={updatingId === apt.id}
                                onClick={() => {
                                  if (confirm('Deseja realmente cancelar este agendamento?')) {
                                    handleUpdateStatus(apt.id, 'CANCELLED');
                                  }
                                }}
                                style={{ ...actionBtnStyle, backgroundColor: '#ffebee', color: '#c62828' }}
                              >
                                ✕ Cancelar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3. LISTA GERAL & FILTROS DE TODOS OS AGENDAMENTOS */}
        <section
          style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid #eedde4',
            boxShadow: '0 4px 20px rgba(53, 28, 42, 0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#351c2a' }}>
                📋 Gestão Geral de Agendamentos
              </h3>
              <span style={{ fontSize: '13px', color: '#7a6871' }}>
                Filtre por status ou pesquise por nome, telefone ou tipo de maquiagem
              </span>
            </div>

            {/* Campo de Pesquisa */}
            <input
              type="text"
              placeholder="🔍 Buscar cliente, telefone ou serviço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #eedde4',
                fontSize: '13px',
                width: '100%',
                maxWidth: '320px',
                outline: 'none',
              }}
            />
          </div>

          {/* Abas de Filtro */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '20px',
              borderBottom: '1px solid #f0e6eb',
              paddingBottom: '12px',
            }}
          >
            {[
              { id: 'ALL', label: 'Todos' },
              { id: 'CONFIRMED', label: 'Confirmados' },
              { id: 'COMPLETED', label: 'Concluídos' },
              { id: 'PENDING', label: 'Pendentes' },
              { id: 'CANCELLED', label: 'Cancelados' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: filterStatus === tab.id ? '#351c2a' : '#f5eef1',
                  color: filterStatus === tab.id ? '#fff' : '#7a6871',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tabela de Agendamentos */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0e6eb', textAlign: 'left', color: '#7a6871' }}>
                  <th style={{ padding: '12px 8px' }}>Data & Horário</th>
                  <th style={{ padding: '12px 8px' }}>Cliente</th>
                  <th style={{ padding: '12px 8px' }}>Serviço</th>
                  <th style={{ padding: '12px 8px' }}>Valor</th>
                  <th style={{ padding: '12px 8px' }}>Status</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#7a6871' }}>
                      Nenhum agendamento encontrado com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt) => {
                    const badge = statusBadge(apt.status);
                    const dt = new Date(apt.startAt);
                    const dateFormatted = dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                    const timeFormatted = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                    return (
                      <tr
                        key={apt.id}
                        style={{
                          borderBottom: '1px solid #f5eef1',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fdf9fa')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <td style={{ padding: '14px 8px', fontWeight: 600, color: '#351c2a' }}>
                          <div>{dateFormatted}</div>
                          <span style={{ fontSize: '11px', color: '#7a6871' }}>⏱️ {timeFormatted} ({apt.service?.duration} min)</span>
                        </td>
                        <td style={{ padding: '14px 8px' }}>
                          <div style={{ fontWeight: 600 }}>{apt.customer?.name || 'Cliente'}</div>
                          <div style={{ fontSize: '11px', color: '#7a6871' }}>{apt.customer?.phone || apt.customer?.email}</div>
                        </td>
                        <td style={{ padding: '14px 8px', fontWeight: 500 }}>{apt.service?.name}</td>
                        <td style={{ padding: '14px 8px', fontWeight: 700, color: '#351c2a' }}>
                          R$ {apt.price.toFixed(2)}
                        </td>
                        <td style={{ padding: '14px 8px' }}>
                          <span
                            style={{
                              backgroundColor: badge.bg,
                              color: badge.text,
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '12px',
                            }}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            {apt.customer?.phone && (
                              <a
                                href={`https://wa.me/55${apt.customer.phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Abrir WhatsApp"
                                style={{ ...actionBtnStyle, backgroundColor: '#25d366', color: '#fff', textDecoration: 'none' }}
                              >
                                💬
                              </a>
                            )}
                            <a
                              href={generateGoogleCalendarUrl(apt)}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Adicionar ao Google Calendar"
                              style={{ ...actionBtnStyle, backgroundColor: '#f0e6eb', color: '#351c2a', textDecoration: 'none' }}
                            >
                              📅
                            </a>
                            {apt.status !== 'COMPLETED' && (
                              <button
                                disabled={updatingId === apt.id}
                                onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')}
                                title="Marcar como Concluído"
                                style={{ ...actionBtnStyle, backgroundColor: '#e3f2fd', color: '#1565c0' }}
                              >
                                ✓
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* MODAL DE SINCRONIZAÇÃO DE CALENDÁRIOS */}
      {syncModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(53, 28, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setSyncModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#351c2a' }}>
                📅 Sincronizar Calendários Externos
              </h3>
              <button
                onClick={() => setSyncModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#7a6871', marginBottom: '24px', lineHeight: 1.5 }}>
              Integre sua agenda de atendimentos diretamente com o <strong>Google Calendar</strong>, <strong>Apple Calendar (iPhone/Mac)</strong> ou <strong>Microsoft Outlook</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              {/* Opção 1: Download do iCal completo */}
              <button
                onClick={handleDownloadFullCalendar}
                disabled={downloadingIcs}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  border: '1px solid #eedde4',
                  backgroundColor: '#faf6f8',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: '28px' }}>🍏</span>
                <div>
                  <div style={{ fontWeight: 700, color: '#351c2a', fontSize: '14px' }}>
                    {downloadingIcs ? 'Baixando arquivo...' : 'Baixar Agenda Completa (.ics)'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#7a6871' }}>
                    Compatível com Apple Calendar (iPhone, iPad, Mac) e Outlook Desktop
                  </div>
                </div>
              </button>

              {/* Opção 2: Google Agenda */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  border: '1px solid #eedde4',
                  backgroundColor: '#faf6f8',
                }}
              >
                <span style={{ fontSize: '28px' }}>🌐</span>
                <div>
                  <div style={{ fontWeight: 700, color: '#351c2a', fontSize: '14px' }}>
                    Google Calendar
                  </div>
                  <div style={{ fontSize: '12px', color: '#7a6871' }}>
                    Você pode clicar em <strong>&quot;+ Google&quot;</strong> em qualquer card de atendimento individual para adicioná-lo à sua conta Google em 1 clique.
                  </div>
                </div>
              </div>

              {/* Opção 3: Outlook */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  border: '1px solid #eedde4',
                  backgroundColor: '#faf6f8',
                }}
              >
                <span style={{ fontSize: '28px' }}>✉️</span>
                <div>
                  <div style={{ fontWeight: 700, color: '#351c2a', fontSize: '14px' }}>
                    Microsoft Outlook
                  </div>
                  <div style={{ fontSize: '12px', color: '#7a6871' }}>
                    Clique no botão <strong>&quot;+ Outlook&quot;</strong> nos atendimentos para abrir direto no Outlook Web ou importe o arquivo .ics acima no aplicativo do Outlook.
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSyncModalOpen(false)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#351c2a',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Estilos auxiliares
const cardKpiStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '14px',
  padding: '20px',
  border: '1px solid #eedde4',
  boxShadow: '0 4px 16px rgba(53, 28, 42, 0.04)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const kpiHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px',
};

const kpiTitleStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#7a6871',
};

const kpiNumberStyle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 800,
  color: '#351c2a',
  marginBottom: '4px',
};

const kpiSubStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#9c8791',
};

const calendarNavBtn: React.CSSProperties = {
  backgroundColor: '#f5eef1',
  border: 'none',
  color: '#351c2a',
  borderRadius: '6px',
  padding: '6px 12px',
  cursor: 'pointer',
  fontSize: '12px',
};

const calendarBtnStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  border: '1px solid #eedde4',
  color: '#351c2a',
  padding: '6px 10px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: 600,
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
};

const actionBtnStyle: React.CSSProperties = {
  border: 'none',
  padding: '6px 10px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: 700,
  cursor: 'pointer',
};
