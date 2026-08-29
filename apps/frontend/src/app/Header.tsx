'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useState } from 'react';
import styles from './page.module.css';

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
                    📅 Meus Agendamentos
                  </Link>
                  <Link
                    href="/perfil"
                    className={styles.nav__dropdown_item}
                    onClick={() => setDropdownOpen(false)}
                  >
                    👤 Perfil
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
                    🚪 Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className={styles.nav__link}>
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className={`${styles.btn} ${styles['btn--primary']} ${styles['btn--sm']} ${styles['btn--outline']} `}>
              
                Criar Conta
              </Link>
            </>
          )}

          {!isLoading && isAuthenticated && (
            <Link
              href="/agendar"
              className={`${styles.btn} ${styles['btn--primary']} ${styles['btn--sm']}`}
            >
              Agendar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
