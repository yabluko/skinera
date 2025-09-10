import React, { useState, useCallback } from 'react';
import { payment_options } from '@/mockData/nova-postha-mock';
import DeliveryCityDropwDown from '../common/DeliveryCityDropwDown';
import DeliveryDepartmentDropDown from '../common/DeliveryDepartmentDropwDown';
import { Addresses } from '@/interfaces/NovaPoshtaResponse';

interface ClientDeliveryInfoFormProps {
  onBack?: () => void;
  onOrderComplete?: () => void;
  userData?: {
    email: string;
    name?: string;
    phone?: string;
  };
}

const ClientDeliveryInfoForm = ({
  onBack,
  onOrderComplete,
  userData,
}: ClientDeliveryInfoFormProps = {}) => {
  const [currentCity, setCurrentCity] = useState<Addresses | null>(null);
  const [cityName, setCityName] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [deliveryName] = useState<string>(userData?.name || '');
  const [deliveryPhone] = useState<string>(userData?.phone || '');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('cash-on-delivery');

  // Скидаємо відділення при зміні міста
  const handleCityChange = useCallback((city: Addresses | null, name: string) => {
    setCurrentCity(city);
    setCityName(name);
    setSelectedDepartment(''); // Скидаємо вибране відділення
  }, []);

  const isSelectedCity = currentCity && cityName;
  const isSelectedDepartment = selectedDepartment.trim() !== '';

  // Валідація телефону
  const isValidPhone = () => {
    if (!deliveryPhone.trim()) return false;
    const digits = deliveryPhone.replace(/\D/g, '');
    const rest = digits.startsWith('38') ? digits.slice(2) : digits;
    return rest.length === 10;
  };

  return (
    <div>
      {/* Форма доставки */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Доставка</h3>
        <div className="flex flex-col gap-4 md:gap-6">
          <DeliveryCityDropwDown
            city={currentCity}
            cityName={cityName}
            onCityChange={handleCityChange}
          />

          {isSelectedCity && (
            <DeliveryDepartmentDropDown
              city={currentCity}
              selectedDepartment={selectedDepartment}
              onDepartmentChange={setSelectedDepartment}
            />
          )}
        </div>
      </div>

      {/* Варіанти оплати - окремий блок після доставки */}
      {isSelectedCity && isSelectedDepartment && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Варіанти оплати</h3>

          {/* Таби з варіантами оплати */}
          <div className="flex flex-wrap gap-0 mb-6">
            {payment_options.map((option, index) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedPaymentMethod(option.value)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  selectedPaymentMethod === option.value
                    ? 'text-brand-600 border-brand-600'
                    : 'text-gray-500 border-gray-300 border-dashed hover:text-gray-700'
                } ${index === 0 ? 'pr-4' : index === payment_options.length - 1 ? 'pl-4' : 'px-4'}`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Деталі обраного варіанту оплати */}
          {selectedPaymentMethod && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-4 h-4 border-2 border-brand-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-brand-600 rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {
                    payment_options.find(option => option.value === selectedPaymentMethod)
                      ?.shortLabel
                  }
                </span>
              </div>
              <p className="text-sm text-gray-600 ml-7">
                {
                  payment_options.find(option => option.value === selectedPaymentMethod)
                    ?.description
                }
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex gap-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-gray-600 bg-gray-100 min-h-12 hover:bg-gray-200 w-full md:w-auto px-6 py-3 text-sm md:text-base transition-colors"
          >
            Назад
          </button>
        )}
        <button
          type="button"
          disabled={
            !deliveryName.trim() || !isValidPhone() || !isSelectedCity || !isSelectedDepartment
          }
          onClick={() => {
            // Тут можна додати логіку відправки замовлення на сервер
            console.log('🎉 Замовлення завершено!');

            // Викликаємо callback для очищення localStorage
            onOrderComplete?.();

            // Можна також показати повідомлення про успіх або перенаправити користувача
            alert('Замовлення успішно оформлено!');
          }}
          className="text-white bg-black min-h-12 hover:bg-gray-900 w-full md:w-auto px-6 py-3 text-sm md:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Завершити замовлення
        </button>
      </div>
    </div>
  );
};

export default ClientDeliveryInfoForm;
