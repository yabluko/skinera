import React, { useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { AiOutlineClose } from 'react-icons/ai';
import { Addresses } from '@/interfaces/NovaPoshtaResponse';

interface DeliveryAddressSectionProps {
  cities: Addresses[];
  cityName: string;
  setCityName: (name: string) => void;
  setCityError: React.Dispatch<React.SetStateAction<boolean>>;
  error: boolean;
  isLoading: boolean;
  onCitySelect: (city: Addresses) => void;
  onClear?: () => void;
  hasUserSearched?: boolean; // Додаємо пропс для відстеження пошуку користувача
}

const DeliveryAddressSection = ({
  cityName,
  setCityName,
  setCityError,
  error,
  cities,
  isLoading,
  onCitySelect,
  onClear,
  hasUserSearched = false,
}: DeliveryAddressSectionProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleItemSelect = (city: Addresses) => {
    onCitySelect(city);
    setIsDropdownOpen(false);
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleInputBlur = () => {
    // Затримка щоб користувач міг клікнути на елемент списку
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCityName(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleClear = () => {
    setCityName('');
    setCityError(false);
    onClear?.();
  };

  return (
    <div className="relative">
      <label
        htmlFor="city"
        className="block text-gray-400 pointer-events-none transition-all duration-200
                    peer-focus:-top-6 peer-focus:text-[13px]
                    -top-6 left-0 text-[13px]"
      >
        Місто*
      </label>
      <input
        type="text"
        id="city"
        placeholder="Введіть ваше місто"
        value={cityName}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className="peer w-full border-0 border-b border-[#ebebeb] px-5 py-3
            focus:outline-hidden focus:border-b focus:border-[#ebebeb] focus:ring-0 focus:shadow-none
            focus:placeholder-transparent"
      />
      <CiSearch className="absolute top-[35px] left-0 w-4 h-4" />
      {cityName && (
        <AiOutlineClose
          className="absolute top-[33px] right-0 w-4 h-4 cursor-pointer"
          onClick={handleClear}
        />
      )}

      <ul
        className={`border-x border-b w-full overflow-y-scroll absolute top-full left-0 bg-white shadow-lg
              transition-all duration-300 ease-in-out max-h-[250px] cities-container z-50
              ${isDropdownOpen ? 'block' : 'hidden'}`}
      >
        {isLoading && (
          <li className="p-4 text-sm text-gray-500 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span>Пошук міст...</span>
            </div>
          </li>
        )}

        {!isLoading &&
          cities.length > 0 &&
          !error &&
          cities.map((city, index) => (
            <li
              key={index}
              className="p-4 hover:bg-slate-50 wrap-break-word whitespace-normal text-sm cursor-pointer"
              onMouseDown={() => handleItemSelect(city)}
            >
              {city.Present}
            </li>
          ))}

        {!isLoading && cities.length === 0 && cityName && !error && (
          <li className="p-4 text-sm text-gray-500 text-center">Місто не знайдено</li>
        )}

        {error && hasUserSearched && (
          <li className="p-4 text-sm text-red-500 text-center">
            <div className="flex flex-col items-center gap-2">
              <span>Тимчасові проблеми з пошуком міст</span>
              <span className="text-xs text-gray-500">Перевірте інтернет-з&apos;єднання</span>
              <button
                onClick={() => {
                  setCityError(false);
                  if (cityName.trim()) {
                    // Trigger search again by clearing and setting city name
                    const currentValue = cityName;
                    setCityName('');
                    setTimeout(() => setCityName(currentValue), 100);
                  }
                }}
                className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer"
              >
                Спробувати знову
              </button>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default DeliveryAddressSection;
