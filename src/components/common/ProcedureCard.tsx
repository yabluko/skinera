import React from 'react';
import Image from 'next/image';

interface Props {
  title: string;
  description: string;
  image?: string;
  price?: number;
  time?: number;
  list: string[];
}

const ProcedureCard = ({ title, description, image, price, time, list }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 h-full flex flex-col overflow-hidden group">
      {/* Зображення або градієнтний фон */}
      {image ? (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
        </div>
      ) : (
        <div className="h-48 w-full bg-linear-to-br from-brand-100 via-brand-50 to-brand-200 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-brand-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Контент */}
      <div className="p-6 flex flex-col grow">
        <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-brand-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 text-sm mb-4 grow">{description}</p>

        {/* Показуємо ціну та час тільки якщо вони є */}
        {(price !== undefined || time !== undefined) && (
          <div className="flex items-baseline justify-between mb-6">
            {price !== undefined && (
              <span className="text-2xl font-bold text-gray-800">
                {new Intl.NumberFormat('uk-UA', {
                  style: 'currency',
                  currency: 'UAH',
                  minimumFractionDigits: 0,
                }).format(price)}
              </span>
            )}
            {time !== undefined && (
              <span className="text-brand-600 bg-brand-100 px-3 py-1 rounded-full text-sm font-medium">
                {time} хв
              </span>
            )}
          </div>
        )}

        {/* Список переваг */}
        <ul className="space-y-3">
          {list.map((item, index) => {
            return (
              <li className="flex items-start gap-3" key={index}>
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ProcedureCard;
