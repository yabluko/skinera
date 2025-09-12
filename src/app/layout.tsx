// src/app/layout.tsx
import { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './global.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Main from '@/components/layout/Main';
import { ToastContainer } from 'react-toastify';
import ClientSessionProvider from '@/components/ClientSessionProvider';
import StructuredData from '@/components/seo/StructuredData';
import { ModalProvider } from '@/components/common/ModalContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Skinera - Салон краси у Львові | Догляд за обличчям, лазерна епіляція, масаж',
    template: '%s | Skinera',
  },
  description:
    'Професійний салон краси Skinera у Львові. Догляд за обличчям, лазерна епіляція, масаж. Індивідуальний підхід, сучасні технології, досвідчені спеціалісти. Записуйтесь онлайн!',
  keywords: [
    'салон краси Львів',
    'догляд за обличчям',
    'лазерна епіляція',
    'масаж Львів',
    'косметолог',
    'чистка обличчя',
    'пілінг',
    'антицелюлітний масаж',
    'класичний масаж',
    'Skinera',
  ],
  authors: [{ name: 'Skinera Beauty Salon' }],
  creator: 'Skinera',
  publisher: 'Skinera',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://skinera-web.vercel.app/'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Skinera - Салон краси у Львові',
    description: 'Професійний салон краси у Львові. Догляд за обличчям, лазерна епіляція, масаж.',
    url: 'https://skinera-web.vercel.app/',
    siteName: 'Skinera',
    images: [
      {
        url: '/images/face-care.png',
        width: 1200,
        height: 630,
        alt: 'Skinera - Салон краси у Львові',
      },
    ],
    locale: 'uk_UA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skinera - Салон краси у Львові',
    description: 'Професійний салон краси у Львові. Догляд за обличчям, лазерна епіляція, масаж.',
    images: ['/images/face-care.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
  },
  icons: {
    icon: [
      { url: '/icon/icon.svg', type: 'image/svg+xml' },
      { url: '/icon/favicon.png', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <head>
        <StructuredData type="home" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <ClientSessionProvider>
          <ModalProvider>
            <Header />
            <Main>
              {children}
              <ToastContainer />
            </Main>
            <Footer />
          </ModalProvider>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
