import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface PermanentClientFormProps {
  onContinue?: () => void;
}

const PermanentClientForm = ({ onContinue }: PermanentClientFormProps = {}) => {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Автозаповнення email для зареєстрованих користувачів
  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  // Функція для перевірки користувача (email + пароль)
  const validateUser = async () => {
    if (!email.trim()) {
      setValidationError('Введіть email');
      return false;
    }

    if (!password.trim()) {
      setValidationError('Введіть пароль');
      return false;
    }

    setIsValidating(true);
    setValidationError('');

    try {
      // Перевіряємо credentials через наш API
      const response = await fetch('/api/auth/validate-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setValidationError('');
        return true;
      } else {
        setValidationError(data.message || 'Невірний email або пароль');
        return false;
      }
    } catch (error) {
      console.error('Validation error:', error);
      setValidationError('Помилка перевірки користувача');
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  // Обробник кнопки для неавторизованих користувачів
  const handleContinue = async () => {
    if (session?.user) {
      // Для зареєстрованих користувачів просто продовжуємо
      onContinue?.();
    } else {
      // Для неавторизованих перевіряємо існування користувача
      const isValid = await validateUser();
      if (isValid) {
        onContinue?.();
      }
    }
  };
  return (
    <div id="permanent-customer" aria-labelledby="tab-2">
      {session?.user ? (
        <p className="mb-11">
          Ви увійшли як зареєстрований клієнт. Ваші дані автоматично заповнені. Якщо потрібно
          змінити пароль, введіть новий пароль нижче.
        </p>
      ) : (
        <p className="mb-11">
          Якщо ви зареєстрований клієнт, введіть ваш логін/email та пароль, якщо ви ще не є нашим
          клієнтом, то перейдіть у розділ Новий покупець і заповніть поля потрібною інформацією.{' '}
        </p>
      )}

      <div className="flex gap-20">
        <div className="relative flex-1">
          <input
            type="text"
            id="parmanent-email"
            placeholder=" "
            value={email}
            onChange={e => setEmail(e.target.value)}
            readOnly={!!session?.user}
            className={`peer w-full border-0 border-b border-[#ebebeb] p-0 focus:outline-none focus:border-b focus:border-[#ebebeb] focus:ring-0 focus:shadow-none ${
              session?.user ? 'bg-gray-50 cursor-not-allowed' : ''
            }`}
          />
          <label
            htmlFor="parmanent-email"
            className={`absolute text-gray-400 pointer-events-none transition-all duration-200
        peer-focus:-top-6 peer-focus:text-[13px] ${
          email ? '-top-6 left-0 text-[13px]' : ' top-0 left-0 text-sm'
        }`}
          >
            E-mail
          </label>
          <span
            className="absolute left-0 bottom-0 h-[1px] w-0 bg-purple-600 
        transition-all duration-500 ease-in-out 
        origin-left peer-focus:w-full z-10"
          ></span>
        </div>

        <div className="relative flex-1">
          <input
            type="password"
            id="parmanent-password"
            placeholder=" "
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="peer w-full border-0 border-b border-[#ebebeb] p-0 focus:outline-none focus:border-b focus:border-[#ebebeb] focus:ring-0 focus:shadow-none"
          />
          <label
            htmlFor="parmanent-password"
            className={`absolute text-gray-400 pointer-events-none transition-all duration-200
        peer-focus:-top-6 peer-focus:text-[13px] ${
          password ? '-top-6 left-0 text-[13px]' : ' top-0 left-0 text-sm'
        }`}
          >
            Пароль
          </label>
          <span
            className="absolute left-0 bottom-0 h-[1px] w-0 bg-purple-600 
        transition-all duration-500 ease-in-out 
        origin-left peer-focus:w-full z-10"
          ></span>
        </div>
      </div>

      <div className="mt-8">
        {validationError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{validationError}</p>
          </div>
        )}
        <button
          type="button"
          onClick={handleContinue}
          disabled={isValidating}
          className="text-white bg-black min-h-12 hover:bg-gray-900 w-full md:w-auto px-6 py-3 text-sm md:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isValidating ? 'Перевіряємо...' : session?.user ? 'Продовжити оформлення' : 'Далі'}
        </button>
      </div>
    </div>
  );
};

export default PermanentClientForm;
