import React from 'react';
import { SkinCareDataInterface } from '@/interfaces/Section';
import Swiper from '../common/Swiper';

interface Props {
  data: SkinCareDataInterface;
}

const SkinCareSection = ({ data }: Props) => {
  // Create multiple images for the slider from the original single image
  // You can replace this with actual multiple images
  const skinCareImages = [
    {
      src: data.imgUrl.src,
      alt: 'Професійний догляд за шкірою',
      title: 'Індивідуальний підхід',
      description: 'Працюємо з усіма типами шкіри',
    },
    {
      src: '/images/cosmetologist-doing-face-treatment-applying-face-mask.jpg',
      alt: 'Процедура догляду за обличчям',
      title: 'Професійні процедури',
      description: 'Сучасне обладнання та техніки',
    },
    {
      src: '/images/woman-visiting-cosmetologist-making-rejuvenation-procedures.jpg',
      alt: 'Омолоджуючі процедури',
      title: 'Омолодження шкіри',
      description: 'Ефективні методи відновлення',
    },
    {
      src: '/images/woman-visiting-cosmetologist-making-rejuvenation-procedures 2.jpg',
      alt: 'Консультація косметолога',
      title: 'Консультація фахівця',
      description: 'Персональні рекомендації',
    },
  ];

  const listData = data.list;

  return (
    <section className="max-w-12xl mx-auto">
      <h2 className="font-bold text-xl sm:text-2xl md:text-3xl text-center mb-6 sm:mb-8 md:mb-11 px-4">
        Працюємо з усіма типами шкіри
      </h2>
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-11 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Photo Slider */}
        <div className="w-full lg:w-1/2 py-3">
          <Swiper images={skinCareImages} />
        </div>

        {/* Content remains the same */}
        <div className="w-full lg:w-1/2 flex-1 grid grid-cols-1 gap-4 sm:gap-6 pb-6 sm:pb-8 lg:pb-11">
          {listData.map(
            (
              item: {
                title: string;
                description: string;
                Icon: React.FC<React.SVGProps<SVGSVGElement>>;
              },
              index: number
            ) => {
              return (
                <div
                  key={index}
                  className="flex gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 bg-[#F7F7F7] rounded-xl sm:rounded-2xl hover:bg-[#F0F0F0] transition-colors duration-200"
                >
                  <item.Icon className="text-purple-500 pt-1 shrink-0 w-6 h-6 sm:w-7 sm:h-7" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
};

export default SkinCareSection;
