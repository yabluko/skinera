'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { memo, useCallback, useMemo, useState } from 'react';
import { formatPriceWithCurrency } from '@/lib/utils';
import FavoriteButton from './FavoriteButton';

interface Product {
  id: number;
  image_url: string;
  name: {
    en: string;
    ua: string;
  };
  price: number;
  brand: string;
  category: string;
  country: string;
  volume?: number;
}

const ProductCard = memo(({ product }: { product: Product }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  // Мемоізована функція для очищення назви від бренду та категорії
  const cleanedName = useMemo(() => {
    const cleanProductName = (name: string, brand: string, category: string): string => {
      let cleanName = name;

      // Видаляємо бренд з початку назви (якщо є)
      if (cleanName.toLowerCase().startsWith(brand.toLowerCase())) {
        cleanName = cleanName.substring(brand.length).trim();
      }

      // Видаляємо категорію з назви (якщо є)
      cleanName = cleanName.replace(new RegExp(category, 'gi'), '').trim();

      // Очищаємо зайві пробіли та розділювачі
      cleanName = cleanName.replace(/^[-\s]+|[-\s]+$/g, '').trim();

      return cleanName || name; // Повертаємо оригінальну назву, якщо після очищення нічого не залишилося
    };

    return cleanProductName(product.name.en, product.brand, product.category);
  }, [product.name.en, product.brand, product.category]);

  const handleClick = useCallback(() => {
    router.push(`/products/${product.id}`);
  }, [router, product.id]);

  return (
    <div
      className="flex flex-col h-auto cursor-pointer w-full"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Контейнер для зображення з підложкою */}
      <div className="w-full h-64 p-4 sm:p-2 flex items-center justify-center relative">
        <FavoriteButton product={product} size="sm" isHovered={isHovered} />
        <Image
          src={product.image_url}
          alt={product.name.en}
          width={200}
          height={200}
          className="object-contain h-full w-full"
          loading="lazy"
        />
      </div>

      {/* Контейнер для назви та ціни */}
      <div className="grow p-2 text-center flex flex-col justify-center">
        <div className="mb-2 h-32 flex flex-col items-center ">
          {/* Бренд */}
          <p className="text-gray-500 text-xs font-normal">{product.brand}</p>

          {/* Очищена назва англійською (жирним) */}
          <h2 className="text-gray-700 text-base font-bold line-clamp-2 text-center">
            {cleanedName}
          </h2>

          {/* Назва українською */}
          <p className="text-gray-600 text-sm font-normal line-clamp-2 text-center">
            {product.name.ua}
          </p>
          <p className="text-gray-600 font-bold">{formatPriceWithCurrency(product.price)}</p>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
