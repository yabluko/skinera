'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DeliveryAddressSection from '../sections/DeliveryAddressSection';
import { parseNovaPoshtaCities } from '@/lib/utils';
import { favCities } from '@/mockData/nova-postha-mock';
import { useDebounce } from '@/hooks/useDebounce';
import {
  Addresses,
  NovaPoshtaAddressesData,
  NovaPoshtaResponse,
} from '@/interfaces/NovaPoshtaResponse';

const NOVAPOSHTA_CITY_DEFAULTS = {
  modelName: 'AddressGeneral',
  calledMethod: 'searchSettlements',
  limit: '50',
  page: '1',
} as const;

interface DeliveryCityDropwDownProps {
  city: Addresses | null;
  cityName: string;
  onCityChange: (city: Addresses | null, name: string) => void;
}

const DeliveryCityDropwDown = ({ cityName, onCityChange }: DeliveryCityDropwDownProps) => {
  const [isError, setIsError] = useState(false);
  const [cities, setCities] = useState<Addresses[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [localCityName, setLocalCityName] = useState(cityName);
  const [hasUserSearched, setHasUserSearched] = useState(false); // Відстежуємо, чи користувач вже намагався шукати
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const debouncedCityName = useDebounce(localCityName, 500);

  const handleCitySearch = useCallback(async (cityName: string, retryCount = 0) => {
    if (!cityName.trim()) {
      setCities([]);
      return;
    }

    const maxRetries = 2;

    try {
      // Скасовуємо попередній запит, якщо він є
      if (abortController) {
        abortController.abort();
      }

      const newAbortController = new AbortController();
      setAbortController(newAbortController);

      setIsLoading(true);
      setIsError(false);
      setHasUserSearched(true); // Позначаємо, що користувач почав пошук

      // Перевірка наявності API ключа та URL
      if (
        !process.env.NEXT_PUBLIC_NOVAPOSHTA_API_KEY ||
        !process.env.NEXT_PUBLIC_NOVAPOSHTA_API_URL
      ) {
        console.error('Nova Poshta API configuration is missing');
        setIsError(true);
        setCities([]);
        return;
      }

      // Перевірка мережевого з'єднання
      if (!navigator.onLine) {
        console.warn('No internet connection detected');
        setIsError(true);
        setCities([]);
        return;
      }

      const body = JSON.stringify({
        apiKey: process.env.NEXT_PUBLIC_NOVAPOSHTA_API_KEY,
        modelName: NOVAPOSHTA_CITY_DEFAULTS.modelName,
        calledMethod: NOVAPOSHTA_CITY_DEFAULTS.calledMethod,
        methodProperties: {
          CityName: cityName,
          Limit: NOVAPOSHTA_CITY_DEFAULTS.limit,
          Page: NOVAPOSHTA_CITY_DEFAULTS.page,
        },
      });

      const timeoutId = setTimeout(() => newAbortController.abort(), 10000); // 10 секунд timeout

      const response = await fetch(process.env.NEXT_PUBLIC_NOVAPOSHTA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: newAbortController.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: NovaPoshtaResponse<NovaPoshtaAddressesData> = await response.json();

      // Детальніше логування для діагностики
      console.log('Nova Poshta API response:', {
        success: result?.success,
        errors: result?.errors,
        errorCodes: result?.errorCodes,
        dataLength: result?.data?.length,
      });

      if (result?.success !== true) {
        console.warn('Nova Poshta API returned unsuccessful response:', {
          errors: result?.errors,
          errorCodes: result?.errorCodes,
          cityName,
        });

        // Спроба повторного запиту при деяких помилках
        if (
          retryCount < maxRetries &&
          result?.errorCodes?.some(code => ['20000000', '20000001'].includes(code))
        ) {
          console.log(`Retrying city search (attempt ${retryCount + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Затримка перед повтором
          return handleCitySearch(cityName, retryCount + 1);
        }

        setIsError(true);
        setCities([]);
        return;
      }

      if (!result.data || result.data.length === 0) {
        setCities([]);
        setIsError(false);
        return;
      }

      const parsedCities = parseNovaPoshtaCities(result.data[0]);
      setCities(parsedCities);
      setIsError(false);
    } catch (err) {
      // Ігноруємо помилки скасованих запитів
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('City search request was cancelled');
        return;
      }

      console.error('Error searching cities:', {
        error: err,
        cityName,
        retryCount,
        isAbortError: err instanceof Error && err.name === 'AbortError',
        isNetworkError: err instanceof TypeError && err.message.includes('fetch'),
      });

      // Повторна спроба при мережевих помилках
      if (
        retryCount < maxRetries &&
        (err instanceof TypeError || (err instanceof Error && err.name === 'AbortError'))
      ) {
        console.log(
          `Retrying city search due to network error (attempt ${retryCount + 1}/${maxRetries})`
        );
        await new Promise(resolve => setTimeout(resolve, 1500)); // Більша затримка при мережевих помилках
        return handleCitySearch(cityName, retryCount + 1);
      }

      setIsError(true);
      setCities([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPopularCities = useCallback(async (retryCount = 0) => {
    const maxRetries = 1; // Менше повторів для популярних міст

    try {
      setIsLoading(true);
      // НЕ скидаємо помилку для популярних міст, щоб не показувати помилку при кліку на інпут
      // setIsError(false);

      // Перевірка наявності API ключа та URL
      if (
        !process.env.NEXT_PUBLIC_NOVAPOSHTA_API_KEY ||
        !process.env.NEXT_PUBLIC_NOVAPOSHTA_API_URL
      ) {
        console.error('Nova Poshta API configuration is missing');
        setCities([]);
        return;
      }

      const result = await Promise.all(
        favCities.map(async name => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // Менший timeout для популярних міст

            const res = await fetch(process.env.NEXT_PUBLIC_NOVAPOSHTA_API_URL!, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                apiKey: process.env.NEXT_PUBLIC_NOVAPOSHTA_API_KEY,
                modelName: 'AddressGeneral',
                calledMethod: 'searchSettlements',
                methodProperties: { CityName: name, Limit: 10 },
              }),
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
              console.warn(`Failed to fetch city ${name}: ${res.status}`);
              return null;
            }

            return res.json();
          } catch (err) {
            console.warn(`Error fetching popular city ${name}:`, err);
            return null;
          }
        })
      );

      const addresses = result
        .filter(res => res && res.success)
        .map(res => parseNovaPoshtaCities(res.data[0])[0])
        .filter(Boolean);

      if (addresses.length === 0 && retryCount < maxRetries) {
        console.log(`Retrying popular cities fetch (attempt ${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return fetchPopularCities(retryCount + 1);
      }

      setCities(addresses);

      // Не встановлюємо помилку, якщо отримали хоча б деякі популярні міста
      if (addresses.length === 0) {
        console.warn('No popular cities could be loaded');
      }
    } catch (err) {
      console.error('Error fetching popular cities:', err);

      // Повторна спроба при критичних помилках
      if (retryCount < maxRetries) {
        console.log(
          `Retrying popular cities fetch due to error (attempt ${retryCount + 1}/${maxRetries})`
        );
        await new Promise(resolve => setTimeout(resolve, 2000));
        return fetchPopularCities(retryCount + 1);
      }

      setCities([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Пошук при зміні debounced значення
  useEffect(() => {
    if (debouncedCityName && debouncedCityName.trim()) {
      handleCitySearch(debouncedCityName);
    } else if (debouncedCityName === '') {
      setCities([]);
      setIsError(false);
    }
  }, [debouncedCityName, handleCitySearch]);

  // Завантаження популярних міст при порожньому пошуку
  useEffect(() => {
    if (localCityName === '') {
      fetchPopularCities();
    }
  }, [localCityName, fetchPopularCities]);

  // Синхронізація з зовнішнім станом
  useEffect(() => {
    setLocalCityName(cityName);
  }, [cityName]);

  // Cleanup при unmount
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  const handleCitySelect = useCallback(
    (city: Addresses) => {
      onCityChange(city, city.Present);
      setLocalCityName(city.Present);
      setCities([]);
      setIsError(false);
    },
    [onCityChange]
  );

  const handleCityNameChange = useCallback(
    (name: string) => {
      setLocalCityName(name);
      if (name === '') {
        onCityChange(null, '');
        setCities([]);
        setIsError(false);
        setHasUserSearched(false); // Скидаємо флаг пошуку при очищенні
      }
    },
    [onCityChange]
  );

  const handleClearCity = useCallback(() => {
    setLocalCityName('');
    onCityChange(null, '');
    setCities([]);
    setIsError(false);
    setHasUserSearched(false); // Скидаємо флаг пошуку при очищенні
  }, [onCityChange]);

  return (
    <DeliveryAddressSection
      cities={cities}
      cityName={localCityName}
      setCityName={handleCityNameChange}
      error={isError}
      setCityError={setIsError}
      isLoading={isLoading}
      onCitySelect={handleCitySelect}
      onClear={handleClearCity}
      hasUserSearched={hasUserSearched}
    />
  );
};

export default DeliveryCityDropwDown;
