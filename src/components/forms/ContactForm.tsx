'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ContactFormData {
  name: string;
  phone: string;
}

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  // Обробка відправки форми
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '1d66f389-60f0-4e32-80d1-3aa0b82f0b32', // Встав свій API ключ
          ...data,
        }),
      });

      if (response.ok) {
        setResponseMessage('✅ Ваше повідомлення успішно відправлено!');
        reset(); // Очистити форму після відправки
      } else {
        setResponseMessage('❌ Помилка. Спробуйте ще раз.');
      }
    } catch {
      setResponseMessage('❌ Помилка. Перевірте інтернет-зʼєднання.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-center p-4 text-gray-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Записатись на прийом</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Ім'я */}
        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
            Імʼя
          </label>
          <input
            id="name"
            type="text"
            placeholder="Ваше ім'я"
            {...register('name', { required: 'Імʼя обовʼязкове' })}
            className={`w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
              errors.name ? 'border-red-500 focus:ring-red-400' : ''
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-2">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                />
              </svg>
              {typeof errors.name.message === 'string' && errors.name.message}
            </p>
          )}
        </div>

        {/* Телефон */}
        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">
            Телефон
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+38 096 456 789"
            {...register('phone', {
              required: 'Телефон обовʼязковий',
              pattern: {
                value: /^\+?3?8?(0\d{9})$/,
                message: 'Введіть коректний номер телефону',
              },
            })}
            className={`w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
              errors.phone ? 'border-red-500 focus:ring-red-400' : ''
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-2">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                />
              </svg>
              {typeof errors.phone.message === 'string' && errors.phone.message}
            </p>
          )}
        </div>

        {/* Кнопка відправки */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-[50%] bg-brand-600 text-white py-3 px-6 text-xl font-bold rounded-full hover:bg-brand-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Надсилання...' : 'Записатись'}
        </button>

        {/* Повідомлення про статус */}
        {responseMessage && (
          <p
            className={`mt-4 text-sm ${
              responseMessage.includes('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {responseMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
