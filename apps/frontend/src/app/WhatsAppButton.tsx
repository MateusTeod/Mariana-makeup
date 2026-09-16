'use client';

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.5 12.2a8.2 8.2 0 0 1-13.2 6.8L4 20l1.1-3.3A8.2 8.2 0 1 1 20.5 12.2Z" />
      <path d="M15.7 14.6c-.2-.1-1.1-.5-1.3-.6-.2-.1-.3-.1-.5.1-.1.1-.5.6-.6.8-.1.1-.3.1-.5 0-.2-.1-.9-.3-1.7-1.1-.6-.6-1.1-1.3-1.2-1.5-.1-.3 0-.4.1-.5.1-.1.1-.3.2-.4.1-.1.1-.3.2-.4.1-.1.1-.2.2-.4.1-.1.1-.2.1-.4 0-.1 0-.3-.1-.4-.1-.2-.5-1.2-.7-1.7-.2-.5-.4-.4-.5-.4h-.4c-.1 0-.3 0-.5.1-.2.1-.7.7-.7 1.7 0 1 .8 2 .9 2.1.1.1 1.5 2.5 3.7 3.4.5.2.9.4 1.2.5.5.1 1 .1 1.3.1.4-.1 1.1-.5 1.2-1 .1-.4.1-.8.1-1.1 0-.1-.2-.2-.4-.3Z" fill="white" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.35" cy="6.65" r="1.2" fill="currentColor" stroke="currentColor" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M15.8 3.5c.6 1.7 1.9 3.1 3.7 3.8v2.7a6.3 6.3 0 0 1-3.7-1.1v6.2a5.1 5.1 0 1 1-5.1-5.1c.2 0 .5 0 .7.1v2.7a2.5 2.5 0 1 0 1.8 2.4V3.5h2.6Z" />
    </svg>
  );
}

export function WhatsAppButton() {
  const phone = '5511916379775';
  const defaultMessage = encodeURIComponent(
    'Olá, Mariana! Gostaria de tirar uma dúvida sobre seus serviços de maquiagem.'
  );

  const socials = [
    {
      href: `https://wa.me/${phone}?text=${defaultMessage}`,
      label: 'WhatsApp',
      Icon: WhatsAppIcon,
      className: 'whatsapp-float__item--wpp',
    },
    {
      href: 'https://instagram.com/marianamakeup',
      label: 'Instagram',
      Icon: InstagramIcon,
      className: 'whatsapp-float__item--instagram',
    },
    {
      href: 'https://www.tiktok.com/@marianamakeup',
      label: 'TikTok',
      Icon: TikTokIcon,
      className: 'whatsapp-float__item--tiktok',
    },
  ];

  return (
    <aside aria-label="Contato e redes sociais">
      <div className="whatsapp-float" role="group" aria-label="Redes sociais e WhatsApp">
        {socials.map(({ href, label, Icon, className }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`whatsapp-float__item ${className}`}
            aria-label={label}
          >
            <Icon />
          </a>
        ))}
      </div>
    </aside>
  );
}
