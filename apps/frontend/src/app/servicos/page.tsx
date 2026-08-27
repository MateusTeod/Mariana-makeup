'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  duration: number;
  image: string | null;
}

export default function ServicosPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/services')
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <nav className="nav">
        <div className="nav__container">
          <Link href="/" className="nav__logo">Mariana Aparicio</Link>
          <div className="nav__links">
            <Link href="/login" className="nav__link">Entrar</Link>
            <Link href="/agendar" className="btn btn--primary btn--sm">Agendar</Link>
          </div>
        </div>
      </nav>

      <div className="container" style={{ padding: '48px 24px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: 12 }}>Nossos Servicos</h1>
        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginBottom: 48 }}>
          Escolha o servico ideal para a sua ocasiao
        </p>

        {loading ? (
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: 200 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {services.map((service) => (
              <div key={service.id} className="card" style={{ padding: 24 }}>
                <h3 style={{ marginBottom: 8 }}>{service.name}</h3>
                {service.description && (
                  <p style={{ color: 'var(--color-text-secondary)', marginBottom: 16, fontSize: 14 }}>
                    {service.description}
                  </p>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-primary)' }}>
                    R$ {Number(service.price).toFixed(2)}
                  </span>
                  <span style={{ color: 'var(--color-muted)', fontSize: 14 }}>
                    {service.duration} min
                  </span>
                </div>
                <Link
                  href={`/agendar?service=${service.id}`}
                  className="btn btn--primary btn--sm"
                  style={{ width: '100%' }}
                >
                  Agendar
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
