import React, { useState, useCallback } from 'react';
import { IMaskInput } from 'react-imask';
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
  const [deliveryName, setDeliveryName] = useState<string>(userData?.name || '');
  const [deliveryPhone, setDeliveryPhone] = useState<string>(userData?.phone || '');
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);

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
      {/* Інформація про користувача */}
      {userData && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Інформація про замовника</h3>
          <div className="flex gap-10">
            {userData.email && (
              <div className="flex items-center gap-2">
                {/* <span className="text-sm text-gray-600">Email:</span> */}
                <span className="font-medium text-gray-900">{userData.email}</span>
              </div>
            )}
            {userData.name && (
              <div className="flex items-center gap-2">
                {/* <span className="text-sm text-gray-600">Імʼя:</span> */}
                <span className="font-medium text-gray-900">{userData.name}</span>
              </div>
            )}
            {userData.phone && (
              <div className="flex items-center gap-2">
                {/* <span className="text-sm text-gray-600">Телефон:</span> */}
                <span className="font-medium text-gray-900">{userData.phone}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Додаткові поля для доставки */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Контактні дані для доставки</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <input
              type="text"
              id="delivery-name"
              placeholder=" "
              value={deliveryName}
              onChange={e => setDeliveryName(e.target.value)}
              className="peer w-full border-0 border-b border-[#ebebeb] p-0 focus:outline-none focus:border-b focus:border-[#ebebeb] focus:ring-0 focus:shadow-none"
            />
            <label
              htmlFor="delivery-name"
              className={`absolute text-gray-400 pointer-events-none transition-all duration-200
              peer-focus:-top-6 peer-focus:text-[13px] ${
                deliveryName ? '-top-6 left-0 text-[13px]' : ' top-0 left-0 text-sm'
              }`}
            >
              Імʼя отримувача*
            </label>
            <span
              className="absolute left-0 bottom-0 h-[1px] w-0 bg-purple-600 
              transition-all duration-500 ease-in-out 
              origin-left peer-focus:w-full z-10"
            ></span>
          </div>

          <div className="relative">
            <IMaskInput
              mask="+{38} (000) 000 00 00"
              lazy={!isPhoneFocused}
              placeholderChar="_"
              value={deliveryPhone}
              onAccept={(value: string) => setDeliveryPhone(value)}
              onFocus={() => setIsPhoneFocused(true)}
              onBlur={e => {
                const raw = (e.target as HTMLInputElement).value || '';
                const digits = raw.replace(/\D/g, '');
                const rest = digits.startsWith('38') ? digits.slice(2) : digits;
                if (rest.length === 0) {
                  setDeliveryPhone('');
                }
                setIsPhoneFocused(false);
              }}
              inputMode="tel"
              id="delivery-phone"
              placeholder=" "
              className="peer w-full border-0 border-b border-[#ebebeb] p-0 focus:outline-none focus:border-b focus:border-[#ebebeb] focus:ring-0 focus:shadow-none"
            />
            <label
              htmlFor="delivery-phone"
              className={`absolute text-gray-400 pointer-events-none transition-all duration-200
              peer-focus:-top-6 peer-focus:text-[13px] ${
                deliveryPhone ? '-top-6 left-0 text-[13px]' : ' top-0 left-0 text-sm'
              }`}
            >
              Телефон отримувача*
            </label>
            <span
              className="absolute left-0 bottom-0 h-[1px] w-0 bg-purple-600 
              transition-all duration-500 ease-in-out 
              origin-left peer-focus:w-full z-10"
            ></span>
          </div>
        </div>
      </div>

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
