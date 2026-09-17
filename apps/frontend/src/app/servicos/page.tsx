'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  active?: boolean;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api/v1';

const DEFAULT_SERVICES: Service[] = [
  {
    id: 'maquiagem-express',
    name: 'Maquiagem Express',
    description: 'Acabamento sofisticado e pele blindada, ideal para convidadas, eventos corporativos e jantares especiais.',
    price: 140,
    duration: 60,
    active: true,
  },
  {
    id: 'maquiagem-noivas',
    name: 'Maquiagem para Noivas',
    description: 'Produção completa de alta durabilidade para o seu grande dia, pensada para emocionar e brilhar nas fotos.',
    price: 350,
    duration: 180,
    active: true,
  },
  {
    id: 'maquiagem-formatura',
    name: 'Maquiagem para Formatura',
    description: 'Look deslumbrante e expressivo para sua noite de celebração, resistente a fotos com flash e muita festa.',
    price: 180,
    duration: 60,
    active: true,
  },
  {
    id: 'maquiagem-eventos',
    name: 'Maquiagem para Eventos',
    description: 'Produção glamourosa com olhos marcantes e contorno iluminado para festas noturnas e galas.',
    price: 200,
    duration: 75,
    active: true,
  },
];

function ServiceBadgeIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <path d="M12 2.5 14.8 9l6.7 2.8-6.7 2.8L12 21.5l-2.8-6.9-6.7-2.8 6.7-2.8L12 2.5Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2.5 2.5" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <path d="M20.5 12.2a8.2 8.2 0 0 1-13.2 6.8L4 20l1.1-3.3A8.2 8.2 0 1 1 20.5 12.2Z" />
      <path d="M15.7 14.6c-.2-.1-1.1-.5-1.3-.6-.2-.1-.3-.1-.5.1-.1.1-.5.6-.6.8-.1.1-.3.1-.5 0-.2-.1-.9-.3-1.7-1.1-.6-.6-1.1-1.3-1.2-1.5-.1-.3 0-.4.1-.5.1-.1.1-.3.2-.4.1-.1.1-.3.2-.4.1-.1.1-.2.2-.4.1-.1.1-.2.1-.4 0-.1 0-.3-.1-.4-.1-.2-.5-1.2-.7-1.7-.2-.5-.4-.4-.5-.4h-.4c-.1 0-.3 0-.5.1-.2.1-.7.7-.7 1.7 0 1 .8 2 .9 2.1.1.1 1.5 2.5 3.7 3.4.5.2.9.4 1.2.5.5.1 1 .1 1.3.1.4-.1 1.1-.5 1.2-1 .1-.4.1-.8.1-1.1 0-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}

