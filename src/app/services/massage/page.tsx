'use client';

import StructuredData from '@/components/seo/StructuredData';
import ReadyForChangeSection from '@/components/sections/ReadyForChangeSection';
import ServiceGallerySection from '@/components/sections/ServiceGallerySection';

import PricesSection from '@/components/sections/PricesSection';
import readyForChange from '../../../../public/images/ready-for-change.png';
import HeroSection from '@/components/sections/HeroSection';
import { heroSectionData, proceduresTypesData, massagePricingData } from '@/mockData/massage-mock';
import ProceduresTypesSection from '@/components/sections/ProceduresTypesSection';
import ProcedureStepsSection from '@/components/sections/ProcedureStepsSection';

// Gallery data for massage procedures
const massageProceduresGallery = [
  {
    src: '/images/woman-getting-back-massage-from-masseur.jpg',
    alt: 'Масаж спини від професійного масажиста',
    title: 'Класичний масаж',
    description: "Професійний масаж для розслаблення м'язів та зняття напруги",
  },
  {
    src: '/images/massage.jpg',
    alt: 'Релаксуючий масаж',
    title: 'Розслаблюючий масаж',
    description: 'Ніжний масаж для зняття стресу та досягнення гармонії',
  },
  {
    src: '/images/spa-composition.png',
    alt: 'SPA композиція для масажу',
    title: 'SPA процедури',
    description: 'Комплексний підхід до оздоровлення та краси',
  },
  {
    src: '/images/ready-for-change.png',
    alt: 'Результати масажної терапії',
    title: 'Відчутні результати',
    description: 'Покращення самопочуття після курсу масажних процедур',
  },
];

export default function MassagePage() {
  return (
    <>
      <StructuredData
        type="services"
        pageTitle="Масаж - Skinera"
        pageDescription="Масаж - це не просто фізичний вплив, це відчуття здоров'я та гармонії"
        pageUrl="https://skinera-web.vercel.app/services/massage"
      />
      <div>
        <HeroSection data={heroSectionData} />
        <div className="flex flex-col  max-w-6xl mx-auto mb-20">
          <ProceduresTypesSection data={proceduresTypesData} />

          <div className="mb-20">
            {/* Photo Gallery Section */}
            <ServiceGallerySection
              title="Наші масажні процедури"
              subtitle="Переглянуте фото наших масажних процедур та атмосфери нашого центру. Кожен масаж виконується кваліфікованими спеціалістами з використанням натуральних олій та професійних технік."
              images={massageProceduresGallery}
              columns={2}
              showTitles={true}
              backgroundColor="none"
            />
          </div>

          <PricesSection data={massagePricingData} wavyBottomBorder={false} />
          <ProcedureStepsSection />
        </div>
        <ReadyForChangeSection imgUrl={readyForChange} />
      </div>
    </>
  );
}
