import Link from 'next/link';
import { Header } from '../Header';

export default function PrivacidadePage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <Header />
      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '64px 24px' }}>
        <Link href="/" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
          ← Voltar para a página inicial
        </Link>
        <h1 style={{ marginTop: '24px', marginBottom: '16px', fontSize: '2.5rem' }}>Política de Privacidade</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
          Última atualização: Setembro de 2026
        </p>

        <div style={{ backgroundColor: 'white', padding: '36px', borderRadius: '16px', border: '1px solid var(--color-border)', lineHeight: '1.8' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>1. Informações que Coletamos</h2>
          <p style={{ marginBottom: '20px', color: 'var(--color-text-secondary)' }}>
            Para realizar e gerenciar seus agendamentos, coletamos apenas os dados estritamente necessários: nome completo, endereço de e-mail e número de telefone (WhatsApp).
          </p>

          <h2 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>2. Como Utilizamos seus Dados</h2>
          <p style={{ marginBottom: '20px', color: 'var(--color-text-secondary)' }}>
            Seus dados são utilizados exclusivamente para confirmação de agendamento, envio de lembretes da sessão e comunicações de atendimento personalizadas via WhatsApp ou e-mail.
          </p>

          <h2 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>3. Segurança e Sigilo (LGPD)</h2>
          <p style={{ marginBottom: '20px', color: 'var(--color-text-secondary)' }}>
            Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), suas informações são armazenadas em ambiente seguro e jamais serão vendidas, alugadas ou compartilhadas com terceiros.
          </p>

          <h2 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>4. Seus Direitos</h2>
          <p style={{ marginBottom: '20px', color: 'var(--color-text-secondary)' }}>
            Você tem o direito de solicitar a consulta, retificação ou exclusão permanente dos seus dados cadastrais a qualquer momento através do nosso canal de atendimento pelo WhatsApp.
          </p>
        </div>
      </div>
    </main>
  );
}
