import React, { useState, useCallback } from 'react';
import DropDown from '../common/DropDown';
import { delivery_options, payment_options } from '@/mockData/nova-postha-mock';
import DeliveryCityDropwDown from '../common/DeliveryCityDropwDown';
import DeliveryDepartmentDropDown from '../common/DeliveryDepartmentDropwDown';
import { Addresses } from '@/interfaces/NovaPoshtaResponse';

interface ClientDeliveryInfoFormProps {
  onBack?: () => void;
}

const ClientDeliveryInfoForm = ({ onBack }: ClientDeliveryInfoFormProps = {}) => {
  const [currentCity, setCurrentCity] = useState<Addresses | null>(null);
  const [cityName, setCityName] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  // Скидаємо відділення при зміні міста
  const handleCityChange = useCallback((city: Addresses | null, name: string) => {
    setCurrentCity(city);
    setCityName(name);
    setSelectedDepartment(''); // Скидаємо вибране відділення
  }, []);

  const isSelectedCity = currentCity && cityName;

  return (
    <div>
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

      {onBack && (
        <div className="mt-8">
          <button
            type="button"
            onClick={onBack}
            className="text-gray-600 bg-gray-100 min-h-12 hover:bg-gray-200 w-full md:w-auto px-6 py-3 text-sm md:text-base transition-colors"
          >
            Назад
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientDeliveryInfoForm;
