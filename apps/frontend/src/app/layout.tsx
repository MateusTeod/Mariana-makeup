import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mariana Aparicio - Maquiadora Profissional',
  description:
    'Agende sua maquiagem profissional com Mariana Aparicio. Atendimento personalizado para casamentos, formaturas e eventos.',
  keywords: ['maquiagem', 'maquiadora', 'agendamento', 'beleza', 'casamento', 'formatura'],
  openGraph: {
    title: 'Mariana Aparicio - Maquiadora Profissional',
    description: 'Agende sua maquiagem profissional',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
