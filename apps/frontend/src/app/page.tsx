import Link from 'next/link';
import { Header } from './Header';
import styles from './page.module.css';


export default function HomePage() {
  return (
    <main>
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.hero__container}>
          <div className={styles.hero__content}>
            <span className={styles.hero__label}>MAQUIADORA PROFISSIONAL</span>
            <h1 className={styles.hero__title}>Mariana Aparicio</h1>
            <p className={styles.hero__subtitle}>
              Realcando sua beleza para momentos inesqueciveis. Transformo cada
              cliente em sua melhor versao com tecnicas profissionais e produtos
              de alta qualidade.
            </p>
            <div className={styles.hero__actions}>
              <Link href="/agendar" className={`${styles.btn} ${styles['btn--primary']} ${styles['btn--sm']} ${styles['btn--outline']}`}>
                Agendar Horario
              </Link>
              <Link href="/servicos" className={`${styles.btn} ${styles['btn--primary']} ${styles['btn--sm']} ${styles['btn--outline']}`}>
                Ver Serviços
              </Link>
            </div>
          </div>
          <div className={styles.hero__image}>
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=800&fit=crop"
              alt="Maquiagem profissional"
            />
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className={styles['services-preview']}>
        <div className="container">
          <h2 className={styles['section-title']}>Especialidades</h2>
          <p className={styles['section-subtitle']}>
            Atendimento personalizado para cada ocasião
          </p>
          <div className={styles['services-preview__grid']}>
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
              <div key={service.title} className={`${styles['service-card']} ${styles.card}`}>
                <div className={styles['service-card__content']}>
                  <h3 className={styles['service-card__title']}>{service.title}</h3>
                  <p className={styles['service-card__description']}>
                    {service.description}
                  </p>
                  <div className={styles['service-card__footer']}>
                    <span className={styles['service-card__price']}>{service.price}</span>
                    <span className={styles['service-card__duration']}>
                      {service.duration}
                    </span>
                  </div>
                  <Link
                    href="/agendar"
                    className={`${styles.btn} ${styles['btn--outline']} ${styles['btn--sm']}`}
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
      <section className={styles.cta}>
        <div className="container">
          <h2 className={styles['cta__title']}>Pronta para ficar ainda mais linda?</h2>
          <p className={styles['cta__text']}>
            Agende seu horário de forma rápida e fácil. Escolha o serviço, a
            data e o horário que melhor funciona para você.
          </p>
          <Link href="/agendar" className={`${styles.btn} ${styles['btn--primary']} ${styles['btn--lg']}`}>
            Agendar Agora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles['footer__content']}>
            <div className={styles['footer__brand']}>
              <h3>Mariana Aparicio</h3>
              <p>Maquiadora Profissional</p>
            </div>
            <div className={styles['footer__links']}>
              <Link href="/servicos">Servicos</Link>
              <Link href="/agendar">Agendar</Link>
              <Link href="/privacidade">Privacidade</Link>
              <Link href="/termos">Termos de Uso</Link>
            </div>
            <div className={styles['footer__contact']}>
              <a
                href="https://wa.me/5511916379775"
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar pelo WhatsApp
              </a>
            </div>
          </div>
          <div className={styles['footer__bottom']}>
            <p>&copy; 2024 Mariana Aparicio. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
