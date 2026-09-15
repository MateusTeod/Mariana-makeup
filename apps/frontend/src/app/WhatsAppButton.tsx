'use client';

export function WhatsAppButton() {
  const phone = '5511916379775';
  const defaultMessage = encodeURIComponent(
    'Olá, Mariana! Gostaria de tirar uma dúvida sobre seus serviços de maquiagem.'
  );

  return (
    <aside aria-label="Atendimento via WhatsApp">
      <a
        href={`https://wa.me/${phone}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Falar com Mariana pelo WhatsApp"
      >
        <span className="whatsapp-float__icon" aria-hidden="true">💬</span>
        <span className="whatsapp-float__text">Falar no WhatsApp</span>
      </a>
    </aside>
  );
}
