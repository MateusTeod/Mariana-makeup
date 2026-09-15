import Link from 'next/link';
import { Header } from '../Header';

export default function TermosPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <Header />
      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '64px 24px' }}>
        <Link href="/" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
          ← Voltar para a página inicial
        </Link>
        <h1 style={{ marginTop: '24px', marginBottom: '16px', fontSize: '2.5rem' }}>Termos de Uso e Atendimento</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
          Última atualização: Setembro de 2026
        </p>

        <div style={{ backgroundColor: 'white', padding: '36px', borderRadius: '16px', border: '1px solid var(--color-border)', lineHeight: '1.8' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>1. Agendamentos e Horários</h2>
          <p style={{ marginBottom: '20px', color: 'var(--color-text-secondary)' }}>
            O agendamento realizado pelo site garante o bloqueio exclusivo daquele período para você. Pedimos a gentileza de chegar com 10 minutos de antecedência do horário agendado.
          </p>

          <h2 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>2. Política de Cancelamento e Reagendamento</h2>
          <p style={{ marginBottom: '20px', color: 'var(--color-text-secondary)' }}>
            Cancelamentos ou remarcações devem ser efetuados com no mínimo <strong>24 horas de antecedência</strong> através da área "Meus Agendamentos" ou contato direto pelo WhatsApp.
          </p>

          <h2 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>3. Preparação para o Atendimento</h2>
          <p style={{ marginBottom: '20px', color: 'var(--color-text-secondary)' }}>
            Para garantir a máxima durabilidade da blindagem, recomendamos comparecer com a pele limpa e hidratada, sem resíduos de maquiagem anterior. Informe previamente caso possua alguma alergia ou sensibilidade ocular/cutânea.
          </p>

          <h2 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>4. Formas de Pagamento</h2>
          <p style={{ marginBottom: '20px', color: 'var(--color-text-secondary)' }}>
            O pagamento pode ser efetuado via Pix, cartão de crédito/débito no momento do atendimento.
          </p>
        </div>
      </div>
    </main>
  );
}
