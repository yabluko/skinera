'use client';

import { useState, useCallback, memo } from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
}

const CategoryFilter = memo(
  ({ categories, selectedCategories, onCategoryChange }: CategoryFilterProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Показуємо максимум 5 категорій в згорнутому вигляді
    const maxVisibleCategories = 5;
    const visibleCategories = isExpanded ? categories : categories.slice(0, maxVisibleCategories);
    const hasMoreCategories = categories.length > maxVisibleCategories;

    const handleCategoryClick = useCallback(
      (category: string) => {
        if (selectedCategories.includes(category)) {
          // Видаляємо категорію зі списку вибраних
          const newCategories = selectedCategories.filter(c => c !== category);
          console.log('Removing category:', category, 'New categories:', newCategories);
          onCategoryChange(newCategories);
        } else {
          // Додаємо категорію до списку вибраних
          const newCategories = [...selectedCategories, category];
          console.log('Adding category:', category, 'New categories:', newCategories);
          onCategoryChange(newCategories);
        }
      },
      [selectedCategories, onCategoryChange]
    );

    const clearAllCategories = useCallback(() => {
      onCategoryChange([]);
    }, [onCategoryChange]);

    return (
      <div className="space-y-3">
        <label className="text-gray-700 font-semibold block text-sm uppercase tracking-wide">
          Категорії товарів
        </label>

        {/* Кнопка "Очистити всі" */}
        <button
          onClick={clearAllCategories}
          className={`
          inline-flex items-center px-3 py-2 sm:px-4 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium
          transition-all duration-300 border-2 mr-1 sm:mr-2 mb-2 group relative overflow-hidden
          touch-manipulation active:scale-95
          ${
            selectedCategories.length === 0
              ? 'bg-linear-to-r from-pink-500 to-pink-600 text-white border-pink-500 shadow-lg shadow-pink-200 transform scale-105'
              : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:bg-pink-50 hover:shadow-md sm:hover:scale-105'
          }
        `}
        >
          <span
            className={`mr-2 transition-transform duration-300 ${
              selectedCategories.length === 0 ? 'animate-bounce' : 'group-hover:scale-110'
            }`}
          >
            🏷️
          </span>
          {selectedCategories.length === 0 ? 'Усі категорії' : 'Очистити фільтри'}
          {selectedCategories.length === 0 && (
            <span className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse"></span>
          )}
          {selectedCategories.length > 0 && (
            <span className="ml-2 bg-pink-200 text-pink-800 text-xs px-2 py-0.5 rounded-full font-semibold">
              {selectedCategories.length}
            </span>
          )}
          {/* Ripple effect */}
          <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 group-active:opacity-30 transition-opacity duration-300"></span>
        </button>

        {/* Категорії як чіп-кнопки */}
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {visibleCategories.map((category, index) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
              className={`
                inline-flex items-center px-2 py-1.5 sm:px-3 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium
                transition-all duration-300 border-2 transform group relative overflow-hidden
                animate-fade-in-up touch-manipulation active:scale-95
                ${
                  selectedCategories.includes(category)
                    ? 'bg-linear-to-r from-pink-500 to-pink-600 text-white border-pink-500 shadow-lg shadow-pink-200 scale-105'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:bg-pink-50 hover:shadow-md sm:hover:scale-105'
                }
              `}
            >
              {/* Іконка для категорії */}
              <span
                className={`mr-1 sm:mr-2 transition-transform duration-300 text-sm ${
                  selectedCategories.includes(category)
                    ? 'animate-pulse'
                    : 'sm:group-hover:scale-110 sm:group-hover:rotate-12'
                }`}
              >
                {getCategoryIcon(category)}
              </span>

              <span className="relative z-10">{category}</span>

              {selectedCategories.includes(category) && (
                <span className="ml-2 flex items-center animate-fade-in">
                  <svg className="w-4 h-4 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}

              {/* Ripple effect */}
              <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 group-active:opacity-30 transition-opacity duration-300"></span>

              {/* Gradient overlay on hover */}
              {!selectedCategories.includes(category) && (
                <span className="absolute inset-0 rounded-full bg-linear-to-r from-pink-400 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
              )}
            </button>
          ))}
        </div>

        {/* Кнопка "Показати більше/менше" */}
        {hasMoreCategories && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="
            inline-flex items-center px-3 py-2 sm:px-4 sm:py-2.5 mt-3 text-xs sm:text-sm font-medium
            text-pink-600 hover:text-pink-700 border border-pink-200 
            rounded-full hover:bg-pink-50 transition-all duration-300 group
            focus:outline-hidden focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50
            sm:hover:scale-105 hover:shadow-md relative overflow-hidden touch-manipulation active:scale-95
          "
          >
            <svg
              className={`w-4 h-4 mr-2 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : 'group-hover:translate-y-0.5'
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

            <span className="relative z-10">
              {isExpanded
                ? 'Показати менше'
                : `Показати більше (${categories.length - maxVisibleCategories})`}
            </span>

            {/* Ripple effect */}
            <span className="absolute inset-0 rounded-full bg-pink-100 opacity-0 group-hover:opacity-50 group-active:opacity-70 transition-opacity duration-300"></span>
          </button>
        )}

        {/* Індикатор активних фільтрів */}
        {selectedCategories.length > 0 && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between p-2 sm:p-3 bg-pink-50 border border-pink-200 rounded-lg animate-fade-in">
              <div className="flex items-center text-xs sm:text-sm text-pink-700">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Активних фільтрів: <strong className="ml-1">{selectedCategories.length}</strong>
                </span>
              </div>
              <button
                onClick={clearAllCategories}
                className="text-pink-600 hover:text-pink-800 p-1 rounded-full hover:bg-pink-100 transition-colors duration-200 shrink-0 touch-manipulation"
                title="Очистити всі фільтри"
              >
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Список вибраних категорій */}
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {selectedCategories.map((category, index) => (
                <div
                  key={category}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className="inline-flex items-center px-2 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-medium animate-fade-in"
                >
                  <span className="mr-1 text-xs">{getCategoryIcon(category)}</span>
                  <span className="truncate max-w-24 sm:max-w-none">{category}</span>
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className="ml-1 text-pink-600 hover:text-pink-800 rounded-full p-0.5 hover:bg-pink-200 transition-colors duration-200"
                    title={`Видалити ${category}`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

CategoryFilter.displayName = 'CategoryFilter';

// Функція для отримання іконки категорії
const getCategoryIcon = (category: string): string => {
  const iconMap: { [key: string]: string } = {
    'Догляд за обличчям': '🧴',
    'Догляд за тілом': '🧴',
    Макіяж: '💄',
    Парфуми: '🌸',
    'Догляд за волоссям': '💇‍♀️',
    'Сонцезахисні засоби': '☀️',
    'Дитяча косметика': '🍼',
    'Чоловіча косметика': '👨',
    Інструменти: '🔧',
    Аксесуари: '✨',
  };

  return iconMap[category] || '📦';
};

export default CategoryFilter;

// CSS-in-JS стилі для анімацій (додаємо через глобальні стилі)
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fade-in-up {
      0% {
        opacity: 0;
        transform: translateY(10px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fade-in {
      0% {
        opacity: 0;
        transform: scale(0.8);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    .animate-fade-in-up {
      animation: fade-in-up 0.4s ease-out forwards;
    }
    
    .animate-fade-in {
      animation: fade-in 0.3s ease-out forwards;
    }
  `;

  if (!document.head.querySelector('style[data-category-filter]')) {
    style.setAttribute('data-category-filter', 'true');
    document.head.appendChild(style);
  }
}
