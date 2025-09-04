'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import OrderSection from '@/components/sections/OrderSection';
import PermanentClientForm from '@/components/forms/PermanentClientForm';
import TabsSlider from '@/components/slider/TabsSlider';
import NewClientInfoTab from '@/components/tabs/NewClientInfoTab';
import ClientDeliveryInfoForm from '@/components/forms/ClientDeliveryInfoForm';
import { usePermanentClientStore } from '@/components/store/permanentClientStore';

const Checkout = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'new' | 'permanent'>('new');
  const [currentStep, setCurrentStep] = useState<'client-info' | 'delivery-info'>('client-info');
  const [permanentClientStep, setPermanentClientStep] = useState<'credentials' | 'delivery'>(
    'credentials'
  );

  // Store для управління станом постійного клієнта
  const { setPermanentClientSelected, setClientInfo, setIsOnCheckoutPage } =
    usePermanentClientStore();

  // Зберігаємо дані користувача для неавторизованих
  const [permanentClientData, setPermanentClientData] = useState<{
    email: string;
    password: string;
  } | null>(null);

  // Зберігаємо повну інформацію про користувача
  const [userInfo, setUserInfo] = useState<{
    email: string;
    name: string;
    phone: string;
  } | null>(null);

  // Функція для отримання інформації про користувача
  const fetchUserInfo = useCallback(
    async (email: string) => {
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
          const userInfoData = {
            email: data.email,
            name: data.name,
            phone: data.phone || '',
          };
          setUserInfo(userInfoData);

          // Оновлюємо store
          setClientInfo({
            email: data.email,
            name: data.name,
            phone: data.phone || '',
            isValidated: true,
          });
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    },
    [setClientInfo]
  );

  // Встановлюємо що ми на сторінці checkout
  useEffect(() => {
    setIsOnCheckoutPage(true);

    // Очищуємо стан при виході зі сторінки
    return () => {
      setIsOnCheckoutPage(false);
    };
  }, [setIsOnCheckoutPage]);

  // Автоматично встановлюємо таб для зареєстрованих користувачів
  useEffect(() => {
    if (session?.user) {
      setActiveTab('permanent');
      setPermanentClientSelected(true);
      // Для авторизованих користувачів починаємо з особистих даних
      setCurrentStep('client-info');
      // Отримуємо повну інформацію про користувача
      fetchUserInfo(session.user.email || '');
    }
  }, [session, setPermanentClientSelected, fetchUserInfo]);

  // Оновлюємо store при зміні активного табу
  useEffect(() => {
    setPermanentClientSelected(activeTab === 'permanent');
    if (activeTab === 'new') {
      setClientInfo(null);
    }
  }, [activeTab, setPermanentClientSelected, setClientInfo]);

  return (
    <div className="flex flex-col gap-8 md:gap-16 lg:gap-32 max-w-6xl mx-auto py-20  lg:py-32 px-4 md:px-6 lg:px-0">
      <section className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-10 px-4">
        {/* <ClientInfoForm /> */}
        <div className="flex-1 lg:pr-9 w-full">
          <h1 id="tabs-title" className="text-2xl md:text-3xl font-semibold mb-6 md:mb-11">
            Оформлення замовлення
          </h1>

          <div className="tabs-container flex-1">
            {session?.user ? (
              // Для зареєстрованих користувачів показуємо кроки оформлення
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Оформлення замовлення
                  </h2>
                  <p className="text-gray-600">
                    Ви увійшли як{' '}
                    <span className="font-medium text-brand-600">{session.user.name}</span>
                    {currentStep === 'client-info' && (
                      <span className="block text-sm mt-1">
                        Будь ласка, заповніть обов&apos;язкові поля (ім&apos;я, прізвище, телефон)
                        для відправки замовлення.
                      </span>
                    )}
                    {currentStep === 'delivery-info' && (
                      <span className="block text-sm mt-1">
                        Особисті дані заповнені. Тепер вкажіть інформацію про доставку.
                      </span>
                    )}
                  </p>
                </div>

                {/* Кроки для зареєстрованих користувачів */}
                <div className="flex flex-col sm:flex-row mb-8 md:mb-12 gap-2 sm:gap-0">
                  <h3
                    className={`font-semibold text-lg md:text-xl sm:mr-11 cursor-pointer transition-colors duration-200 ${
                      currentStep === 'client-info' ? 'text-brand-600' : 'text-[#a6a2a2]'
                    }`}
                    onClick={() => setCurrentStep('client-info')}
                  >
                    1 Особисті дані
                  </h3>
                  <h3
                    className={`font-semibold text-lg md:text-xl cursor-pointer transition-colors duration-200 ${
                      currentStep === 'delivery-info' ? 'text-brand-600' : 'text-[#a6a2a2]'
                    }`}
                    onClick={() => setCurrentStep('delivery-info')}
                  >
                    2 Інформація про доставку
                  </h3>
                </div>

                {currentStep === 'client-info' ? (
                  <PermanentClientForm
                    onContinue={() => setCurrentStep('delivery-info')}
                    userData={
                      userInfo
                        ? {
                            email: userInfo.email,
                            name: userInfo.name,
                            phone: userInfo.phone,
                          }
                        : {
                            email: session.user.email || '',
                            name: session.user.name || undefined,
                          }
                    }
                  />
                ) : (
                  <ClientDeliveryInfoForm
                    onBack={() => setCurrentStep('client-info')}
                    userData={
                      userInfo
                        ? {
                            email: userInfo.email,
                            name: userInfo.name,
                            phone: userInfo.phone,
                          }
                        : {
                            email: session.user.email || '',
                            name: session.user.name || undefined,
                          }
                    }
                  />
                )}
              </div>
            ) : (
              // Для неавторизованих користувачів показуємо таби
              <>
                <TabsSlider activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="tabs-panels mt-5">
                  {activeTab === 'new' && <NewClientInfoTab />}
                  {activeTab === 'permanent' && (
                    <>
                      {permanentClientStep === 'credentials' ? (
                        <PermanentClientForm
                          initialData={permanentClientData || undefined}
                          onContinue={async data => {
                            setPermanentClientData(data);
                            // Отримуємо повну інформацію про користувача після валідації
                            await fetchUserInfo(data.email);
                            setPermanentClientStep('delivery');
                          }}
                        />
                      ) : (
                        <ClientDeliveryInfoForm
                          onBack={() => setPermanentClientStep('credentials')}
                          userData={
                            userInfo
                              ? {
                                  email: userInfo.email,
                                  name: userInfo.name,
                                  phone: userInfo.phone,
                                }
                              : permanentClientData
                              ? {
                                  email: permanentClientData.email,
                                  name: undefined,
                                }
                              : undefined
                          }
                        />
                      )}
                    </>
                  )}
                </div>
              </>
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
