'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useState } from 'react';
import styles from './page.module.css';

function NavIcon({ type }: { type: 'calendar' | 'user' | 'logout' }) {
  const commonProps = {
    width: 15,
    height: 15,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (type) {
    case 'calendar':
      return (
        <svg {...commonProps}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3V7M16 3V7M3 10H21" />
        </svg>
      );
    case 'user':
      return (
        <svg {...commonProps}>
          <path d="M20 21C20 17.8 16.8 15 12 15C7.2 15 4 17.8 4 21" />
          <circle cx="12" cy="8" r="4" />
        </svg>
      );
    case 'logout':
      return (
        <svg {...commonProps}>
          <path d="M9 21H5C4.4 21 4 20.6 4 20V4C4 3.4 4.4 3 5 3H9" />
          <path d="M16 17L21 12L16 7" />
          <path d="M21 12H9" />
        </svg>
      );
    default:
      return null;
  }
}

export function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      <div className={styles.nav__container}>
        <Link href="/" className={styles.nav__logo} >
          Mariana Aparicio
        </Link>
        <div className={styles.nav__links}>
          <Link href="/servicos" className={styles.nav__link}>
            Serviços
          </Link>

          {isLoading ? (
            <div style={{ width: '100px', height: '36px', background: '#f0f0f0', borderRadius: '4px' }} />
          ) : isAuthenticated && user ? (
            <div className={styles.nav__user}>
              <button
                className={styles.nav__user_button}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span>{user.name.split(' ')[0]}</span>
                <span className={styles.nav__user_avatar}>{user.name[0]}</span>
              </button>

              {dropdownOpen && (
                <div className={styles.nav__dropdown}>
                  <div className={styles.nav__dropdown_header}>
                    {user.name}
                    <br />
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      {user.email}
                    </span>
                  </div>
                  <div className={styles.nav__dropdown_divider} />
                  <Link
                    href="/minha-agenda"
                    className={styles.nav__dropdown_item}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span className={styles.nav__dropdown_icon}><NavIcon type="calendar" /></span>
                    Meus Agendamentos
                  </Link>
                  <Link
                    href="/perfil"
                    className={styles.nav__dropdown_item}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span className={styles.nav__dropdown_icon}><NavIcon type="user" /></span>
                    Perfil
                  </Link>
                  <div className={styles.nav__dropdown_divider} />
                  <button
                    className={styles.nav__dropdown_item}
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    style={{ width: '100%', textAlign: 'left', color: 'var(--color-danger)' }}
                  >
                    <span className={styles.nav__dropdown_icon}><NavIcon type="logout" /></span>
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className={styles.nav__link}>
                Entrar
              </Link>
            </>
          )}

          <Link
            href="/agendar"
            className={`${styles.btn} ${styles['btn--primary']} ${styles['btn--sm']}`}
            style={{ fontWeight: 600 }}
          >
            Agendar Horário
          </Link>
        </div>
      </div>
    </nav>
  );
}
