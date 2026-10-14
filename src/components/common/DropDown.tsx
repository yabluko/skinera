import React, { useEffect, useRef, useState } from 'react';

interface Props {
  labelName: string;
  arrOptions: { id: string; label: string; value: string }[];
}

const DropDown = ({ labelName, arrOptions }: Props) => {
  const [isDeliveryDropdownOpen, setIsDeliveryDropdownOpen] = useState(false);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(arrOptions[0]);
  const deliveryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        deliveryDropdownRef.current &&
        !deliveryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDeliveryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeliveryOptionSelect = (option: (typeof arrOptions)[0]) => {
    setSelectedDeliveryOption(option);
    setIsDeliveryDropdownOpen(false);
  };

  return (
    <div>
      <div className="relative" ref={deliveryDropdownRef}>
        <label
          htmlFor="delivery-options"
          className="block text-gray-400 pointer-events-none transition-all duration-200
                      -top-6 left-0 text-[13px]"
        >
          {labelName}*
        </label>
        <div
          className="w-full border-0 border-b border-[#ebebeb] pl-5 pr-10 py-3 cursor-pointer
              focus:outline-hidden focus:border-b focus:border-[#ebebeb] focus:ring-0 focus:shadow-none
              bg-white relative"
          onClick={() => setIsDeliveryDropdownOpen(!isDeliveryDropdownOpen)}
        >
          <span className="text-gray-900">{selectedDeliveryOption.label}</span>

          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isDeliveryDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <ul
          className={`border-x border-b border-gray-200 w-full overflow-y-scroll bg-white max-h-[250px] 
              shadow-lg z-50 absolute top-full left-0 transition-all duration-200
              ${isDeliveryDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        >
          {arrOptions.map(option => (
            <li
              key={option.id}
              className="p-4 hover:bg-slate-50 wrap-break-word text-sm cursor-pointer border-gray-100
                  transition-colors duration-150"
              onClick={() => handleDeliveryOptionSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DropDown;
