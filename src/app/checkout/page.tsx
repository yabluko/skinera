'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import OrderSection from '@/components/sections/OrderSection';
import PermanentClientForm from '@/components/forms/PermanentClientForm';
import TabsSlider from '@/components/slider/TabsSlider';
import NewClientInfoTab from '@/components/tabs/NewClientInfoTab';
import ClientDeliveryInfoForm from '@/components/forms/ClientDeliveryInfoForm';

const Checkout = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'new' | 'permanent'>('new');
  const [currentStep, setCurrentStep] = useState<'client-info' | 'delivery-info'>('client-info');

  // Автоматично встановлюємо таб для зареєстрованих користувачів
  useEffect(() => {
    if (session?.user) {
      setActiveTab('permanent');
    }
  }, [session]);

  return (
    <div className="flex flex-col gap-8 md:gap-16 lg:gap-32 max-w-6xl mx-auto py-20  lg:py-32 px-4 md:px-6 lg:px-0">
      <section className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-3 px-4">
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
                    className={`font-semibold text-lg md:text-xl transition-colors duration-200 ${
                      currentStep === 'delivery-info' ? 'text-brand-600' : 'text-[#a6a2a2]'
                    }`}
                  >
                    2 Інформація про доставку
                  </h3>
                </div>

                {currentStep === 'client-info' ? (
                  <PermanentClientForm onContinue={() => setCurrentStep('delivery-info')} />
                ) : (
                  <ClientDeliveryInfoForm />
                )}
              </div>
            ) : (
              // Для неавторизованих користувачів показуємо таби
              <>
                <TabsSlider activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="tabs-panels mt-5">
                  {activeTab === 'new' && <NewClientInfoTab />}
                  {activeTab === 'permanent' && <PermanentClientForm />}
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
