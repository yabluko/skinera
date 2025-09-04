import React, { useEffect, useState, useCallback } from 'react';
import DepartmentDropDown from './DepartmentDropDown';
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

  const fetchDepartments = useCallback(async (cityRef: string, searchQuery?: string) => {
    if (!cityRef) return;

    try {
      setIsLoading(true);
      setDepartmentError(false);

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

      const response = await fetch(process.env.NEXT_PUBLIC_NOVAPOSHTA_API_URL || '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      const result: NovaPoshtaResponse<NovaPoshtaDepartmentsData> = await response.json();

      if (result?.success !== true) {
        setDepartmentError(true);
        setDepartments([]);
        return;
      }

      setDepartments(result.data || []);
      setDepartmentError(false);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setDepartmentError(true);
      setDepartments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Завантаження відділень при зміні міста
  useEffect(() => {
    if (city?.DeliveryCity) {
      setDepartmentName('');
      onDepartmentChange('');
      fetchDepartments(city.DeliveryCity);
    }
  }, [city?.DeliveryCity, fetchDepartments, onDepartmentChange]);

  // Синхронізація з зовнішнім станом
  useEffect(() => {
    setDepartmentName(selectedDepartment);
  }, [selectedDepartment]);

  const handleSearchDepartment = useCallback(
    (searchQuery: string) => {
      setDepartmentName(searchQuery);

      if (!city?.DeliveryCity) return;

      if (!searchQuery.trim()) {
        // Якщо пошук порожній, показуємо всі відділення
        fetchDepartments(city.DeliveryCity);
      } else {
        // Якщо є пошуковий запит, шукаємо відділення
        fetchDepartments(city.DeliveryCity, searchQuery);
      }
    },
    [city?.DeliveryCity, fetchDepartments]
  );

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
      />
    </div>
  );
};

export default DeliveryDepartmentDropDown;
