'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import AuthModal from '../../components/auth/AuthModal';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      setShowAuthModal(true);
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="signin"
        onSuccess={() => {
          setShowAuthModal(false);
        }}
      />
    );
  }

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <div className="py-32 ">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg">
          {/* Header */}
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-2xl font-bold leading-6 text-gray-900">Особистий кабінет</h3>
          </div>

          {/* User Info */}
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900">Інформація про користувача</h4>
                <div className="mt-4 border rounded-md p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Імʼя користувача
                    </label>
                    <div className="mt-1 text-sm text-gray-900">{session.user?.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <div className="mt-1 text-sm text-gray-900">{session.user?.email}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={handleSignOut}
                    disabled={isLoading}
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Виходимо...' : 'Вийти з акаунту'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
