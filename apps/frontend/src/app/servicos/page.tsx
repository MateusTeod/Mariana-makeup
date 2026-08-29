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

export default function ServicosPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/services`);

        if (!response.ok) {
          throw new Error('Erro ao carregar serviços');
        }

        const data = await response.json();
        setServices(data);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setServices([]);
      } finally {
        setLoading(false);
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

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fce4ec',
            color: 'var(--color-danger)',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '32px',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '48px 24px',
            color: 'var(--color-text-secondary)',
          }}>
            Carregando serviços...
          </div>
        )}

        {/* Services Grid */}
        {!loading && services.length > 0 && (
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
                      backgroundColor: 'var(--color-primary)',
                      display: 'grid',
                      placeItems: 'center',
                      marginBottom: '16px',
                      fontSize: '32px',
                    }}
                  >
                    ✨
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
                    <div>
                      <span style={{
                        fontSize: '12px',
                        color: 'var(--color-text-secondary)',
                      }}>
                        ⏱️ {service.duration} min
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
                  <button
                    style={{
                      marginTop: '16px',
                      padding: '12px 16px',
                      backgroundColor: 'var(--color-primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      width: '100%',
                      transition: 'all var(--transition-base)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                  >
                    Agendar Agora
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && services.length === 0 && !error && (
          <div style={{
            textAlign: 'center',
            padding: '48px 24px',
            color: 'var(--color-text-secondary)',
          }}>
            <p style={{ fontSize: '18px', marginBottom: '16px' }}>
              📭 Nenhum serviço disponível no momento
            </p>
          </div>
        )}

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
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: 'white',
              color: 'var(--color-primary)',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all var(--transition-base)',
            }}
          >
            💬 Fale Conosco
          </a>
        </div>
      </div>
    </main>
  );
}
