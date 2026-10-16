'use client';

import { useState } from 'react';
import Navigation from './Navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { UserIcon } from '@heroicons/react/24/outline';
import CartButton from './CartButton';
import FavoritesButton from './FavoritesButton';
import AuthModal from '../auth/AuthModal';
import ModalButton from '../common/ModalButton';
import ContactForm from '../forms/ContactForm';

const iconButton =
  'flex items-center gap-2 px-3 py-2 rounded-full text-skin-ink/80 hover:text-skin-ink transition-colors';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { data: session } = useSession();

  // Визначаємо яке ім'я показувати
  const displayName = session?.user?.name;

  const handleUserIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <header className="bg-skin-paper/90 backdrop-blur-md fixed top-0 w-full z-50 font-body text-skin-ink">
        <div className="px-[var(--gutter)] flex justify-between items-center gap-6 h-16">
          {/* Логотип */}
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
            <Image src="/icon/logo-ink.png" alt="" width={30} height={29} priority />
            <span className="font-display text-[26px] font-medium leading-none tracking-[0.02em]">
              Skinera
            </span>
          </Link>

          {/* Меню для великих екранів */}
          <div className="hidden md:flex items-center">
            <div className="mr-4 lg:mr-8">
              <Navigation />
            </div>
            <a
              href="tel:+380965180956"
              className="hidden xl:block mr-3 text-[13.5px] font-semibold whitespace-nowrap"
            >
              +38 096 518 0956
            </a>
            <FavoritesButton />
            <CartButton />
            {session || displayName ? (
              <Link href="/account" className={`${iconButton} text-[13.5px] font-medium`}>
                <UserIcon className="w-5 h-5" />
                <span>{displayName}</span>
              </Link>
            ) : (
              <button
                onClick={handleUserIconClick}
                className={iconButton}
                title="Увійти або зареєструватися"
                aria-label="Увійти або зареєструватися"
              >
                <UserIcon className="w-5 h-5" />
              </button>
            )}
            <ModalButton
              unstyled
              className="ml-3 inline-flex items-center min-h-[46px] px-6 rounded-full bg-skin-ink text-skin-white text-sm font-semibold tracking-[0.01em] whitespace-nowrap cursor-pointer transition duration-300 hover:bg-skin-pink-deep hover:-translate-y-px"
              buttonText="Записатися"
              modalContent={<ContactForm />}
            />
          </div>

          {/* Бургер-меню для мобільних екранів */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden grid place-items-center w-11 h-11 rounded-full border border-current"
            aria-label={isMenuOpen ? 'Закрити меню' : 'Меню'}
            aria-expanded={isMenuOpen}
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* Мобільне меню */}
        {isMenuOpen && (
          <div className="md:hidden bg-skin-paper border-t border-skin-gray-mid py-4 px-[var(--gutter)] flex flex-col gap-4 items-start justify-center">
            <div className="px-4">
              <Navigation isMobile onNavigate={() => setIsMenuOpen(false)} />
            </div>
            <div className="px-4 flex flex-col gap-4">
              <FavoritesButton isMobile onNavigate={() => setIsMenuOpen(false)} />
              <CartButton isMobile />
            </div>
            <div className="px-4 w-full border-t border-skin-gray-mid">
              {session || displayName ? (
                <Link
                  href="/account"
                  className="flex items-center space-x-2 py-2 rounded-full text-skin-ink/80 hover:text-skin-ink transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserIcon className="w-5 h-5" />
                  <span>{displayName}</span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="flex items-center space-x-2 py-2 rounded-full text-skin-ink/80 hover:text-skin-ink transition-colors w-full"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>Увійти або зареєструватися</span>
                </button>
              )}
            </div>
            <div className="px-4 w-full flex flex-col gap-3">
              <a href="tel:+380965180956" className="text-[13.5px] font-semibold">
                +38 096 518 0956
              </a>
              <ModalButton
                unstyled
                className="w-full min-h-[46px] px-6 rounded-full bg-skin-ink text-skin-white text-sm font-semibold transition-colors hover:bg-skin-pink-deep"
                buttonText="Записатися"
                modalContent={<ContactForm />}
              />
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab="signin"
        onSuccess={() => {
          setIsAuthModalOpen(false);
        }}
      />
    </>
  );
};

export default Header;
