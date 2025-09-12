import PricesSection from '@/components/sections/PricesSection';
import ReadyForChangeSection from '@/components/sections/ReadyForChangeSection';
import WhyChooseUsSection from '@/components/sections/WhyChooseUsSection';
import StructuredData from '@/components/seo/StructuredData';
import ServiceGallerySection from '@/components/sections/ServiceGallerySection';

import spaCompositionImg from '../../../../public/images/spa-composition.png';

import SkinCareSection from '@/components/sections/SkinCareSection';
import {
  heroSectionData,
  proceduresTypesData,
  whyChooseUsData,
  skinCareData,
  pricesData,
} from '@/mockData/face-care-mock';

// Gallery data for face care procedures
const faceCareProceduresGallery = [
  {
    src: '/images/cosmetologist-doing-face-treatment-applying-face-mask.jpg',
    alt: 'Процедура нанесення маски для обличчя',
    title: 'Маска для обличчя',
    description: 'Глибоке зволоження та живлення шкіри',
  },
  {
    src: '/images/woman-visiting-cosmetologist-making-rejuvenation-procedures.jpg',
    alt: 'Омолоджуючі процедури',
    title: 'Омолодження шкіри',
    description: 'Професійні методи відновлення',
  },
  {
    src: '/images/woman-visiting-cosmetologist-making-rejuvenation-procedures 2.jpg',
    alt: 'Консультація косметолога',
    title: 'Індивідуальна консультація',
    description: 'Персональний підхід до кожного клієнта',
  },
  {
    src: '/images/clean-face.png',
    alt: 'Чистка обличчя',
    title: 'Глибока чистка',
    description: 'Очищення пор та відновлення шкіри',
  },
  {
    src: '/images/face-care.png',
    alt: 'Догляд за шкірою',
    title: 'Комплексний догляд',
    description: 'Повний цикл процедур для здорової шкіри',
  },
  {
    src: '/images/ready-for-change.png',
    alt: 'Результат догляду',
    title: 'Результати процедур',
    description: 'Видимі зміни після курсу процедур',
  },
];
import ProceduresTypesSection from '@/components/sections/ProceduresTypesSection';
import HeroSection from '@/components/sections/HeroSection';
import ProcedureStepsSection from '@/components/sections/ProcedureStepsSection';

export default function FaceCarePage() {
  return (
    <>
      <StructuredData
        type="services"
        pageTitle="Догляд за обличчям - Skinera"
        pageDescription="Професійний догляд за обличчями"
        pageUrl="https://skinera-web.vercel.app/services/face-care"
      />
      <div>
        <HeroSection data={heroSectionData} />
        <div className="flex flex-col gap-20 max-w-6xl mx-auto mb-20">
          <ProceduresTypesSection data={proceduresTypesData} />
          <WhyChooseUsSection data={whyChooseUsData} />
        </div>

        {/* Photo Gallery Section - винесено з обмеженої обгортки для фону на всю ширину */}
        <ServiceGallerySection
          title="Наші процедури догляду за обличчям"
          subtitle="Переглянуте фото наших процедур та результатів роботи. Кожна процедура виконується професійними косметологами з використанням сучасного обладнання."
          images={faceCareProceduresGallery}
          columns={3}
          showTitles={true}
        />

        <div className="flex flex-col gap-20 max-w-6xl mx-auto mb-20">
          <ProcedureStepsSection />
          <PricesSection data={pricesData} />
        </div>
        <SkinCareSection data={skinCareData} />

        <ReadyForChangeSection imgUrl={spaCompositionImg} />
      </div>
    </>
  );
}
