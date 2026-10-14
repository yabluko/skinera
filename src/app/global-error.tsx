'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="uk">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">💥</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Критична помилка</h1>
            <p className="text-gray-600 mb-8">
              Виникла серйозна помилка в роботі додатка. Будь ласка, оновіть сторінку.
            </p>
            <button
              onClick={reset}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Оновити сторінку
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Деталі помилки
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded-sm text-xs overflow-auto">
                  {error.message}
                  {error.stack && '\n\n' + error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
