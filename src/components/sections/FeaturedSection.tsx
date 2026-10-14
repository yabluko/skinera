import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const FeaturedSection = () => {
  return (
    <section className="py-16 bg-linear-to-br from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* 
          Варіант 1: Фото зліва, текст справа (поточний)
          Варіант 2: Текст зліва, фото справа (замінити grid-cols-2 на grid-cols-2 та поміняти місцями div'и)
        */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Фото зліва */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true, margin: '-100px' }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/cosmetologist-doing-face-treatment-applying-face-mask.jpg"
                alt="Професійний догляд за обличчям у салоні Skinera"
                fill
                className="object-cover"
                priority
              />
              {/* Градієнтний оверлей для кращого контрасту */}
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />

              {/* Декоративний елемент */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-600 rounded-full opacity-20 blur-xl" />
            </div>

            {/* Додаткове фото справа від основного */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              viewport={{ once: true, margin: '-100px' }}
              className="hidden lg:block absolute -top-8 -right-8 w-28 h-28 md:w-40 md:h-40 rounded-xl overflow-hidden shadow-lg"
            >
              <Image
                src="/images/laser-epilation-hair-removal-therapy-small.jpg"
                alt="Лазерна епіляція"
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </motion.div>
          </motion.div>

          {/* Текст справа */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-6 md:space-y-8 order-1 lg:order-2"
          >
            {/* Заголовок */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true, margin: '-100px' }}
                className="inline-flex items-center px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-4"
              >
                <span className="w-2 h-2 bg-brand-600 rounded-full mr-2"></span>
                Наші послуги
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true, margin: '-100px' }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6"
              >
                Професійний догляд за вашою красою
              </motion.h2>
            </div>

            {/* Опис */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true, margin: '-100px' }}
              className="text-lg md:text-xl text-gray-600 leading-relaxed"
            >
              У салоні Skinera ми поєднуємо найновіші технології з досвідом наших майстрів, щоб
              створити для вас найкращий досвід догляду за шкірою та тілом.
            </motion.p>

            {/* Переваги */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true, margin: '-100px' }}
              className="space-y-3 md:space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-brand-600 rounded-full flex items-center justify-center shrink-0">
                  <svg
                    className="w-3 h-3 md:w-4 md:h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium text-sm md:text-base">
                  Сертифіковані спеціалісти
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-brand-600 rounded-full flex items-center justify-center shrink-0">
                  <svg
                    className="w-3 h-3 md:w-4 md:h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium text-sm md:text-base">
                  Сучасне обладнання
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-brand-600 rounded-full flex items-center justify-center shrink-0">
                  <svg
                    className="w-3 h-3 md:w-4 md:h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium text-sm md:text-base">
                  Індивідуальний підхід
                </span>
              </div>
            </motion.div>

            {/* Кнопка дії */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true, margin: '-100px' }}
              className="pt-4"
            >
              <button
                onClick={() => {
                  // Прокручуємо до секції з послугами
                  const servicesSection = document.querySelector('[data-section="services"]');
                  if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-white text-brand-600 border-2 border-brand-600 px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold hover:bg-brand-600 hover:text-white transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Переглянути послуги
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
