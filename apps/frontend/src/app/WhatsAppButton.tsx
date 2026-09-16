'use client';

function WhatsAppIcon() {
  return (
    <svg
      width="20"
      height="20"
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
        <span className="whatsapp-float__icon" aria-hidden="true"><WhatsAppIcon /></span>
        <span className="whatsapp-float__text">Falar no WhatsApp</span>
      </a>
    </aside>
  );
}
