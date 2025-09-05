'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import OrderSection from '@/components/sections/OrderSection';
import UniversalClientForm from '@/components/forms/UniversalClientForm';
import ClientDeliveryInfoForm from '@/components/forms/ClientDeliveryInfoForm';

const Checkout = () => {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState<'client-info' | 'delivery-info'>('client-info');

  // Зберігаємо особисті дані введені користувачем
  const [personalData, setPersonalData] = useState<{
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  } | null>(null);

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
              <UniversalClientForm
                onContinue={data => {
                  // Зберігаємо особисті дані
                  setPersonalData({
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
                  });
                  setCurrentStep('delivery-info');
                }}
              />
            ) : (
              <ClientDeliveryInfoForm
                onBack={() => setCurrentStep('client-info')}
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
