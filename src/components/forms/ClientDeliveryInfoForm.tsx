import React, { useState, useCallback } from 'react';
import DropDown from '../common/DropDown';
import { delivery_options, payment_options } from '@/mockData/nova-postha-mock';
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
  const [deliveryName,] = useState<string>(userData?.name || '');
  const [deliveryPhone, ] = useState<string>(userData?.phone || '');

  // Скидаємо відділення при зміні міста
  const handleCityChange = useCallback((city: Addresses | null, name: string) => {
    setCurrentCity(city);
    setCityName(name);
    setSelectedDepartment(''); // Скидаємо вибране відділення
  }, []);

  const isSelectedCity = currentCity && cityName;

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
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="flex flex-col gap-4 md:gap-6 flex-1">
            <DeliveryCityDropwDown
              city={currentCity}
              cityName={cityName}
              onCityChange={handleCityChange}
            />

            {isSelectedCity && (
              <>
                <DropDown labelName="Варіант доставки" arrOptions={delivery_options} />
                <DeliveryDepartmentDropDown
                  city={currentCity}
                  selectedDepartment={selectedDepartment}
                  onDepartmentChange={setSelectedDepartment}
                />
              </>
            )}
          </div>

          <div className="flex flex-col flex-1">
            {isSelectedCity && <DropDown labelName="Варіант оплати" arrOptions={payment_options} />}
          </div>
        </div>
      </div>

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
          disabled={!deliveryName.trim() || !isValidPhone() || !isSelectedCity}
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
