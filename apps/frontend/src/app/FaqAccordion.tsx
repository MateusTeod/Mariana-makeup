'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'Como funciona o agendamento online?',
    answer:
      'O agendamento é 100% online e intuitivo: você escolhe o serviço desejado, seleciona a data no calendário, visualiza os horários disponíveis em tempo real e confirma seus dados. Em menos de 2 minutos seu horário está reservado.',
  },
  {
    question: 'Quanto tempo dura a sessão de maquiagem?',
    answer:
      'A duração varia conforme o serviço: Maquiagem Express (60 min), Maquiagem para Formatura (60 min), Maquiagem para Eventos (75 min) e Maquiagem para Noivas (180 min de produção completa e exclusiva).',
  },
  {
    question: 'A maquiagem resiste a lágrimas, suor e calor?',
    answer:
      'Sim! Utilizamos a técnica de blindagem de pele à prova d’água e produtos de alta fixação das marcas mais conceituadas do mundo (como MAC, Dior, NARS e Charlotte Tilbury). Sua produção permanece intacta por mais de 16 horas.',
  },
  {
    question: 'Onde é realizado o atendimento?',
    answer:
      'Os atendimentos com horário agendado são realizados em estúdio exclusivo em São Paulo, preparado com iluminação profissional e todo conforto. Para atendimento a domicílio ou em hotéis (dia da noiva/formanda), entre em contato pelo WhatsApp para consultar disponibilidade.',
  },
  {
    question: 'Posso cancelar ou remarcar caso tenha um imprevisto?',
    answer:
      'Sim! Entendemos que imprevistos acontecem. Você pode gerenciar ou cancelar seu agendamento na aba "Meus Agendamentos" com pelo menos 24 horas de antecedência do horário marcado.',
  },
  {
    question: 'Com quanta antecedência devo reservar?',
    answer:
      'Para finais de semana e datas concorridas (temporada de noivas e formaturas), recomendamos reservar com pelo menos 2 a 4 semanas de antecedência para garantir o melhor horário para você.',
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.faq__list}>
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.question}
            className={`${styles.faq__item}${isOpen ? ` ${styles['faq__item--open']}` : ''}`}
          >
            <button
              className={styles.faq__question}
              onClick={() => toggleFaq(index)}
              aria-expanded={isOpen}
            >
              <span>{faq.question}</span>
              <span className={styles.faq__icon}>{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div className={styles.faq__answer}>
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
