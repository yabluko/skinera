import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { IMaskInput } from 'react-imask';

interface PermanentClientFormProps {
  onContinue?: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) => void;
  initialData?: { email: string; password: string };
  userData?: {
    email: string;
    name?: string;
    phone?: string;
  };
}

const PermanentClientForm = ({
  onContinue,
  initialData,
  userData,
}: PermanentClientFormProps = {}) => {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Функція для розділення повного імені на ім'я та прізвище
  const splitFullName = (fullName: string) => {
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    return { firstName, lastName };
  };

  // Автозаповнення даних для зареєстрованих користувачів або відновлення даних
  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
      if (session.user.name) {
        const { firstName, lastName } = splitFullName(session.user.name);
        setFirstName(firstName);
        setLastName(lastName);
      }
    } else if (initialData) {
      setEmail(initialData.email);
      setPassword(initialData.password);
    }

    // Заповнюємо дані з userData (отримані з API)
    if (userData) {
      setEmail(userData.email);
      if (userData.name) {
        const { firstName, lastName } = splitFullName(userData.name);
        setFirstName(firstName);
        setLastName(lastName);
      }
      setPhone(userData.phone || '');
    }
  }, [session, initialData, userData]);

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

  // Валідація обов'язкових полів
  const validateRequiredFields = () => {
    const errors = [];

    if (!firstName.trim()) {
      errors.push("Ім'я обов'язкове для заповнення");
    }

    if (!lastName.trim()) {
      errors.push("Прізвище обов'язкове для заповнення");
    }

    if (!phone.trim()) {
      errors.push("Телефон обов'язковий для заповнення");
    } else {
      // Перевіряємо чи телефон повністю заповнений (10 цифр після +38)
      const digits = phone.replace(/\D/g, '');
      const rest = digits.startsWith('38') ? digits.slice(2) : digits;
      if (rest.length < 10) {
        errors.push('Введіть повний номер телефону');
      }
    }

    if (!email.trim()) {
      errors.push("Email обов'язковий для заповнення");
    }

    if (errors.length > 0) {
      setValidationError(errors.join(', '));
      return false;
    }

    setValidationError('');
    return true;
  };

  // Обробник кнопки для неавторизованих користувачів
  const handleContinue = async () => {
    // Спочатку валідуємо обов'язкові поля
    if (!validateRequiredFields()) {
      return;
    }

    if (session?.user) {
      // Для зареєстрованих користувачів передаємо всі дані
      onContinue?.({
        email: session.user.email || '',
        password: '',
        firstName,
        lastName,
        phone,
      });
    } else {
      // Для неавторизованих перевіряємо існування користувача
      const isValid = await validateUser();
      if (isValid) {
        onContinue?.({
          email,
          password,
          firstName,
          lastName,
          phone,
        });
      }
    }
  };
  return (
    <div id="permanent-customer" aria-labelledby="tab-2">
      {session?.user ? (
        <div className="mb-8">
          <p className="text-gray-700 mb-2">
            Заповніть обов&apos;язкові поля для відправки замовлення.
          </p>
        </div>
      ) : initialData ? (
        <div className="mb-8">
          <p className="text-green-600 font-medium mb-2">✅ Дані валідовані успішно</p>
          <p className="text-gray-600 mb-2">
            Ваші дані перевірені. Заповніть обов&apos;язкові поля нижче.
          </p>
          <p className="text-sm text-gray-600">
            <span className="text-red-500">*</span> Ім&apos;я, прізвище та телефон -
            обов&apos;язкові поля
          </p>
        </div>
      ) : (
        <div className="mb-8">
          <p className="text-gray-700 mb-2">
            Якщо ви зареєстрований клієнт, заповніть всі поля нижче. Якщо ви ще не є нашим клієнтом,
            то перейдіть у розділ &ldquo;Новий покупець&rdquo;.
          </p>
          <p className="text-sm text-gray-600">
            <span className="text-red-500">*</span> Ім&apos;я, прізвище та телефон -
            обов&apos;язкові поля
          </p>
        </div>
      )}

      {/* Перший ряд: Ім'я та Прізвище */}
      <div className="flex gap-4 md:gap-20 mb-8 flex-col md:flex-row">
        <div className="relative flex-1">
          <input
            type="text"
            id="permanent-firstName"
            placeholder=" "
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="peer w-full border-0 border-b border-[#ebebeb] p-0 focus:outline-none focus:border-b focus:border-[#ebebeb] focus:ring-0 focus:shadow-none"
          />
          <label
            htmlFor="permanent-firstName"
            className={`absolute text-gray-400 pointer-events-none transition-all duration-200
        peer-focus:-top-6 peer-focus:text-[13px] ${
          firstName ? '-top-6 left-0 text-[13px]' : ' top-0 left-0 text-sm'
        }`}
          >
            Ім&apos;я <span className="text-red-500">*</span>
          </label>
          <span
            className="absolute left-0 bottom-0 h-[1px] w-0 bg-purple-600 
        transition-all duration-500 ease-in-out 
        origin-left peer-focus:w-full z-10"
          ></span>
        </div>

        <div className="relative flex-1">
          <input
            type="text"
            id="permanent-lastName"
            placeholder=" "
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className="peer w-full border-0 border-b border-[#ebebeb] p-0 focus:outline-none focus:border-b focus:border-[#ebebeb] focus:ring-0 focus:shadow-none"
          />
          <label
            htmlFor="permanent-lastName"
            className={`absolute text-gray-400 pointer-events-none transition-all duration-200
        peer-focus:-top-6 peer-focus:text-[13px] ${
          lastName ? '-top-6 left-0 text-[13px]' : ' top-0 left-0 text-sm'
        }`}
          >
            Прізвище <span className="text-red-500">*</span>
          </label>
          <span
            className="absolute left-0 bottom-0 h-[1px] w-0 bg-purple-600 
        transition-all duration-500 ease-in-out 
        origin-left peer-focus:w-full z-10"
          ></span>
        </div>
      </div>

      {/* Другий ряд: Телефон та Email */}
      <div className="flex gap-4 md:gap-20 mb-8 flex-col md:flex-row">
        <div className="relative flex-1">
          <IMaskInput
            mask="+{38} (000) 000 00 00"
            lazy={!isPhoneFocused}
            placeholderChar="_"
            value={phone}
            onAccept={(value: string) => setPhone(value)}
            onFocus={() => setIsPhoneFocused(true)}
            onBlur={e => {
              const raw = (e.target as HTMLInputElement).value || '';
              const digits = raw.replace(/\D/g, '');
              const rest = digits.startsWith('38') ? digits.slice(2) : digits;
              if (rest.length === 0) {
                setPhone('');
              }
              setIsPhoneFocused(false);
            }}
            inputMode="tel"
            id="permanent-phone"
            placeholder=" "
            className="peer w-full border-0 border-b border-[#ebebeb] p-0 focus:outline-none focus:border-b focus:border-[#ebebeb] focus:ring-0 focus:shadow-none"
          />
          <label
            htmlFor="permanent-phone"
            className={`absolute text-gray-400 pointer-events-none transition-all duration-200
        peer-focus:-top-6 peer-focus:text-[13px] ${
          phone ? '-top-6 left-0 text-[13px]' : ' top-0 left-0 text-sm'
        }`}
          >
            Телефон <span className="text-red-500">*</span>
          </label>
          <span
            className="absolute left-0 bottom-0 h-[1px] w-0 bg-purple-600 
        transition-all duration-500 ease-in-out 
        origin-left peer-focus:w-full z-10"
          ></span>
        </div>

        <div className="relative flex-1">
          <input
            type="text"
            id="permanent-email"
            placeholder=" "
            value={email}
            onChange={e => setEmail(e.target.value)}
            readOnly={!!session?.user}
            className={`peer w-full border-0 border-b border-[#ebebeb] p-0 focus:outline-none focus:border-b focus:border-[#ebebeb] focus:ring-0 focus:shadow-none ${
              session?.user ? 'bg-gray-50 cursor-not-allowed' : ''
            }`}
          />
          <label
            htmlFor="permanent-email"
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
