import Link from 'next/link';
import { Header } from './Header';
import { FaqAccordion } from './FaqAccordion';
import styles from './page.module.css';

const WHATSAPP_NUMBER = '5511916379775';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  'Olá, Mariana! Gostaria de tirar uma dúvida sobre seus serviços de maquiagem.'
)}`;

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
    >
      <path d="M20.5 12.2a8.2 8.2 0 0 1-13.2 6.8L4 20l1.1-3.3A8.2 8.2 0 1 1 20.5 12.2Z" />
      <path d="M15.7 14.6c-.2-.1-1.1-.5-1.3-.6-.2-.1-.3-.1-.5.1-.1.1-.5.6-.6.8-.1.1-.3.1-.5 0-.2-.1-.9-.3-1.7-1.1-.6-.6-1.1-1.3-1.2-1.5-.1-.3 0-.4.1-.5.1-.1.1-.3.2-.4.1-.1.1-.3.2-.4.1-.1.1-.2.2-.4.1-.1.1-.2.1-.4 0-.1 0-.3-.1-.4-.1-.2-.5-1.2-.7-1.7-.2-.5-.4-.4-.5-.4h-.4c-.1 0-.3 0-.5.1-.2.1-.7.7-.7 1.7 0 1 .8 2 .9 2.1.1.1 1.5 2.5 3.7 3.4.5.2.9.4 1.2.5.5.1 1 .1 1.3.1.4-.1 1.1-.5 1.2-1 .1-.4.1-.8.1-1.1 0-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}

function FeatureIcon({ type }: { type: 'diamond' | 'sparkles' | 'heart' | 'clock' }) {
  const commonProps = {
    width: 26,
    height: 26,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (type) {
    case 'diamond':
      return (
        <svg {...commonProps}>
          <path d="M6 10.5L12 4L18 10.5L12 20L6 10.5Z" />
          <path d="M6 10.5H18M12 4L9 10.5M12 4L15 10.5M9 10.5L12 20M15 10.5L12 20" />
        </svg>
      );
    case 'sparkles':
      return (
        <svg {...commonProps}>
          <path d="M12 2V7M12 17V22M4.5 12H9.5M14.5 12H19.5M5.5 5.5L8 8M16 16L18.5 18.5M5.5 18.5L8 16M16 8L18.5 5.5" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...commonProps}>
          <path d="M12 20.5C11.5 20.5 4 16.5 2.5 10.8C1.7 7.9 3.8 4 7.5 4C9.7 4 11 5.4 12 6.5C13 5.4 14.3 4 16.5 4C20.2 4 22.3 7.9 21.5 10.8C20 16.5 12.5 20.5 12 20.5Z" />
        </svg>
      );
    case 'clock':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8V12L15 14" />
        </svg>
      );
    default:
      return null;
  }
}

function StarRating() {
  return (
    <div className={styles.testimonial__stars} aria-label="5 estrelas">
      <svg viewBox="0 0 120 24" aria-hidden="true">
        <path d="M12 1.5l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.8-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 1.5Z" />
        <path d="M36 1.5l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.8-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L36 1.5Z" />
        <path d="M60 1.5l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.8-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L60 1.5Z" />
        <path d="M84 1.5l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.8-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L84 1.5Z" />
        <path d="M108 1.5l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.8-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L108 1.5Z" />
      </svg>
    </div>
  );
}

export default function HomePage() {
  const services = [
    {
      id: 'maquiagem-social',
      title: 'Maquiagem Express',
      description: 'Acabamento sofisticado e pele blindada, ideal para convidadas, eventos corporativos e jantares especiais.',
      price: 'R$ 140',
      duration: '60 min',
    },
    {
      id: 'maquiagem-noivas',
      title: 'Maquiagem para Noivas',
      description: 'Produção completa de alta durabilidade para o seu grande dia, pensada para emocionar e brilhar nas fotos.',
      price: 'R$ 350',
      duration: '180 min',
      featured: true,
    },
    {
      id: 'maquiagem-formatura',
      title: 'Maquiagem para Formatura',
      description: 'Look deslumbrante e expressivo para sua noite de celebração, resistente a fotos com flash e muita festa.',
      price: 'R$ 180',
      duration: '60 min',
    },
    {
      id: 'maquiagem-eventos',
      title: 'Maquiagem para Eventos',
      description: 'Produção glamourosa com olhos marcantes e contorno iluminado para festas noturnas e galas.',
      price: 'R$ 200',
      duration: '75 min',
    },
  ];

  const galleryItems = [
    {
      tag: 'Noivas',
      title: 'Noiva Clássica & Glow',
      image: '/img/gallery/noiva1.jpeg',
    },
    {
      tag: 'Formaturas',
      title: 'Smokey Eyes & Sofisticação',
      image: '/img/gallery/formatura1.jpeg',
    },
    {
      tag: 'Social',
      title: 'Pele Iluminada & Natural',
      image: '/img/gallery/social1.jpeg',
    },
    {
      tag: 'Eventos',
      title: 'Glamour com Delineado Marcante',
      image: '/img/gallery/evento1.jpeg',
    },
  ];

  const features = [
    {
      icon: 'diamond' as const,
      title: 'Pele Blindada',
      text: 'Técnica exclusiva à prova d’água e atrito que garante durabilidade superior a 16 horas sem craquelar.',
    },
    {
      icon: 'sparkles' as const,
      title: 'Produtos de Elite',
      text: 'Uso exclusivo de cosméticos internacionais de marcas consagradas como MAC, NARS, Dior e Charlotte Tilbury.',
    },
    {
      icon: 'heart' as const,
      title: 'Atendimento Personalizado',
      text: 'Consultoria de visagismo que harmoniza a maquiagem com o seu estilo, vestido e a iluminação do evento.',
    },
    {
      icon: 'clock' as const,
      title: 'Pontualidade Rigorosa',
      text: 'Seu horário é sagrado e reservado exclusivamente para você, sem esperas e com total tranquilidade.',
    },
  ];

  const testimonials = [
    {
      name: 'Beatriz Mendonça',
      role: 'Noiva',
      avatar: 'B',
      quote:
        'Minha maquiagem de noiva ficou simplesmente mágica! Chorei de emoção na cerimônia, dancei até de manhã e a pele continuou perfeita, sem nenhum retoque. A Mariana é uma profissional maravilhosa!',
    },
    {
      name: 'Camila Duarte',
      role: 'Formanda de Medicina',
      avatar: 'C',
      quote:
        'Fiz a maquiagem para a minha colação e baile. O acabamento dos olhos e a durabilidade me surpreenderam demais. Todo mundo me perguntou quem tinha feito a minha make. Recomendo de olhos fechados!',
    },
    {
      name: 'Fernanda Silveira',
      role: 'Madrinha de Casamento',
      avatar: 'F',
      quote:
        'A Mariana tem uma mão leve e um bom gosto sem igual. Ela soube valorizar meus traços sem deixar pesado. Além de tudo, o atendimento foi super acolhedor e pontual. Já virei cliente fiel!',
    },
  ];

  return (
    <main>
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.hero__container}>
          <div className={styles.hero__content}>
            <span className={styles.hero__label}>MAQUIADORA PROFISSIONAL • GUARAREMA-SP</span>
            <h1 className={styles.hero__title}>Realçando sua beleza com elegância e perfeição.</h1>
            <p className={styles.hero__subtitle}>
              Atendimento exclusivo para noivas, formandas e momentos inesquecíveis.
              Técnicas modernas de pele blindada e produtos internacionais para você brilhar com total confiança.
            </p>

            <div className={styles.hero__actions}>
              <Link
                href="/agendar"
                className={`${styles.btn} ${styles['btn--primary']}`}
                style={{ padding: '14px 28px' }}
              >
                Agendar Minha Maquiagem
              </Link>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.btn} ${styles['btn--whatsapp']}`}
                style={{ padding: '14px 28px' }}
              >
                <span className={styles.whatsapp_button_icon}><WhatsAppIcon /></span>
                Falar no WhatsApp
              </a>
            </div>

            <div className={styles.hero__badges}>
              <span className={styles.hero__badge}>⭐ 5.0 (+500 clientes atendidas)</span>
              <span className={styles.hero__badge}>💎 Técnicas de Blindagem</span>
              <span className={styles.hero__badge}>✨ Produtos 100% Originais</span>
            </div>
          </div>

          <div className={styles.hero__image}>
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=800&fit=crop"
              alt="Maquiagem profissional por Mariana Aparicio"
            />
          </div>
        </div>
      </section>

      {/* Diferenciais / Features */}
      <section className={styles.features}>
        <div className="container">
          <h2 className={styles['section-title']}>Por que escolher Mariana Aparicio?</h2>
          <p className={styles['section-subtitle']}>
            Cuidado em cada detalhe para você viver uma experiência de beleza inesquecível
          </p>

          <div className={styles.features__grid}>
            {features.map((item) => (
              <div key={item.title} className={styles.feature__card}>
                <span className={styles.feature__icon}>
                  <FeatureIcon type={item.icon} />
                </span>
                <h3 className={styles.feature__title}>{item.title}</h3>
                <p className={styles.feature__text}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles['services-preview']}>
        <div className="container">
          <h2 className={styles['section-title']}>Nossos Serviços</h2>
          <p className={styles['section-subtitle']}>
            Escolha o atendimento sob medida para o seu momento especial
          </p>

          <div className={styles['services-preview__grid']}>
            {services.map((service) => (
              <div key={service.title} className={`${styles.card} ${styles['service-card']}`}>
                <div className={styles['service-card__content']}>
                  <h3 className={styles['service-card__title']}>{service.title}</h3>
                  <p className={styles['service-card__description']}>{service.description}</p>
                  <div className={styles['service-card__footer']}>
                    <span className={styles['service-card__price']}>{service.price}</span>
                    <span className={styles['service-card__duration']}>⏱️ {service.duration}</span>
                  </div>
                  <Link
                    href="/agendar"
                    className={`${styles.btn} ${styles['btn--primary']}`}
                    style={{ marginTop: '20px', width: '100%', padding: '12px' }}
                  >
                    Agendar este Serviço
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Mid-page WhatsApp CTA */}
          <div className={styles.mid_cta}>
            <h3 className={styles.mid_cta__title}>Ficou com alguma dúvida sobre o serviço ideal?</h3>
            <p className={styles.mid_cta__text}>
              Converse diretamente comigo no WhatsApp. Será um prazer tirar suas dúvidas sobre preparação de pele, horários ou atendimento para grupos.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.btn} ${styles['btn--whatsapp']}`}
              style={{ padding: '14px 32px' }}
            >
              <span className={styles.whatsapp_button_icon}><WhatsAppIcon /></span>
              Chamar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Gallery / Conheça Meu Trabalho */}
      <section className={styles.gallery}>
        <div className="container">
          <h2 className={styles['section-title']}>Conheça Meu Trabalho</h2>
          <p className={styles['section-subtitle']}>
            Confira algumas das produções e transformações recentes
          </p>

          <div className={styles.gallery__grid}>
            {galleryItems.map((item) => (
              <div key={item.title} className={styles.gallery__item}>
                <img src={item.image} alt={item.title} />
                <div className={styles.gallery__overlay}>
                  <span className={styles.gallery__tag}>{item.tag}</span>
                  <h3 className={styles.gallery__title}>{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Prova Social */}
      <section className={styles.testimonials}>
        <div className="container">
          <h2 className={styles['section-title']}>O Que Dizem as Clientes</h2>
          <p className={styles['section-subtitle']}>
            Depoimentos reais de quem confiou sua beleza em momentos especiais
          </p>

          <div className={styles.testimonials__grid}>
            {testimonials.map((item) => (
              <div key={item.name} className={styles.testimonial__card}>
                <div>
                  <StarRating />
                  <p className={styles.testimonial__quote}>"{item.quote}"</p>
                </div>
                <div className={styles.testimonial__author}>
                  <div className={styles.testimonial__avatar}>{item.avatar}</div>
                  <div>
                    <p className={styles.testimonial__name}>{item.name}</p>
                    <p className={styles.testimonial__role}>{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className={styles.faq}>
        <div className="container">
          <h2 className={styles['section-title']}>Perguntas Frequentes</h2>
          <p className={styles['section-subtitle']}>
            Tire suas principais dúvidas sobre o atendimento e agendamento
          </p>

          <FaqAccordion />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={styles.cta}>
        <div className="container">
          <h2 className={styles['cta__title']}>Pronta para se sentir ainda mais maravilhosa?</h2>
          <p className={styles['cta__text']}>
            Garanta sua data e horário com facilidade. Os finais de semana costumam esgotar rapidamente, agende com antecedência.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/agendar"
              className={`${styles.btn} ${styles['btn--primary']}`}
              style={{ backgroundColor: 'white', color: 'var(--color-text)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', padding: '14px 28px' }}
            >
              Reservar Meu Horário Agora
            </Link>
            
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles['footer__content']}>
            <div className={styles['footer__brand']}>
              <h3>Mariana Aparicio</h3>
              <p style={{ marginTop: '8px' }}>Maquiadora Profissional</p>
              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '8px' }}>
                Atendimento com hora marcada em estúdio em Guararema-SP.
              </p>
            </div>
            <div className={styles['footer__links']}>
              <h4 style={{ color: '#d6ae65', fontSize: '16px', marginBottom: '8px' }}>Links Rápidos</h4>
              <Link href="/servicos">Nossos Serviços</Link>
              <Link href="/agendar">Agendar Horário</Link>
              <Link href="/minha-agenda">Meus Agendamentos</Link>
              <Link href="/privacidade">Política de Privacidade</Link>
              <Link href="/termos">Termos de Uso</Link>
            </div>
            <div className={styles['footer__contact']}>
              <h4 style={{ color: '#d6ae65', fontSize: '16px', marginBottom: '8px' }}>Atendimento</h4>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                Segunda a Sexta: 08:00 às 18:00
              </p>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>
                Sábados: 08:00 às 14:00
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#25D366',
                  color: 'white',
                  padding: '10px 18px',
                  borderRadius: '999px',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}
              >
                <span className={styles.whatsapp_button_icon}><WhatsAppIcon /></span>
                WhatsApp: (11) 91637-9775
              </a>
            </div>
          </div>
          <div className={styles['footer__bottom']}>
            <p>&copy; 2026 Mariana Aparicio. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