export default function ServicosPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '60',
    active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const url = isAdmin ? `${API_BASE}/services?all=true` : `${API_BASE}/services`;
      const response = await fetch(url, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        }
      }
    } catch {
      // Keep default services as fallback
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Open Modal to Create
  const handleOpenCreateModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '60',
      active: true,
    });
    setIsModalOpen(true);
  };

  // Open Modal to Edit
  const handleOpenEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: String(service.price),
      duration: String(service.duration),
      active: service.active !== false,
    });
    setIsModalOpen(true);
  };

  // Submit Modal Form (Create / Edit)
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Informe o nome do serviço.');
      return;
    }
    const numPrice = Number(formData.price);
    const numDuration = Number(formData.duration);
    if (isNaN(numPrice) || numPrice <= 0) {
      alert('Informe um preço válido maior que zero.');
      return;
    }
    if (isNaN(numDuration) || numDuration <= 0) {
      alert('Informe uma duração válida.');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('accessToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      if (editingService) {
        // UPDATE
        const res = await fetch(`${API_BASE}/services/${editingService.id}`, {
          method: 'PATCH',
          headers,
          credentials: 'include',
          body: JSON.stringify({
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: numPrice,
            duration: numDuration,
            active: formData.active,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData?.message || 'Falha ao atualizar serviço');
        }

        setFeedback({ type: 'success', message: `Serviço "${formData.name}" atualizado com sucesso!` });
      } else {
        // CREATE
        const res = await fetch(`${API_BASE}/services`, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: numPrice,
            duration: numDuration,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData?.message || 'Falha ao cadastrar novo serviço');
        }

        setFeedback({ type: 'success', message: `Serviço "${formData.name}" cadastrado com sucesso!` });
      }

      setIsModalOpen(false);
      await fetchServices();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar serviço');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Active / Deactive
  const handleToggleActive = async (service: Service) => {
    try {
      setActionId(service.id);
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/services/${service.id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Falha ao alterar status do serviço');
      }

      setFeedback({
        type: 'success',
        message: `Serviço "${service.name}" ${service.active !== false ? 'desativado' : 'ativado'} com sucesso!`,
      });
      await fetchServices();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao alterar status');
    } finally {
      setActionId(null);
    }
  };

  // Delete Service
  const handleDeleteService = async (service: Service) => {
    const confirmed = window.confirm(
      `Deseja realmente excluir o serviço "${service.name}"?\n\nCaso existam agendamentos associados a ele, o sistema irá desativá-lo com segurança para manter o histórico.`
    );
    if (!confirmed) return;

    try {
      setActionId(service.id);
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/services/${service.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Falha ao excluir serviço');
      }

      setFeedback({ type: 'success', message: `Serviço "${service.name}" removido com sucesso!` });
      await fetchServices();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir');
    } finally {
      setActionId(null);
    }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {/* Header Navigation */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
          padding: '18px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '25px',
              color: 'var(--color-text)',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            Mariana Aparicio
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              href="/"
              style={{
                color: 'var(--color-text)',
                textDecoration: 'none',
                fontSize: '14px',
              }}
            >
              Início
            </Link>
            <Link
              href="/agendar"
              style={{
                color: 'var(--color-primary-hover)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              Agendar Horário
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Title and Admin Action */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '8px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '2.2rem', color: '#351c2a' }}>Nossos Serviços</h1>
              {isAdmin && (
                <span
                  style={{
                    backgroundColor: '#351c2a',
                    color: '#d6ae65',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '12px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                  }}
                >
                  ADMIN
                </span>
              )}
            </div>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px', marginBottom: 0 }}>
              {isAdmin
                ? 'Gerencie os serviços, valores e durações do catálogo em tempo real'
                : 'Conheça todos os serviços de maquiagem profissional disponíveis'}
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={handleOpenCreateModal}
              style={{
                backgroundColor: '#d6ae65',
                color: '#351c2a',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(214, 174, 101, 0.35)',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              ➕ Incluir Serviço
            </button>
          )}
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            style={{
              marginTop: '20px',
              padding: '14px 20px',
              borderRadius: '10px',
              backgroundColor: feedback.type === 'success' ? '#e8f5e9' : '#ffebee',
              color: feedback.type === 'success' ? '#2e7d32' : '#c62828',
              border: `1px solid ${feedback.type === 'success' ? '#c8e6c9' : '#ffcdd2'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            <span>{feedback.message}</span>
            <button
              onClick={() => setFeedback(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '16px', color: 'inherit' }}
            >
              ✕
            </button>
          </div>
        )}

        <div style={{ height: '32px' }} />

        {loading && (
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
            Atualizando catálogo de serviços...
          </p>
        )}

        {/* Services Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {services.map((service) => {
            const isServiceActive = service.active !== false;

            return (
              <div
                key={service.id}
                style={{
                  border: isServiceActive ? '1px solid var(--color-border)' : '1px dashed #d1c4c8',
                  borderRadius: '16px',
                  padding: '24px',
                  backgroundColor: isServiceActive ? '#fff' : '#fcf8f9',
                  opacity: isServiceActive ? 1 : 0.82,
                  transition: 'all var(--transition-base)',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: isServiceActive ? 'var(--shadow-sm)' : 'none',
                }}
              >
                {/* Card Top: Icon & Admin Status Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '12px',
                      background: isServiceActive
                        ? 'linear-gradient(135deg, rgba(214,174,101,0.2), rgba(184,109,131,0.2))'
                        : '#ece4e7',
                      color: isServiceActive ? 'var(--color-primary)' : '#9c8791',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <ServiceBadgeIcon />
                  </div>

                  {isAdmin && (
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: isServiceActive ? '#e8f5e9' : '#ffebee',
                        color: isServiceActive ? '#2e7d32' : '#c62828',
                        border: `1px solid ${isServiceActive ? '#c8e6c9' : '#ffcdd2'}`,
                      }}
                    >
                      {isServiceActive ? '● Ativo' : '○ Inativo'}
                    </span>
                  )}
                </div>

                {/* Service Name & Description */}
                <h3
                  style={{
                    fontSize: '19px',
                    fontWeight: '700',
                    marginBottom: '8px',
                    color: isServiceActive ? 'var(--color-text)' : '#7a6871',
                  }}
                >
                  {service.name}
                </h3>

                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '20px',
                    flex: 1,
                    lineHeight: 1.5,
                  }}
                >
                  {service.description}
                </p>

                {/* Duration and Price */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--color-border)',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--color-primary)' }}>
                      <ClockIcon />
                    </span>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {service.duration} min
                    </span>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      fontSize: '22px',
                      fontWeight: '800',
                      color: isServiceActive ? 'var(--color-primary-hover)' : '#7a6871',
                    }}
                  >
                    R$ {service.price.toFixed(2)}
                  </p>
                </div>

                {/* Card Actions: Admin vs Client */}
                {isAdmin ? (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '8px',
                      paddingTop: '8px',
                      borderTop: '1px solid #f0e6eb',
                    }}
                  >
                    <button
                      onClick={() => handleOpenEditModal(service)}
                      disabled={actionId === service.id}
                      style={{
                        padding: '9px 10px',
                        backgroundColor: '#fff',
                        border: '1px solid #eedde4',
                        color: '#351c2a',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      ✏️ Editar
                    </button>

                    <button
                      onClick={() => handleToggleActive(service)}
                      disabled={actionId === service.id}
                      style={{
                        padding: '9px 10px',
                        backgroundColor: isServiceActive ? '#fff8e1' : '#e8f5e9',
                        border: `1px solid ${isServiceActive ? '#ffe082' : '#c8e6c9'}`,
                        color: isServiceActive ? '#f57f17' : '#2e7d32',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      {isServiceActive ? 'Desativar' : 'Ativar'}
                    </button>

                    <button
                      onClick={() => handleDeleteService(service)}
                      disabled={actionId === service.id}
                      style={{
                        padding: '9px 10px',
                        backgroundColor: '#ffebee',
                        border: '1px solid #ffcdd2',
                        color: '#c62828',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                ) : (
                  <Link
                    href={`/agendar?serviceId=${service.id}`}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '12px 16px',
                      backgroundColor: 'var(--color-primary)',
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      transition: 'all var(--transition-base)',
                    }}
                  >
                    Agendar este Serviço
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Informative Guarantee Section */}
        <div
          style={{
            marginTop: '64px',
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '40px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            textAlign: 'center',
          }}
        >
          <h2 style={{ marginBottom: '12px', fontSize: '24px', color: '#351c2a' }}>
            Atendimento Personalizado & Exclusivo
          </h2>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              maxWidth: '640px',
              margin: '0 auto 24px auto',
              lineHeight: '1.6',
              fontSize: '15px',
            }}
          >
            Todos os atendimentos contam com consultoria de visagismo, preparação de pele profunda
            com cosméticos internacionais de alta performance e técnica de pele blindada à prova d&apos;água.
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/agendar"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                padding: '14px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                display: 'inline-block',
              }}
            >
              Agendar Atendimento Online
            </Link>
            <a
              href="https://wa.me/5511916379775?text=Ol%C3%A1%2C%20Mariana!%20Gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20os%20servi%C3%A7os."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                padding: '14px 28px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ color: '#25d366' }}>
                <WhatsAppIcon />
              </span>
              Tirar Dúvidas no WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* TELA FLUTUANTE (MODAL) DE CRIAÇÃO / EDIÇÃO DE SERVIÇO */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(53, 28, 42, 0.65)',
            backdropFilter: 'blur(5px)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => !isSubmitting && setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '540px',
              width: '100%',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.25)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                borderBottom: '1px solid #f0e6eb',
                paddingBottom: '16px',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: '#d6ae65',
                  }}
                >
                  {editingService ? 'MODO DE EDIÇÃO' : 'NOVO CADASTRO'}
                </span>
                <h2 style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: 700, color: '#351c2a' }}>
                  {editingService ? '✏️ Editar Serviço' : '➕ Incluir Novo Serviço'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  color: '#7a6871',
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveService} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Nome */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#351c2a', marginBottom: '6px' }}>
                  Nome do Serviço *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Maquiagem Express"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={inputStyle}
                />
              </div>

              {/* Descrição */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#351c2a', marginBottom: '6px' }}>
                  Descrição Completa *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Descreva a técnica, ocasiões ideais e diferenciais da produção..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              {/* Preço e Duração */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#351c2a', marginBottom: '6px' }}>
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    step="0.50"
                    placeholder="Ex: 140"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#351c2a', marginBottom: '6px' }}>
                    Duração (Minutos) *
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="30">30 minutos</option>
                    <option value="45">45 minutos</option>
                    <option value="60">60 minutos (1 hora)</option>
                    <option value="75">75 minutos (1h15)</option>
                    <option value="90">90 minutos (1h30)</option>
                    <option value="120">120 minutos (2 horas)</option>
                    <option value="180">180 minutos (3 horas)</option>
                    <option value="240">240 minutos (4 horas)</option>
                  </select>
                </div>
              </div>

              {/* Ativo Checkbox (apenas no modo de edição) */}
              {editingService && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '4px' }}>
                  <input
                    type="checkbox"
                    id="serviceActive"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#d6ae65' }}
                  />
                  <label htmlFor="serviceActive" style={{ fontSize: '14px', color: '#351c2a', cursor: 'pointer', fontWeight: 500 }}>
                    Serviço ativo e visível na grade de agendamentos
                  </label>
                </div>
              )}

              {/* Botões de Ação */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  marginTop: '12px',
                  paddingTop: '16px',
                  borderTop: '1px solid #f0e6eb',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '1px solid #eedde4',
                    backgroundColor: '#fff',
                    color: '#7a6871',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#d6ae65',
                    color: '#351c2a',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                    boxShadow: '0 4px 12px rgba(214, 174, 101, 0.3)',
                  }}
                >
                  {isSubmitting ? 'Salvando...' : editingService ? 'Atualizar Serviço' : 'Cadastrar Serviço'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '8px',
  border: '1px solid #eedde4',
  fontSize: '14px',
  color: '#351c2a',
  outline: 'none',
  backgroundColor: '#faf6f8',
  boxSizing: 'border-box',
};
