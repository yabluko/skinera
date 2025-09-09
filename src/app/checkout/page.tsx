'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import OrderSection from '@/components/sections/OrderSection';
import UniversalClientForm from '@/components/forms/UniversalClientForm';
import ClientDeliveryInfoForm from '@/components/forms/ClientDeliveryInfoForm';

const CHECKOUT_DATA_KEY = 'skinera_checkout_personal_data';

const Checkout = () => {
  const { data: session } = useSession();
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);

  // Зберігаємо особисті дані введені користувачем
  const [personalData, setPersonalData] = useState<{
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  } | null>(null);

  // Завантажуємо збережені дані з localStorage при ініціалізації
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(CHECKOUT_DATA_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setPersonalData(parsedData);
        setShowDeliveryForm(true); // Якщо є збережені дані, показуємо форму доставки
        console.log('✅ Завантажено збережені дані з localStorage:', parsedData);
      }
    } catch (error) {
      console.error('❌ Помилка завантаження даних з localStorage:', error);
      // Очищаємо пошкоджені дані
      localStorage.removeItem(CHECKOUT_DATA_KEY);
    }
  }, []);

  // Функція для збереження даних в localStorage
  const savePersonalDataToStorage = (data: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) => {
    try {
      localStorage.setItem(CHECKOUT_DATA_KEY, JSON.stringify(data));
      console.log('✅ Дані збережено в localStorage:', data);
    } catch (error) {
      console.error('❌ Помилка збереження в localStorage:', error);
    }
  };

  // Функція для очищення збережених даних
  const clearPersonalDataFromStorage = () => {
    try {
      localStorage.removeItem(CHECKOUT_DATA_KEY);
      console.log('✅ Дані очищено з localStorage');
    } catch (error) {
      console.error('❌ Помилка очищення localStorage:', error);
    }
  };

  return (
    <div className="flex flex-col gap-8 md:gap-16 lg:gap-32 max-w-6xl mx-auto py-20  lg:py-32 px-4 md:px-6 lg:px-0">
      <section className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-10 px-4">
        <div className="flex-1 lg:pr-9 w-full">
          <h1 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-11">
            Оформлення замовлення
          </h1>

          <div className="checkout-container flex-1">
            {/* Кроки оформлення */}
            <div className="flex flex-col sm:flex-row mb-8 md:mb-12 gap-2 sm:gap-0">
              <h3
                className={`font-semibold text-lg md:text-xl sm:mr-11 transition-colors duration-200 ${
                  showDeliveryForm ? 'text-[#a6a2a2]' : 'text-brand-600'
                }`}
              >
                1 Особисті дані
              </h3>
              <h3
                className={`font-semibold text-lg md:text-xl transition-colors duration-200 ${
                  showDeliveryForm ? 'text-brand-600' : 'text-[#a6a2a2]'
                }`}
              >
                2 Інформація про доставку
              </h3>
            </div>

            {/* Форма особистих даних */}
            <UniversalClientForm
              initialData={personalData}
              onContinue={data => {
                // Зберігаємо особисті дані в state та localStorage
                const personalDataToSave = {
                  email: data.email,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  phone: data.phone,
                };
                setPersonalData(personalDataToSave);
                savePersonalDataToStorage(personalDataToSave);
                setShowDeliveryForm(true);
              }}
              onClearSavedData={clearPersonalDataFromStorage}
              isCompleted={showDeliveryForm}
              onEdit={() => setShowDeliveryForm(false)}
            />

            {/* Форма доставки - показується після заповнення особистих даних */}
            {showDeliveryForm && (
              <div className="mt-8 md:mt-12 animate-in slide-in-from-top-4 duration-500">
                <ClientDeliveryInfoForm
                  onBack={() => setShowDeliveryForm(false)}
                  onOrderComplete={() => {
                    // Очищаємо збережені дані після успішного замовлення
                    clearPersonalDataFromStorage();
                    setPersonalData(null);
                    setShowDeliveryForm(false);

                    // Можна додати логіку перенаправлення або показу сторінки успіху
                    console.log('🎉 Замовлення завершено, дані очищено');
                  }}
                  userData={
                    personalData
                      ? {
                          email: personalData.email,
                          name: `${personalData.firstName} ${personalData.lastName}`.trim(),
                          phone: personalData.phone,
                        }
                      : session?.user
                      ? {
                          email: session.user.email || '',
                          name: session.user.name || undefined,
                        }
                      : undefined
                  }
                />
              </div>
            )}
          </div>
        </div>
        <div className="w-full lg:w-auto">
          <OrderSection />
        </div>
      </section>
    </div>
  );
};

export default Checkout;
