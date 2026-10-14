'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const SwiperComponent = ({
  images,
}: {
  images: {
    src: string;
    alt: string;
    title?: string;
    description?: string;
  }[];
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Автоматичне перемикання
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % images.length);
    }, 3000); // 3 секунди на слайд

    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);

    // Відновлюємо автопрогравання через 5 секунд
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  return (
    <div className="w-full max-w-full overflow-hidden relative">
      <div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[440px]">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out rounded-xl sm:rounded-2xl lg:rounded-4xl overflow-hidden ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Зображення */}
            <Image src={image.src} alt={image.alt} fill className="object-cover" />

            {/* Тінь */}
            <div className="absolute inset-0 rounded-xl sm:rounded-2xl lg:rounded-4xl shadow-lg"></div>
          </div>
        ))}
      </div>

      {/* Індикатори слайдів */}
      <div className="flex justify-center gap-2 my-4 sm:my-6">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentSlide ? 'scale-125' : 'hover:bg-gray-400'
            }`}
            style={{
              backgroundColor: index === currentSlide ? '#bf4475' : '#d1d5db',
            }}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default SwiperComponent;
