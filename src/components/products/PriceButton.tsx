'use client';

import { memo } from 'react';

interface PriceButtonProps {
  onClick: () => void;
  currentMin: number;
  currentMax: number;
  defaultMin: number;
  defaultMax: number;
  onReset?: () => void;
}

const PriceButton = memo(
  ({ onClick, currentMin, currentMax, defaultMin, defaultMax, onReset }: PriceButtonProps) => {
    const hasActiveFilter = currentMin > defaultMin || currentMax < defaultMax;
    const isDefaultRange = currentMin === defaultMin && currentMax === defaultMax;

    const handleReset = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onReset) {
        onReset();
      }
    };

    return (
      <div
        onClick={onClick}
        className={`
          md:hidden flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium
          transition-all duration-300 border cursor-pointer shadow-xs hover:shadow-md flex-1 min-w-0
          ${
            hasActiveFilter
              ? 'bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:bg-white'
              : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:bg-white'
          }
        `}
      >
        <div className="flex items-center text-base font-medium text-gray-700">
          <span className="mr-2">💰</span>
          {isDefaultRange ? 'Діапазон цін' : 'Ціна змінена'}
        </div>
        {hasActiveFilter && (
          <div
            onClick={handleReset}
            className="ml-2 bg-pink-200 text-pink-800 hover:bg-pink-300 transition-colors duration-200 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
            title="Скинути фільтр"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        )}
      </div>
    );
  }
);

PriceButton.displayName = 'PriceButton';

export default PriceButton;
