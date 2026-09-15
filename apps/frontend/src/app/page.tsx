import Link from 'next/link';
import { Header } from './Header';
import { FaqAccordion } from './FaqAccordion';
import styles from './page.module.css';

const WHATSAPP_NUMBER = '5511916379775';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  'Olá, Mariana! Gostaria de tirar uma dúvida sobre seus serviços de maquiagem.'
)}`;

export default function HomePage() {
  const services = [
    {
      id: 'maquiagem-social',
      title: 'Maquiagem Social',
      description: 'Acabamento sofisticado e pele blindada, ideal para convidadas, eventos corporativos e jantares especiais.',
      price: 'R$ 150',
      duration: '60 min',
    },
    {
      id: 'maquiagem-noivas',
      title: 'Maquiagem para Noivas',
      description: 'Produção completa de alta durabilidade para o seu grande dia, pensada para emocionar e brilhar nas fotos.',
      price: 'R$ 350',
      duration: '90 min',
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
    {
      id: 'maquiagem-cilios',
      title: 'Maquiagem + Cílios Postiços',
      description: 'Produção completa com aplicação personalizada de cílios de alta qualidade para um olhar marcante.',
      price: 'R$ 200',
      duration: '75 min',
    },
    {
      id: 'maquiagem-express',
      title: 'Maquiagem Express',
      description: 'Visual natural, elegante e rápido para reuniões, fotos de perfil ou compromissos do dia a dia.',
      price: 'R$ 90',
      duration: '30 min',
    },
  ];

  const galleryItems = [
    {
      tag: 'Noivas',
      title: 'Noiva Clássica & Glow',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&fit=crop',
    },
    {
      tag: 'Formaturas',
      title: 'Smokey Eyes & Sofisticação',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&fit=crop',
    },
    {
      tag: 'Social',
      title: 'Pele Iluminada & Natural',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&fit=crop',
    },
    {
      tag: 'Eventos',
      title: 'Glamour com Delineado Marcante',
      image: 'https://images.unsplash.com/photo-1503236965004-941e974e62a8?w=800&fit=crop',
    },
  ];

  const features = [
    {
      icon: '💎',
      title: 'Pele Blindada',
      text: 'Técnica exclusiva à prova d’água e atrito que garante durabilidade superior a 16 horas sem craquelar.',
    },
    {
      icon: '✨',
      title: 'Produtos de Elite',
      text: 'Uso exclusivo de cosméticos internacionais de marcas consagradas como MAC, NARS, Dior e Charlotte Tilbury.',
    },
    {
      icon: '🤍',
      title: 'Atendimento Personalizado',
      text: 'Consultoria de visagismo que harmoniza a maquiagem com o seu estilo, vestido e a iluminação do evento.',
    },
    {
      icon: '⏰',
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
            <span className={styles.hero__label}>MAQUIADORA PROFISSIONAL • SÃO PAULO</span>
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
                <span>💬</span> Falar no WhatsApp
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
                <span className={styles.feature__icon}>{item.icon}</span>
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
              <span>💬</span> Chamar no WhatsApp
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
                  <div className={styles.testimonial__stars}>⭐⭐⭐⭐⭐</div>
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
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.btn} ${styles['btn--whatsapp']}`}
              style={{ padding: '14px 28px' }}
            >
              <span>💬</span> Falar pelo WhatsApp
            </a>
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
                Atendimento com hora marcada em estúdio e a domicílio em São Paulo.
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
                <span>💬</span> WhatsApp: (11) 91637-9775
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
