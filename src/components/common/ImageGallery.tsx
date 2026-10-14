'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import PhotoSlider from './PhotoSlider';
import Modal from './Modal';

interface ImageGalleryProps {
  images: {
    src: string;
    alt: string;
    title?: string;
    description?: string;
  }[];
  className?: string;
  columns?: 2 | 3 | 4;
  showTitles?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  className = '',
  columns = 3,
  showTitles = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getGridClassName = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 4:
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`grid ${getGridClassName()} gap-4 ${className}`}>
        {images.map((image, index) => (
          <div key={index} className="group cursor-pointer" onClick={() => openModal(index)}>
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 backdrop-blur-xs rounded-full p-3">
                    <svg
                      className="w-6 h-6 text-gray-800"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Image title */}
            {showTitles && image.title && (
              <h3 className="mt-2 text-sm font-medium text-gray-800 line-clamp-2">{image.title}</h3>
            )}
          </div>
        ))}
      </div>

      {/* Modal with slider */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="w-full max-w-4xl mx-auto">
          <PhotoSlider
            images={images}
            showNavigation={true}
            showIndicators={true}
            initialIndex={selectedImageIndex}
            className="w-full"
          />
        </div>
      </Modal>
    </>
  );
};

export default ImageGallery;
