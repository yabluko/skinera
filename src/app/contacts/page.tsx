import { Metadata } from 'next';
import ContactsSection from '@/components/sections/ContactsSection';
import StructuredData from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Контакти - Адреса, телефон, графік роботи',
  description:
    'Контактна інформація салону краси Skinera: адреса у Львові (пр. Червоної калини, 36в), телефон +38 096 518 0956, графік роботи. Записуйтесь на прийом!',
  keywords: [
    'контакти салону краси',
    'адреса Skinera Львів',
    'телефон салону краси',
    'графік роботи',
    'запис на прийом',
    'де знаходиться салон',
    'Червоної калини 36в',
  ],
  openGraph: {
    title: 'Контакти - Skinera',
    description: 'Наша адреса, телефон та графік роботи',
    images: [
      {
        url: '/images/face-care.png',
        width: 1200,
        height: 630,
        alt: 'Контакти салону краси Skinera',
      },
    ],
  },
};

export default function ContactsPage() {
  return (
    <>
      <StructuredData
        type="contact"
        pageTitle="Контакти - Skinera"
        pageDescription="Наша адреса, телефон та графік роботи"
        pageUrl="https://skinera-web.vercel.app/contacts"
      />
      <main className="bg-gradient-to-b from-purple-50 via-white to-white pt-20">
        <ContactsSection />
      </main>
    </>
  );
}
