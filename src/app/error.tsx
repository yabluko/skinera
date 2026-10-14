'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Щось пішло не так</h1>
        <p className="text-gray-600 mb-8">
          Виникла несподівана помилка. Будь ласка, спробуйте ще раз або поверніться на головну
          сторінку.
        </p>
        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full bg-brand-500 text-white px-6 py-3 rounded-lg hover:bg-brand-600 transition duration-300"
          >
            Спробувати ще раз
          </button>
          <Link
            href="/"
            className="block w-full text-gray-600 hover:text-gray-800 transition duration-300"
          >
            Повернутися на головну
          </Link>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Деталі помилки (тільки в режимі розробки)
            </summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded-sm text-xs overflow-auto">
              {error.message}
              {error.stack && '\n\n' + error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
