import Link from 'next/link';



export default function HomePage() {
  return (
    <main>
      {/* Navigation */}
      <nav className="nav">
        <div className="nav__container">
          <Link href="/" className="nav__logo">
            Mariana Aparicio
          </Link>
          <div className="nav__links">
            <Link href="/servicos" className="nav__link">
              Servicos
            </Link>
            <Link href="/login" className="nav__link">
              Entrar
            </Link>
            <Link href="/agendar" className="btn btn--primary btn--sm">
              Agendar Horario
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero__container">
          <div className="hero__content">
            <span className="hero__label">MAQUIADORA PROFISSIONAL</span>
            <h1 className="hero__title">Mariana Aparicio</h1>
            <p className="hero__subtitle">
              Realcando sua beleza para momentos inesqueciveis. Transformo cada
              cliente em sua melhor versao com tecnicas profissionais e produtos
              de alta qualidade.
            </p>
            <div className="hero__actions">
              <Link href="/agendar" className="btn btn--primary btn--lg">
                Agendar Horario
              </Link>
              <Link href="/servicos" className="btn btn--outline btn--lg">
                Ver Servicos
              </Link>
            </div>
          </div>
          <div className="hero__image">
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=800&fit=crop"
              alt="Maquiagem profissional"
            />
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="services-preview">
        <div className="container">
          <h2 className="section-title">Especialidades</h2>
          <p className="section-subtitle">
            Atendimento personalizado para cada ocasião
          </p>
          <div className="services-preview__grid">
            {[
              {
                title: 'Maquiagem Social',
                description: 'Perfeita para eventos e ocasiões especiais',
                price: 'R$ 150',
                duration: '60 min',
              },
              {
                title: 'Maquiagem para Noivas',
                description: 'Um look deslumbrante para o seu grande dia',
                price: 'R$ 350',
                duration: '90 min',
              },
              {
                title: 'Maquiagem para Formatura',
                description: 'Brilhe na sua formatura com uma maquiagem única',
                price: 'R$ 180',
                duration: '60 min',
              },
              {
                title: 'Maquiagem Express',
                description: 'Rápida e elegante para o dia a dia',
                price: 'R$ 90',
                duration: '30 min',
              },
            ].map((service) => (
              <div key={service.title} className="service-card card">
                <div className="service-card__content">
                  <h3 className="service-card__title">{service.title}</h3>
                  <p className="service-card__description">
                    {service.description}
                  </p>
                  <div className="service-card__footer">
                    <span className="service-card__price">{service.price}</span>
                    <span className="service-card__duration">
                      {service.duration}
                    </span>
                  </div>
                  <Link
                    href="/agendar"
                    className="btn btn--outline btn--sm"
                    style={{ marginTop: '16px', width: '100%' }}
                  >
                    Agendar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2 className="cta__title">Pronta para ficar ainda mais linda?</h2>
          <p className="cta__text">
            Agende seu horário de forma rápida e fácil. Escolha o serviço, a
            data e o horário que melhor funciona para você.
          </p>
          <Link href="/agendar" className="btn btn--primary btn--lg">
            Agendar Agora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer__content">
            <div className="footer__brand">
              <h3>Mariana Aparicio</h3>
              <p>Maquiadora Profissional</p>
            </div>
            <div className="footer__links">
              <Link href="/servicos">Servicos</Link>
              <Link href="/agendar">Agendar</Link>
              <Link href="/privacidade">Privacidade</Link>
              <Link href="/termos">Termos de Uso</Link>
            </div>
            <div className="footer__contact">
              <a
                href="https://wa.me/5511916379775"
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar pelo WhatsApp
              </a>
            </div>
          </div>
          <div className="footer__bottom">
            <p>&copy; 2024 Mariana Aparicio. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
