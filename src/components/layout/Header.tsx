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
import { usePermanentClientStore } from '../store/permanentClientStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { data: session } = useSession();
  const { shouldShowPermanentClientName, clientInfo } = usePermanentClientStore();

  // Визначаємо яке ім'я показувати
  const displayName =
    session?.user?.name || (shouldShowPermanentClientName() ? clientInfo?.name : null);

  const handleUserIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <header className="bg-white shadow-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          {/* Логотип */}
          <Link href="/" className="flex items-center space-x-3 cursor-pointer">
            <div className="bg-brand-600 rounded-full p-1">
              <Image src="/icon/icon.svg" alt="Skinera Logo" width={32} height={32} />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Skinera
            </span>
          </Link>

          {/* Меню для великих екранів */}
          <div className="hidden md:flex items-center">
            <div className="mr-10">
              <Navigation />
            </div>
            <FavoritesButton />
            <CartButton />
            {session || displayName ? (
              <Link
                href="/account"
                className="flex items-center space-x-2 px-4 py-2 rounded-full text-gray-700 hover:text-brand-600 transition-colors"
              >
                <UserIcon className="w-5 h-5" />
                <span>{displayName}</span>
              </Link>
            ) : (
              <button
                onClick={handleUserIconClick}
                className="flex items-center space-x-2 px-4 py-2 rounded-full text-gray-700 hover:text-brand-600 transition-colors"
                title="Увійти або зареєструватися"
              >
                <UserIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Бургер-меню для мобільних екранів */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* Мобільне меню */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg py-2 px-4 flex flex-col gap-4 items-start justify-center">
            <h3 className="text-xl font-bold mx-auto">Меню</h3>
            <div className="px-4">
              <Navigation isMobile onNavigate={() => setIsMenuOpen(false)} />
            </div>
            <div className="px-4 flex flex-col gap-4">
              <FavoritesButton isMobile onNavigate={() => setIsMenuOpen(false)} />
              <CartButton isMobile />
            </div>
            <div className="px-4  border-t border-gray-100">
              {session || displayName ? (
                <Link
                  href="/account"
                  className="flex items-center space-x-2 px-4 py-2 rounded-full text-gray-700 hover:text-brand-600 transition-colors"
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
                  className="flex items-center space-x-2  py-2 rounded-full text-gray-700 hover:text-brand-600 transition-colors w-full"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>Увійти або зареєструватися</span>
                </button>
              )}
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
