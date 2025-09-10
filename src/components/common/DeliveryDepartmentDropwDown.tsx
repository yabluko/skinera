import React, { useEffect, useState, useCallback } from 'react';
import DepartmentDropDown from './DepartmentDropDown';
import { useDebounce } from '@/hooks/useDebounce';
import {
  Addresses,
  NovaPoshtaDepartmentsData,
  NovaPoshtaResponse,
} from '@/interfaces/NovaPoshtaResponse';

const NOVAPOSHTA_DEPTS_DEFAULTS = {
  modelName: 'AddressGeneral',
  calledMethod: 'getWarehouses',
  limit: '50',
  page: '1',
} as const;

interface DeliveryDepartmentDropDownProps {
  city: Addresses | null;
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
}

interface FETCH_METHOD_PROPERTIES {
  CityRef: string;
  FindByString?: string;
  Limit: string;
  Page: string;
}

const DeliveryDepartmentDropDown = ({
  city,
  selectedDepartment,
  onDepartmentChange,
}: DeliveryDepartmentDropDownProps) => {
  const [departmentName, setDepartmentName] = useState<string>('');
  const [departmentError, setDepartmentError] = useState<boolean>(false);
  const [departments, setDepartments] = useState<NovaPoshtaDepartmentsData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUserSearched, setHasUserSearched] = useState(false); // Відстежуємо, чи користувач вже намагався шукати
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const debouncedDepartmentName = useDebounce(departmentName, 300); // 300ms debounce для відділень

  const fetchDepartments = useCallback(
    async (cityRef: string, searchQuery?: string, retryCount = 0) => {
      if (!cityRef) return;

      const maxRetries = 2;

      try {
        // Скасовуємо попередній запит, якщо він є
        if (abortController) {
          abortController.abort();
        }

        const newAbortController = new AbortController();
        setAbortController(newAbortController);

        setIsLoading(true);
        setDepartmentError(false);
        // Позначаємо, що користувач почав пошук, тільки якщо є пошуковий запит
        // (не встановлюємо для автоматичних запитів при зміні міста)
        if (searchQuery && searchQuery.trim()) {
          setHasUserSearched(true);
        }

        // Перевірка наявності API ключа та URL
        if (
          !process.env.NEXT_PUBLIC_NOVAPOSHTA_API_KEY ||
          !process.env.NEXT_PUBLIC_NOVAPOSHTA_API_URL
        ) {
          console.error('Nova Poshta API configuration is missing');
          setDepartmentError(true);
          setDepartments([]);
          return;
        }

        // Перевірка мережевого з'єднання
        if (!navigator.onLine) {
          console.warn('No internet connection detected');
          setDepartmentError(true);
          setDepartments([]);
          return;
        }

        const methodProperties: FETCH_METHOD_PROPERTIES = {
          CityRef: cityRef,
          Limit: NOVAPOSHTA_DEPTS_DEFAULTS.limit,
          Page: NOVAPOSHTA_DEPTS_DEFAULTS.page,
        };

        if (searchQuery) {
          methodProperties.FindByString = searchQuery;
        }

        const body = JSON.stringify({
          apiKey: process.env.NEXT_PUBLIC_NOVAPOSHTA_API_KEY,
          modelName: NOVAPOSHTA_DEPTS_DEFAULTS.modelName,
          calledMethod: NOVAPOSHTA_DEPTS_DEFAULTS.calledMethod,
          methodProperties,
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

        const result: NovaPoshtaResponse<NovaPoshtaDepartmentsData> = await response.json();

        // Детальніше логування для діагностики
        console.log('Nova Poshta Departments API response:', {
          success: result?.success,
          errors: result?.errors,
          errorCodes: result?.errorCodes,
          dataLength: result?.data?.length,
          cityRef,
        });

        if (result?.success !== true) {
          console.warn('Nova Poshta Departments API returned unsuccessful response:', {
            errors: result?.errors,
            errorCodes: result?.errorCodes,
            cityRef,
            searchQuery,
          });

          // Спроба повторного запиту при деяких помилках
          if (
            retryCount < maxRetries &&
            result?.errorCodes?.some(code => ['20000000', '20000001'].includes(code))
          ) {
            console.log(`Retrying departments search (attempt ${retryCount + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return fetchDepartments(cityRef, searchQuery, retryCount + 1);
          }

          setDepartmentError(true);
          setDepartments([]);
          return;
        }

        setDepartments(result.data || []);
        setDepartmentError(false);
      } catch (err) {
        // Ігноруємо помилки скасованих запитів
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Department search request was cancelled');
          return;
        }

        console.error('Error fetching departments:', {
          error: err,
          cityRef,
          searchQuery,
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
            `Retrying departments search due to network error (attempt ${
              retryCount + 1
            }/${maxRetries})`
          );
          await new Promise(resolve => setTimeout(resolve, 1500));
          return fetchDepartments(cityRef, searchQuery, retryCount + 1);
        }

        setDepartmentError(true);
        setDepartments([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Завантаження відділень при зміні міста
  useEffect(() => {
    if (city?.DeliveryCity) {
      setDepartmentName('');
      onDepartmentChange('');
      setHasUserSearched(false); // Скидаємо флаг пошуку при зміні міста
      fetchDepartments(city.DeliveryCity);
    }
  }, [city?.DeliveryCity, fetchDepartments, onDepartmentChange]);

  // Синхронізація з зовнішнім станом
  useEffect(() => {
    setDepartmentName(selectedDepartment);
  }, [selectedDepartment]);

  const handleSearchDepartment = useCallback((searchQuery: string) => {
    setDepartmentName(searchQuery);
  }, []);

  // Debounced пошук відділень
  useEffect(() => {
    if (!city?.DeliveryCity) return;

    if (!debouncedDepartmentName.trim()) {
      // Якщо пошук порожній, показуємо всі відділення
      setHasUserSearched(false); // Скидаємо флаг пошуку при очищенні
      fetchDepartments(city.DeliveryCity);
    } else {
      // Якщо є пошуковий запит, шукаємо відділення
      setHasUserSearched(true); // Позначаємо, що користувач почав пошук
      fetchDepartments(city.DeliveryCity, debouncedDepartmentName);
    }
  }, [debouncedDepartmentName, city?.DeliveryCity, fetchDepartments]);

  // Cleanup при unmount
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  const handleDepartmentSelect = useCallback(
    (department: string) => {
      onDepartmentChange(department);
      setDepartmentName(department);
    },
    [onDepartmentChange]
  );

  const handleClearDepartment = useCallback(() => {
    setDepartmentName('');
    onDepartmentChange('');
    setHasUserSearched(false); // Скидаємо флаг пошуку при очищенні
    if (city?.DeliveryCity) {
      fetchDepartments(city.DeliveryCity);
    }
  }, [city?.DeliveryCity, fetchDepartments, onDepartmentChange]);

  return (
    <div>
      <DepartmentDropDown
        departmentName={departmentName}
        setDepartmentName={handleSearchDepartment}
        setDepartmentError={setDepartmentError}
        departments={departments}
        error={departmentError}
        isLoading={isLoading}
        onDepartmentSelect={handleDepartmentSelect}
        onClear={handleClearDepartment}
        hasUserSearched={hasUserSearched}
      />
    </div>
  );
};

export default DeliveryDepartmentDropDown;
