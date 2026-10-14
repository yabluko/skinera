'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PhotoSliderProps {
  images: {
    src: string;
    alt: string;
    title?: string;
    description?: string;
  }[];
  className?: string;
  aspectRatio?: 'square' | 'landscape' | 'portrait';
  showNavigation?: boolean;
  showIndicators?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  initialIndex?: number;
}

const PhotoSlider: React.FC<PhotoSliderProps> = ({
  images,
  className = '',
  aspectRatio = 'landscape',
  showNavigation = true,
  showIndicators = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Auto-play functionality
  React.useEffect(() => {
    if (autoPlay && images.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
      }, autoPlayInterval);

      return () => clearInterval(timer);
    }
  }, [autoPlay, autoPlayInterval, images.length]);

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'portrait':
        return 'aspect-3/4';
      default:
        return 'aspect-video';
    }
  };

  const getPrevIndex = () => (currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  const getNextIndex = () => (currentIndex + 1) % images.length;

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {/* Main slider container */}
      <div className={`relative w-full ${getAspectRatioClass()}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Previous image (left side) */}
          {images.length > 1 && (
            <motion.div
              key={`prev-${currentIndex}`}
              className="absolute left-0 w-1/4 h-4/5 cursor-pointer z-10"
              onClick={goToPrevious}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 0.6, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg transform scale-90 hover:scale-95 transition-transform duration-200">
                <Image
                  src={images[getPrevIndex()].src}
                  alt={images[getPrevIndex()].alt}
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                    PREV
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Sliding container for current images */}
          <div className="relative w-3/5 h-full z-20 overflow-hidden rounded-2xl shadow-2xl">
            <motion.div
              className="flex h-full"
              animate={{
                x: `-${currentIndex * (100 / images.length)}%`,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                duration: 0.6,
              }}
              style={{ width: `${images.length * 100}%` }}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative shrink-0 h-full"
                  style={{ width: `${100 / images.length}%` }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="60vw"
                    priority={index === currentIndex}
                  />

                  {/* Overlay with title and description */}
                  {(image.title || image.description) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-6">
                      {image.title && (
                        <h3 className="text-white text-xl font-semibold mb-2">{image.title}</h3>
                      )}
                      {image.description && (
                        <p className="text-white/90 text-sm">{image.description}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Next image (right side) */}
          {images.length > 1 && (
            <motion.div
              key={`next-${currentIndex}`}
              className="absolute right-0 w-1/4 h-4/5 cursor-pointer z-10"
              onClick={goToNext}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 0.6, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg transform scale-90 hover:scale-95 transition-transform duration-200">
                <Image
                  src={images[getNextIndex()].src}
                  alt={images[getNextIndex()].alt}
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                    NEXT
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Navigation arrows */}
        {showNavigation && images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 backdrop-blur-xs z-30"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 backdrop-blur-xs z-30"
              aria-label="Next image"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Indicators */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
          <div className="flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-white shadow-lg scale-110'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-xs z-30">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default PhotoSlider;
