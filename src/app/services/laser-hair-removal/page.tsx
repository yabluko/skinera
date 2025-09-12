'use client';

import StructuredData from '@/components/seo/StructuredData';
import WhyChooseUsSection from '@/components/sections/WhyChooseUsSection';
import ServiceGallerySection from '@/components/sections/ServiceGallerySection';
import PricesSection from '@/components/sections/PricesSection';
import LaserFaqSection from '@/components/sections/LaserFaqSection';
import ReadyForChangeSection from '@/components/sections/ReadyForChangeSection';

import readyForChangeImg from '../../../../public/images/ready-for-change.png';
import HeroSection from '@/components/sections/HeroSection';
import { heroSectionData, pricesData, whyChooseUsData } from '@/mockData/laser-hair-removal-mock';
import ProcedureStepsSection from '@/components/sections/ProcedureStepsSection';

// Gallery data for laser hair removal procedures
const laserHairRemovalGallery = [
  {
    src: '/images/laser-epilation-hair-removal-therapy.jpg',
    alt: 'Процедура лазерної епіляції',
    title: 'Лазерна епіляція',
    description: 'Безболісне та ефективне видалення небажаного волосся',
  },
  {
    src: '/images/laser-hair-remove.png',
    alt: 'Лазерне видалення волосся',
    title: 'Професійне обладнання',
    description: 'Сучасні лазерні технології для максимальної ефективності',
  },
  {
    src: '/images/laser-epilation.png',
    alt: 'Лазерна епіляція обличчя',
    title: 'Епіляція обличчя',
    description: 'Делікатне видалення волосся на чутливих ділянках',
  },
  {
    src: '/images/woman-visiting-cosmetologist-making-rejuvenation-procedures.jpg',
    alt: 'Консультація косметолога',
    title: 'Професійна консультація',
    description: 'Індивідуальний підхід та підбір оптимальної програми',
  },
  {
    src: '/images/ready-for-change.png',
    alt: 'Результати лазерної епіляції',
    title: 'Гладка шкіра',
    description: 'Тривалий результат після курсу процедур',
  },
  {
    src: '/images/spa-composition.png',
    alt: 'SPA атмосфера',
    title: 'Комфортна атмосфера',
    description: 'Розслаблююча обстановка під час процедур',
  },
];

export default function LaserHairRemovalPage() {
  return (
    <>
      <StructuredData
        type="services"
        pageTitle="Лазерна епіляція - Skinera"
        pageDescription="Безболісне та ефективне видалення небажаного волосся"
        pageUrl="https://skinera-web.vercel.app/services/laser-hair-removal"
      />
      <div>
        <HeroSection data={heroSectionData} />
        <div className="flex flex-col gap-20 max-w-6xl mx-auto mb-20 mt-20">
          <WhyChooseUsSection data={whyChooseUsData} />
        </div>
        <ServiceGallerySection
          title="Наші процедури лазерної епіляції"
          subtitle="Переглянуте фото наших процедур лазерної епіляції та сучасного обладнання. Всі процедури виконуються кваліфікованими спеціалістами з дотриманням найвищих стандартів безпеки."
          images={laserHairRemovalGallery}
          columns={3}
          showTitles={true}
          backgroundColor="#EAD2D7"
          borderRadius={{
            topLeft: '50% 20px',
            topRight: '50% 20px',
          }}
        />
        <div className="flex flex-col gap-20 max-w-6xl mx-auto mb-20">
          <ProcedureStepsSection />
          <PricesSection data={pricesData} />
          <LaserFaqSection />
        </div>
        {/* Photo Gallery Section */}

        <ReadyForChangeSection imgUrl={readyForChangeImg} />
      </div>
    </>
  );
}
