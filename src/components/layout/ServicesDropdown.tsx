'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ServicesDropdownProps {
  isMobile?: boolean;
  onNavigate?: () => void;
}

const ServicesDropdown = ({ isMobile, onNavigate }: ServicesDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const services = [
    {
      path: '/services/face-care',
      label: 'Догляд за обличчям',
      //   description: 'Професійний догляд за шкірою обличчя',
    },
    {
      path: '/services/laser-hair-removal',
      label: 'Лазерна епіляція',
      //   description: 'Безболісне видалення небажаного волосся',
    },
    {
      path: '/services/massage',
      label: 'Масаж',
      //   description: 'Розслаблюючі та оздоровчі процедури',
    },
  ];

  // Перевіряємо, чи поточна сторінка є однією з послуг
  const isServicesActive = services.some(service => pathname === service.path);

  // Закриваємо меню при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        forceClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleServiceClick = () => {
    forceClose();
    if (isMobile && onNavigate) {
      onNavigate();
    }
  };

  const forceClose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(false);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300); // 300ms затримка для більшої стабільності
  };

  if (isMobile) {
    return (
      <div className="flex flex-col ">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`py-2 px-4 rounded-full text-[13.5px] font-medium transition-colors ${
            isServicesActive
              ? 'text-skin-ink bg-skin-pink-soft font-semibold'
              : 'text-skin-ink/80 hover:text-skin-ink'
          }`}
        >
          <span>Послуги</span>
        </button>

        {isOpen && (
          <div className="ml-4 mt-2 space-y-2">
            {services.map(service => (
              <Link
                key={service.path}
                href={service.path}
                className={`block py-2 px-4 rounded-lg transition-colors text-sm ${
                  pathname === service.path
                    ? 'text-skin-ink bg-skin-pink-soft font-semibold'
                    : 'text-skin-ink/80 hover:text-skin-ink'
                }`}
                onClick={handleServiceClick}
              >
                <div className="font-medium">{service.label}</div>
                {/* <div className="text-xs text-gray-500 mt-1">{service.description}</div> */}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`py-2 px-4 rounded-full text-[13.5px] font-medium transition-colors ${
          isServicesActive
            ? 'text-skin-ink bg-skin-pink-soft font-semibold'
            : 'text-skin-ink/80 hover:text-skin-ink'
        }`}
      >
        <span>Послуги</span>
      </button>

      {/* Невидимий місток для з'єднання кнопки з меню */}
      <div
        className={`absolute top-full left-0 w-full h-2 ${isOpen ? 'block' : 'hidden'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      <div
        className={`absolute top-full left-0 mt-1 w-72 bg-skin-white rounded-[18px] shadow-lg border border-skin-gray-mid pt-3 pb-2 z-50 transition-all duration-200 ease-in-out ${
          isOpen
            ? 'opacity-100 visible transform translate-y-0'
            : 'opacity-0 invisible transform -translate-y-2 pointer-events-none'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {services.map(service => (
          <Link
            key={service.path}
            href={service.path}
            className={`block px-4 py-3 hover:bg-skin-paper transition-colors ${
              pathname === service.path ? 'bg-skin-pink-soft' : ''
            }`}
            onClick={handleServiceClick}
          >
            <div
              className={`font-medium ${
                pathname === service.path ? 'text-skin-ink' : 'text-skin-ink/85'
              }`}
            >
              {service.label}
            </div>
            {/* <div className="text-sm text-gray-500 mt-1">{service.description}</div> */}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ServicesDropdown;
