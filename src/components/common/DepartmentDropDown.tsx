import { NovaPoshtaDepartmentsData } from '@/interfaces/NovaPoshtaResponse';
import React, { useState } from 'react';

interface Props {
  departmentName: string;
  setDepartmentName: (departmentName: string) => void;
  setDepartmentError: React.Dispatch<React.SetStateAction<boolean>>;
  departments: NovaPoshtaDepartmentsData[];
  error: boolean;
  isLoading: boolean;
  onDepartmentSelect: (department: string) => void;
  onClear?: () => void;
  hasUserSearched?: boolean; // Додаємо пропс для відстеження пошуку користувача
}

const DepartmentDropDown = ({
  departmentName,
  setDepartmentName,
  setDepartmentError,
  departments,
  error,
  isLoading,
  onDepartmentSelect,
  onClear,
  hasUserSearched = false,
}: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    setDepartmentName(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleItemSelect = (department: string) => {
    onDepartmentSelect(department);
    setIsDropdownOpen(false);
  };

  const handleClear = () => {
    setDepartmentName('');
    setDepartmentError(false);
    onClear?.();
  };

  return (
    <div className="relative">
      <label
        htmlFor="department"
        className="block text-gray-400 pointer-events-none transition-all duration-200
                    peer-focus:-top-6 peer-focus:text-[13px]
                    -top-6 left-0 text-[13px]"
      >
        Відділення*
      </label>
      <input
        type="text"
        id="department"
        placeholder="Оберіть відділення"
        value={departmentName}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className="peer w-full border-0 border-b border-[#ebebeb] px-5 py-3
            focus:outline-hidden focus:border-b focus:border-[#ebebeb] focus:ring-0 focus:shadow-none
            focus:placeholder-transparent"
      />
      {departmentName && (
        <button
          type="button"
          className="absolute top-[33px] right-0 w-4 h-4 cursor-pointer"
          onClick={handleClear}
        >
          ✕
        </button>
      )}

      <ul
        className={`border-x border-b w-full overflow-y-scroll absolute top-full left-0 bg-white shadow-lg
              transition-all duration-300 ease-in-out max-h-[250px] z-50
              ${isDropdownOpen ? 'block' : 'hidden'}`}
      >
        {isLoading && (
          <li className="p-4 text-sm text-gray-500 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span>Пошук відділень...</span>
            </div>
          </li>
        )}

        {!isLoading &&
          departments.length > 0 &&
          !error &&
          departments.map((department: NovaPoshtaDepartmentsData, index) => (
            <li
              key={index}
              className="p-4 hover:bg-slate-50 wrap-break-word whitespace-normal text-sm cursor-pointer"
              onMouseDown={() => handleItemSelect(department.Description)}
            >
              {department.Description}
            </li>
          ))}

        {!isLoading && departments.length === 0 && departmentName && !error && (
          <li className="p-4 text-sm text-gray-500 text-center">Відділення не знайдено</li>
        )}

        {error && hasUserSearched && (
          <li className="p-4 text-sm text-red-500 text-center">
            <div className="flex flex-col items-center gap-2">
              <span>Тимчасові проблеми з пошуком відділень</span>
              <span className="text-xs text-gray-500">Перевірте інтернет-з&apos;єднання</span>
              <button
                onClick={() => {
                  setDepartmentError(false);
                  if (departmentName.trim()) {
                    // Trigger search again by clearing and setting department name
                    const currentValue = departmentName;
                    setDepartmentName('');
                    setTimeout(() => setDepartmentName(currentValue), 100);
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

export default DepartmentDropDown;
