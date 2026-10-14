import React from 'react';
import { formatPriceWithCurrency } from '@/lib/utils';

interface Props {
  title: string;
  description: string;
  price?: number;
  time?: number;
  list: string[];
}

const CardPrice = ({ title, description, price, time, list }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-500 text-sm mb-4 h-16">{description}</p>

      {/* Показуємо ціну та час тільки якщо вони є */}
      {(price !== undefined || time !== undefined) && (
        <div className="flex items-baseline justify-between mb-8">
          {price !== undefined && (
            <span className="text-2xl font-bold text-gray-800">
              {formatPriceWithCurrency(price)}
            </span>
          )}
          {time !== undefined && (
            <span className="text-brand-600 bg-brand-100 px-3 py-1 rounded-full text-sm">
              {time}хв
            </span>
          )}
        </div>
      )}

      <ul className="space-y-3 mb-8">
        {list.map((item, index) => {
          return (
            <li className="flex items-start gap-2" key={index}>
              <svg
                className="w-5 h-5 text-green-500 mt-0.5 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">{item}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CardPrice;
