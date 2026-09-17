'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api/v1';

const DEFAULT_SERVICES: Service[] = [
  {
    id: 'maquiagem-express',
    name: 'Maquiagem Express',
    description: 'Acabamento sofisticado e pele blindada, ideal para convidadas, eventos corporativos e jantares especiais.',
    price: 140,
    duration: 60,
  },
  {
    id: 'maquiagem-noivas',
    name: 'Maquiagem para Noivas',
    description: 'Produção completa de alta durabilidade para o seu grande dia, pensada para emocionar e brilhar nas fotos.',
    price: 350,
    duration: 180,
  },
  {
    id: 'maquiagem-formatura',
    name: 'Maquiagem para Formatura',
    description: 'Look deslumbrante e expressivo para sua noite de celebração, resistente a fotos com flash e muita festa.',
    price: 180,
    duration: 60,
  },
  {
    id: 'maquiagem-eventos',
    name: 'Maquiagem para Eventos',
    description: 'Produção glamourosa com olhos marcantes e contorno iluminado para festas noturnas e galas.',
    price: 200,
    duration: 75,
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
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_BASE}/services`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setServices(data);
          }
        }
      } catch {
        // Fallback to DEFAULT_SERVICES already set
      }
    };

    fetchServices();
  }, []);

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
          <Link href="/agendar" style={{
            color: 'var(--color-text)',
            textDecoration: 'none',
            fontSize: '14px',
          }}>
            Agendar 
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ marginBottom: '8px', fontSize: '2rem' }}>Nossos Serviços</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '48px' }}>
          Conheça todos os serviços de maquiagem disponíveis
        </p>

        {/* Services Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {services.map((service) => (
              <Link
                key={service.id}
                href={`/agendar?serviceId=${service.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    padding: '24px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'all var(--transition-base)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Icon Placeholder */}
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(214,174,101,0.18), rgba(184,109,131,0.18))',
                      color: 'var(--color-primary)',
                      display: 'grid',
                      placeItems: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <ServiceBadgeIcon />
                  </div>

                  {/* Service Info */}
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: 'var(--color-text)',
                    }}
                  >
                    {service.name}
                  </h3>

                  <p
                    style={{
                      fontSize: '14px',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '16px',
                      flex: 1,
                    }}
                  >
                    {service.description}
                  </p>

                  {/* Details */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--color-border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: 'var(--color-primary)' }}>
                        <ClockIcon />
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: 'var(--color-text-secondary)',
                      }}>
                        {service.duration} min
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p
                        style={{
                          fontSize: '20px',
                          fontWeight: '700',
                          color: 'var(--color-primary)',
                        }}
                      >
                        R$ {service.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <span
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      marginTop: '16px',
                      padding: '12px 16px',
                      backgroundColor: 'var(--color-primary)',
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      width: '100%',
                      transition: 'all var(--transition-base)',
                    }}
                  >
                    Agendar este Serviço
                  </span>
                </div>
              </Link>
            ))}
          </div>

        {/* Info Section */}
        <div
          style={{
            marginTop: '64px',
            padding: '32px',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ marginBottom: '8px', fontSize: '20px' }}>Dúvidas sobre nossos serviços?</h2>
          <p style={{ marginBottom: '16px', opacity: 0.9 }}>
            Entre em contato conosco via WhatsApp para mais informações
          </p>
          <a
            href="https://wa.me/5511916379775"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: 'white',
              color: 'var(--color-primary)',
              borderRadius: '999px',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all var(--transition-base)',
              boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
            }}
          >
            <WhatsAppIcon />
            Fale Conosco
          </a>
        </div>
      </div>
    </main>
  );
}
