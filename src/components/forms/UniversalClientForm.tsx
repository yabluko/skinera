import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { IMaskInput } from 'react-imask';

interface UniversalClientFormProps {
  initialData?: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  } | null;
  onContinue?: (data: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) => void;
  onClearSavedData?: () => void;
}

const UniversalClientForm = ({
  initialData,
  onContinue,
  onClearSavedData,
}: UniversalClientFormProps) => {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Функція для розділення повного імені на ім'я та прізвище
  const splitFullName = (fullName: string) => {
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    return { firstName, lastName };
  };

  // Функція для отримання інформації про користувача з API
  const fetchUserInfo = async (email: string) => {
    try {
      const response = await fetch('/api/auth/user-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          email: data.email,
          name: data.name,
          phone: data.phone || '',
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

  // Автозаповнення даних для зареєстрованих користувачів та initialData
  useEffect(() => {
    const loadUserData = async () => {
      // Спочатку перевіряємо чи є initialData (збережені дані з localStorage)
      if (initialData) {
        console.log('✅ Завантажуємо initialData:', initialData);
        setEmail(initialData.email || '');
        setFirstName(initialData.firstName || '');
        setLastName(initialData.lastName || '');
        setPhone(initialData.phone || '');
        return; // Якщо є initialData, не завантажуємо з session/API
      }

      // Якщо немає initialData, завантажуємо дані з session
      if (session?.user?.email) {
        setEmail(session.user.email);

        // Спочатку заповнюємо з session
        if (session.user.name) {
          const { firstName, lastName } = splitFullName(session.user.name);
          setFirstName(firstName);
          setLastName(lastName);
        }

        // Потім підтягуємо додаткові дані з API
        const userData = await fetchUserInfo(session.user.email);
        if (userData) {
          if (userData.name) {
            const { firstName, lastName } = splitFullName(userData.name);
            setFirstName(firstName);
            setLastName(lastName);
          }
          setPhone(userData.phone || '');
        }
      }
    };

    loadUserData();
  }, [session, initialData]);

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

    if (email.trim()) {
      // Валідація email тільки якщо він заповнений
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Введіть коректний email');
      }
    }

    if (errors.length > 0) {
      setValidationError(errors.join(', '));
      return false;
    }

    setValidationError('');
    return true;
  };

  // Обробник кнопки продовжити
  const handleContinue = async () => {
    console.log('🎯 handleContinue called');

    // Валідуємо обов'язкові поля
    if (!validateRequiredFields()) {
      console.log('❌ Validation failed');
      return;
    }

    console.log('✅ Validation passed');
    setIsLoading(true);
    setValidationError('');

    try {
      // Визначаємо email для збереження
      const emailToSave = email || session?.user?.email || '';

      console.log('🚀 Saving user data:', {
        email: emailToSave,
        firstName,
        lastName,
        phone,
      });

      // Email не обов'язковий для оформлення замовлення

      console.log('📡 Making API call to /api/auth/update-user');
      // Зберігаємо/оновлюємо дані користувача в базі даних
      const saveResponse = await fetch('/api/auth/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...(emailToSave && { email: emailToSave }), // додаємо email тільки якщо він є
          firstName,
          lastName,
          phone,
        }),
      });

      console.log('📨 API response received, status:', saveResponse.status);

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        console.error('❌ Error saving data:', errorData);
        setValidationError(errorData.error || 'Помилка збереження даних');
        return;
      }

      const savedData = await saveResponse.json();
      console.log('✅ Дані користувача збережено:', savedData);

      // Передаємо дані далі
      onContinue?.({
        email: emailToSave || '', // можна передати порожній рядок якщо немає email
        firstName,
        lastName,
        phone,
      });
    } catch (error) {
      console.error('Error processing form:', error);
      setValidationError('Помилка обробки форми');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="universal-client-form">
      {session?.user ? (
        <div className="mb-8">
          <p className="text-gray-700 mb-2">
            Ви увійшли як{' '}
            <span className="font-medium text-brand-600">
              {session.user.name || session.user.email}
            </span>
          </p>
          <p className="text-gray-600 text-sm">
            Заповніть або оновіть ваші особисті дані для оформлення замовлення.
          </p>
        </div>
      ) : (
        <div className="mb-8">
          <p className="text-gray-700 mb-2">
            Заповніть ваші особисті дані для оформлення замовлення.
          </p>
        </div>
      )}

      {/* Індикатор збережених даних */}
      {initialData && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-green-800 text-sm font-medium">Завантажено збережені дані</p>
            </div>
            {onClearSavedData && (
              <button
                type="button"
                onClick={() => {
                  onClearSavedData();
                  // Очищаємо поля форми
                  setEmail(session?.user?.email || '');
                  setFirstName('');
                  setLastName('');
                  setPhone('');
                }}
                className="text-green-600 hover:text-green-800 text-sm underline"
              >
                Очистити
              </button>
            )}
          </div>
        </div>
      )}

      {/* Перший ряд: Ім'я та Прізвище */}
      <div className="flex gap-4 md:gap-20 mb-8 flex-col md:flex-row">
        <div className="relative flex-1">
          <input
            type="text"
            id="firstName"
            placeholder=" "
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="peer w-full border-0 border-b border-[#ebebeb] p-0 focus:outline-none focus:border-b focus:border-[#ebebeb] focus:ring-0 focus:shadow-none"
          />
          <label
            htmlFor="firstName"
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
            id="lastName"
            placeholder=" "
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className="peer w-full border-0 border-b border-[#ebebeb] p-0 focus:outline-none focus:border-b focus:border-[#ebebeb] focus:ring-0 focus:shadow-none"
          />
          <label
            htmlFor="lastName"
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
            id="phone"
            placeholder=" "
            className="peer w-full border-0 border-b border-[#ebebeb] p-0 focus:outline-none focus:border-b focus:border-[#ebebeb] focus:ring-0 focus:shadow-none"
          />
          <label
            htmlFor="phone"
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
            type="email"
            id="email"
            placeholder=" "
            value={email}
            onChange={e => setEmail(e.target.value)}
            readOnly={!!session?.user}
            className={`peer w-full border-0 border-b border-[#ebebeb] p-0 focus:outline-none focus:border-b focus:border-[#ebebeb] focus:ring-0 focus:shadow-none ${
              session?.user ? 'bg-gray-50 cursor-not-allowed' : ''
            }`}
          />
          <label
            htmlFor="email"
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
          disabled={isLoading}
          className="text-white bg-black min-h-12 hover:bg-gray-900 w-full md:w-auto px-6 py-3 text-sm md:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Обробляємо...' : 'Далі до доставки'}
        </button>
      </div>
    </div>
  );
};

export default UniversalClientForm;
