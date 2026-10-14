'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { formatPriceWithCurrency } from '@/lib/utils';

interface PriceSliderProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  currentMin?: number;
  currentMax?: number;
  hideButtons?: boolean;
}

const PriceSlider = ({
  minPrice,
  maxPrice,
  onPriceChange,
  currentMin = minPrice,
  currentMax = maxPrice,
  hideButtons = false,
}: PriceSliderProps) => {
  const [minValue, setMinValue] = useState(currentMin);
  const [maxValue, setMaxValue] = useState(currentMax);
  const [appliedMin, setAppliedMin] = useState(currentMin);
  const [appliedMax, setAppliedMax] = useState(currentMax);

  useEffect(() => {
    setMinValue(currentMin);
    setMaxValue(currentMax);
    setAppliedMin(currentMin);
    setAppliedMax(currentMax);
  }, [currentMin, currentMax]);

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      // Cleanup any remaining event listeners
      document.removeEventListener('mousemove', () => {});
      document.removeEventListener('mouseup', () => {});
      document.removeEventListener('touchmove', () => {});
      document.removeEventListener('touchend', () => {});
    };
  }, []);

  // Функція для визначення кроку округлення на основі діапазону цін
  const getRoundingStep = useCallback(() => {
    const range = maxPrice - minPrice;
    if (range <= 100) return 10; // Округлення до десятків
    if (range <= 1000) return 50; // Округлення до 50
    if (range <= 5000) return 100; // Округлення до сотень
    if (range <= 20000) return 500; // Округлення до 500
    return 1000; // Округлення до тисяч для дуже великих діапазонів
  }, [maxPrice, minPrice]);

  // Функція для округлення ціни
  const roundPrice = useCallback(
    (price: number, roundUp = false) => {
      const step = getRoundingStep();
      if (roundUp) {
        return Math.ceil(price / step) * step;
      } else {
        return Math.floor(price / step) * step;
      }
    },
    [getRoundingStep]
  );

  // Універсальний обробник перетягування для мінімального повзунка (підтримує mouse і touch)
  const createMinDragHandler = useCallback(() => {
    let isDragging = false;
    let startX = 0;
    let startValue = 0;

    const handleMove = (clientX: number) => {
      if (!isDragging || !sliderContainerRef.current) return;

      try {
        const deltaX = clientX - startX;
        const containerWidth = sliderContainerRef.current.getBoundingClientRect().width;
        if (containerWidth === 0) return;

        const deltaPercent = deltaX / containerWidth;
        const deltaValue = (maxPrice - minPrice) * deltaPercent;
        const newValue = Math.max(
          minPrice,
          Math.min(startValue + deltaValue, maxValue - getRoundingStep())
        );
        const roundedValue = roundPrice(newValue, false);
        setMinValue(roundedValue);
        if (hideButtons) {
          onPriceChange(roundedValue, maxValue);
        }
      } catch (error) {
        console.warn('Error in min slider drag:', error);
      }
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      handleMove(moveEvent.clientX);
    };

    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (moveEvent.touches.length > 0) {
        handleMove(moveEvent.touches[0].clientX);
      }
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      setActiveSlider(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      setActiveSlider(null);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    return (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();

      isDragging = true;
      startValue = minValue;
      setActiveSlider('min');

      if ('touches' in e) {
        // Touch event
        startX = e.touches[0].clientX;
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
      } else {
        // Mouse event
        startX = (e as React.MouseEvent).clientX;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
    };
  }, [
    minPrice,
    maxPrice,
    minValue,
    maxValue,
    getRoundingStep,
    roundPrice,
    hideButtons,
    onPriceChange,
  ]);

  // Універсальний обробник перетягування для максимального повзунка (підтримує mouse і touch)
  const createMaxDragHandler = useCallback(() => {
    let isDragging = false;
    let startX = 0;
    let startValue = 0;

    const handleMove = (clientX: number) => {
      if (!isDragging || !sliderContainerRef.current) return;

      try {
        const deltaX = clientX - startX;
        const containerWidth = sliderContainerRef.current.getBoundingClientRect().width;
        if (containerWidth === 0) return;

        const deltaPercent = deltaX / containerWidth;
        const deltaValue = (maxPrice - minPrice) * deltaPercent;
        const newValue = Math.min(
          maxPrice,
          Math.max(startValue + deltaValue, minValue + getRoundingStep())
        );
        const roundedValue = roundPrice(newValue, true);
        setMaxValue(roundedValue);
        if (hideButtons) {
          onPriceChange(minValue, roundedValue);
        }
      } catch (error) {
        console.warn('Error in max slider drag:', error);
      }
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      handleMove(moveEvent.clientX);
    };

    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (moveEvent.touches.length > 0) {
        handleMove(moveEvent.touches[0].clientX);
      }
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      setActiveSlider(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      setActiveSlider(null);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    return (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();

      isDragging = true;
      startValue = maxValue;
      setActiveSlider('max');

      if ('touches' in e) {
        // Touch event
        startX = e.touches[0].clientX;
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
      } else {
        // Mouse event
        startX = (e as React.MouseEvent).clientX;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
    };
  }, [
    minPrice,
    maxPrice,
    minValue,
    maxValue,
    getRoundingStep,
    roundPrice,
    hideButtons,
    onPriceChange,
  ]);

  const handleSliderMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxValue - getRoundingStep());
    const roundedValue = roundPrice(value, false);
    setMinValue(roundedValue);
    if (hideButtons) {
      onPriceChange(roundedValue, maxValue);
    }
  };

  const handleSliderMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minValue + getRoundingStep());
    const roundedValue = roundPrice(value, true);
    setMaxValue(roundedValue);
    if (hideButtons) {
      onPriceChange(minValue, roundedValue);
    }
  };

  // Обробники для активного стану повзунків
  const handleMinMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setActiveSlider('min');
  };

  const handleMinMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setActiveSlider(null);
  };

  const handleMaxMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setActiveSlider('max');
  };

  const handleMaxMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setActiveSlider(null);
  };

  const handleMinFocus = () => {
    setActiveSlider('min');
  };

  const handleMinBlur = () => {
    setActiveSlider(null);
    // Застосовуємо обмеження та округлення при втраті фокусу
    const constrainedValue = Math.max(minPrice, Math.min(minValue, maxValue - getRoundingStep()));
    const roundedValue = roundPrice(constrainedValue, false);
    if (roundedValue !== minValue) {
      setMinValue(roundedValue);
    }
  };

  const handleMaxFocus = () => {
    setActiveSlider('max');
  };

  const handleMaxBlur = () => {
    setActiveSlider(null);
    // Застосовуємо обмеження та округлення при втраті фокусу
    const constrainedValue = Math.min(maxPrice, Math.max(maxValue, minValue + getRoundingStep()));
    const roundedValue = roundPrice(constrainedValue, true);
    if (roundedValue !== maxValue) {
      setMaxValue(roundedValue);
    }
  };

  // Універсальний обробник кліку/тапу по треку для визначення найближчого повзунка
  const handleTrackInteraction = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let clickX: number;

    if ('touches' in e) {
      // Touch event
      clickX = e.touches[0].clientX - rect.left;
    } else {
      // Mouse event
      clickX = (e as React.MouseEvent).clientX - rect.left;
    }

    const clickPercent = clickX / rect.width;
    const clickValue = minPrice + (maxPrice - minPrice) * clickPercent;

    // Визначаємо, який повзунок ближче до кліку
    const distanceToMin = Math.abs(clickValue - minValue);
    const distanceToMax = Math.abs(clickValue - maxValue);

    if (distanceToMin < distanceToMax) {
      setActiveSlider('min');
      const newMinValue = Math.min(clickValue, maxValue - getRoundingStep());
      const roundedMinValue = roundPrice(newMinValue, false);
      setMinValue(roundedMinValue);
      if (hideButtons) {
        onPriceChange(roundedMinValue, maxValue);
      }
    } else {
      setActiveSlider('max');
      const newMaxValue = Math.max(clickValue, minValue + getRoundingStep());
      const roundedMaxValue = roundPrice(newMaxValue, true);
      setMaxValue(roundedMaxValue);
      if (hideButtons) {
        onPriceChange(minValue, roundedMaxValue);
      }
    }

    // Скидаємо активний стан через невеликий час
    setTimeout(() => setActiveSlider(null), 100);
  };

  const applyFilter = () => {
    setAppliedMin(minValue);
    setAppliedMax(maxValue);
    onPriceChange(minValue, maxValue);
  };

  const hasChanges = minValue !== appliedMin || maxValue !== appliedMax;

  const getLeftPosition = () => ((minValue - minPrice) / (maxPrice - minPrice)) * 100;
  const getRightPosition = () => ((maxValue - minPrice) / (maxPrice - minPrice)) * 100;

  // Стан для відстеження активного повзунка
  const [activeSlider, setActiveSlider] = useState<'min' | 'max' | null>(null);

  // Ref для контейнера слайдера
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Динамічний z-index на основі активного повзунка та позиції
  const getMinSliderZIndex = () => {
    if (activeSlider === 'min') return 5;
    // Якщо повзунки близько, лівий має приоритет на лівій половині
    const midPoint = (minPrice + maxPrice) / 2;
    if (minValue < midPoint && Math.abs(maxValue - minValue) < (maxPrice - minPrice) * 0.1) {
      return 3;
    }
    return 1;
  };

  const getMaxSliderZIndex = () => {
    if (activeSlider === 'max') return 5;
    // Якщо повзунки близько, правий має приоритет на правій половині
    const midPoint = (minPrice + maxPrice) / 2;
    if (maxValue > midPoint && Math.abs(maxValue - minValue) < (maxPrice - minPrice) * 0.1) {
      return 3;
    }
    return 2;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <label className="text-gray-700 font-semibold block text-sm sm:text-base uppercase tracking-wide">
        Діапазон цін (грн)
      </label>

      {/* Двойной слайдер */}
      <div className="relative" ref={sliderContainerRef}>
        {/* Трек слайдера */}
        <div
          className="relative h-2 sm:h-3 bg-gray-200 rounded-lg shadow-inner cursor-pointer"
          onClick={handleTrackInteraction}
          onTouchStart={handleTrackInteraction}
        >
          {/* Активная область */}
          <div
            className="absolute h-2 sm:h-3 bg-linear-to-r from-pink-400 to-pink-600 rounded-lg shadow-xs transition-all duration-200 pointer-events-none"
            style={{
              left: `${getLeftPosition()}%`,
              width: `${getRightPosition() - getLeftPosition()}%`,
            }}
          />
        </div>

        {/* Области кліку для кожного повзунка */}
        <div
          className="absolute top-0 left-0 h-2 sm:h-3 bg-transparent cursor-pointer"
          style={{
            width: `${50 + (getLeftPosition() - getRightPosition()) / 2}%`,
            zIndex: 10,
          }}
          onClick={e => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const parentRect = e.currentTarget.parentElement!.getBoundingClientRect();
            const fullClickPercent = clickX / parentRect.width;
            const clickValue = minPrice + (maxPrice - minPrice) * fullClickPercent;
            const newMinValue = Math.min(clickValue, maxValue - getRoundingStep());
            const roundedMinValue = roundPrice(newMinValue, false);
            setMinValue(roundedMinValue);
            if (hideButtons) {
              onPriceChange(roundedMinValue, maxValue);
            }
            setActiveSlider('min');
            setTimeout(() => setActiveSlider(null), 100);
          }}
          onTouchStart={e => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.touches[0].clientX - rect.left;
            const parentRect = e.currentTarget.parentElement!.getBoundingClientRect();
            const fullClickPercent = clickX / parentRect.width;
            const clickValue = minPrice + (maxPrice - minPrice) * fullClickPercent;
            const newMinValue = Math.min(clickValue, maxValue - getRoundingStep());
            const roundedMinValue = roundPrice(newMinValue, false);
            setMinValue(roundedMinValue);
            if (hideButtons) {
              onPriceChange(roundedMinValue, maxValue);
            }
            setActiveSlider('min');
            setTimeout(() => setActiveSlider(null), 100);
          }}
        />

        <div
          className="absolute top-0 right-0 h-2 sm:h-3 bg-transparent cursor-pointer"
          style={{
            width: `${50 - (getLeftPosition() - getRightPosition()) / 2}%`,
            zIndex: 10,
          }}
          onClick={e => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const parentRect = e.currentTarget.parentElement!.getBoundingClientRect();
            const fullClickX = parentRect.width - rect.width + clickX;
            const fullClickPercent = fullClickX / parentRect.width;
            const clickValue = minPrice + (maxPrice - minPrice) * fullClickPercent;
            const newMaxValue = Math.max(clickValue, minValue + getRoundingStep());
            const roundedMaxValue = roundPrice(newMaxValue, true);
            setMaxValue(roundedMaxValue);
            if (hideButtons) {
              onPriceChange(minValue, roundedMaxValue);
            }
            setActiveSlider('max');
            setTimeout(() => setActiveSlider(null), 100);
          }}
          onTouchStart={e => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.touches[0].clientX - rect.left;
            const parentRect = e.currentTarget.parentElement!.getBoundingClientRect();
            const fullClickX = parentRect.width - rect.width + clickX;
            const fullClickPercent = fullClickX / parentRect.width;
            const clickValue = minPrice + (maxPrice - minPrice) * fullClickPercent;
            const newMaxValue = Math.max(clickValue, minValue + getRoundingStep());
            const roundedMaxValue = roundPrice(newMaxValue, true);
            setMaxValue(roundedMaxValue);
            if (hideButtons) {
              onPriceChange(minValue, roundedMaxValue);
            }
            setActiveSlider('max');
            setTimeout(() => setActiveSlider(null), 100);
          }}
        />

        {/* Минимальный слайдер */}
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step={getRoundingStep()}
          value={minValue}
          onChange={handleSliderMinChange}
          onMouseDown={handleMinMouseDown}
          onMouseUp={handleMinMouseUp}
          onFocus={handleMinFocus}
          onBlur={handleMinBlur}
          className="absolute top-0 left-0 w-full h-2 sm:h-3 bg-transparent appearance-none cursor-pointer slider-thumb min-slider touch-manipulation"
          style={{
            zIndex: getMinSliderZIndex(),
            pointerEvents: 'none',
          }}
        />

        {/* Максимальный слайдер */}
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step={getRoundingStep()}
          value={maxValue}
          onChange={handleSliderMaxChange}
          onMouseDown={handleMaxMouseDown}
          onMouseUp={handleMaxMouseUp}
          onFocus={handleMaxFocus}
          onBlur={handleMaxBlur}
          className="absolute top-0 left-0 w-full h-2 sm:h-3 bg-transparent appearance-none cursor-pointer slider-thumb max-slider touch-manipulation"
          style={{
            zIndex: getMaxSliderZIndex(),
            pointerEvents: 'none',
          }}
        />

        {/* Thumb контроли з pointer events */}
        <div className="absolute top-0 left-0 w-full h-2 sm:h-3" style={{ pointerEvents: 'none' }}>
          <div
            className="absolute w-6 h-6 sm:w-8 sm:h-8 -mt-2 sm:-mt-2.5 -ml-3 sm:-ml-4 bg-transparent cursor-pointer"
            style={{
              left: `${getLeftPosition()}%`,
              pointerEvents: 'auto',
              zIndex: 20,
            }}
            onMouseDown={createMinDragHandler()}
            onTouchStart={createMinDragHandler()}
          />

          <div
            className="absolute w-6 h-6 sm:w-8 sm:h-8 -mt-2 sm:-mt-2.5 -ml-3 sm:-ml-4 bg-transparent cursor-pointer"
            style={{
              left: `${getRightPosition()}%`,
              pointerEvents: 'auto',
              zIndex: 20,
            }}
            onMouseDown={createMaxDragHandler()}
            onTouchStart={createMaxDragHandler()}
          />
        </div>
      </div>

      {/* Отображение текущих значений */}
      <div className="flex justify-between text-sm sm:text-base text-gray-600">
        <span className="font-medium">{formatPriceWithCurrency(minValue)}</span>
        <span className="font-medium">{formatPriceWithCurrency(maxValue)}</span>
      </div>

      {/* Кнопки управления */}
      {!hideButtons && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={applyFilter}
            disabled={!hasChanges}
            className={`w-full px-4 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 touch-manipulation ${
              hasChanges
                ? 'bg-pink-500 text-white hover:bg-pink-600 shadow-md hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Застосувати
          </button>
        </div>
      )}

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ec4899;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(236, 72, 153, 0.3);
          transition: all 0.2s ease;
          touch-action: manipulation;
        }

        .slider-thumb::-webkit-slider-thumb:hover {
          background: #db2777;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
          transform: scale(1.1);
        }

        .slider-thumb::-webkit-slider-thumb:active {
          background: #be185d;
          transform: scale(1.15);
          box-shadow: 0 6px 16px rgba(236, 72, 153, 0.5);
        }

        .min-slider::-webkit-slider-thumb {
          background: #ec4899;
          border: 3px solid #ffffff;
          ${activeSlider === 'min'
            ? 'box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.3) !important;'
            : ''}
        }

        .max-slider::-webkit-slider-thumb {
          background: #db2777;
          border: 3px solid #ffffff;
          ${activeSlider === 'max'
            ? 'box-shadow: 0 0 0 4px rgba(219, 39, 119, 0.3) !important;'
            : ''}
        }

        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ec4899;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(236, 72, 153, 0.3);
          transition: all 0.2s ease;
          touch-action: manipulation;
        }

        .slider-thumb::-moz-range-thumb:hover {
          background: #db2777;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
          transform: scale(1.1);
        }

        .slider-thumb::-moz-range-thumb:active {
          background: #be185d;
          transform: scale(1.15);
          box-shadow: 0 6px 16px rgba(236, 72, 153, 0.5);
        }

        .slider-thumb::-webkit-slider-track {
          background: transparent;
        }

        .slider-thumb::-moz-range-track {
          background: transparent;
        }

        /* Додаткові стилі для кращої взаємодії */
        .min-slider {
          pointer-events: auto;
        }

        .max-slider {
          pointer-events: auto;
        }

        /* Touch-friendly стилі для мобільних пристроїв */
        @media (pointer: coarse) {
          .slider-thumb::-webkit-slider-thumb {
            height: 20px;
            width: 20px;
            border: 2px solid #ffffff;
          }

          .slider-thumb::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border: 2px solid #ffffff;
          }
        }

        /* Додаткові стилі для мобільних пристроїв */
        @media (max-width: 640px) {
          .slider-thumb::-webkit-slider-thumb {
            height: 20px;
            width: 20px;
            border: 2px solid #ffffff;
          }

          .slider-thumb::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border: 2px solid #ffffff;
          }
        }

        /* Запобігання вибору тексту при drag */
        * {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* Touch оптимізації */
        .touch-manipulation {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        /* Покращені стилі для кнопок на мобільних */
        @media (max-width: 640px) {
          button {
            min-height: 48px; /* Мінімальна висота для touch */
            touch-action: manipulation;
            border-radius: 12px;
            font-weight: 600;
            letter-spacing: 0.5px;
          }

          button:active {
            transform: scale(0.98);
            transition: transform 0.1s ease;
          }

          button:disabled {
            opacity: 0.6;
            transform: none;
          }
        }

        /* Загальні стилі для мобільних пристроїв */
        @media (max-width: 640px) {
          .space-y-4 > * + * {
            margin-top: 1.25rem;
          }

          .space-y-6 > * + * {
            margin-top: 1.75rem;
          }

          label {
            font-size: 0.875rem;
            line-height: 1.25rem;
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PriceSlider;
