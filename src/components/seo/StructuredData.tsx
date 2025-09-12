import React from 'react';

interface StructuredDataProps {
  type?: 'home' | 'services' | 'about' | 'contact' | 'products' | 'reviews';
  pageTitle?: string;
  pageDescription?: string;
  pageUrl?: string;
}

const StructuredData: React.FC<StructuredDataProps> = ({
  type = 'home',
  pageTitle,
  pageDescription,
  pageUrl,
}) => {
  const baseUrl = 'https://skinera-web.vercel.app/'; // Update with your actual domain
  const businessName = 'Skinera';
  const businessDescription =
    'Професійний салон краси у Львові. Догляд за обличчям, лазерна епіляція, масаж. Індивідуальний підхід до кожного клієнта.';

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: businessName,
    description: businessDescription,
    url: baseUrl,
    logo: `${baseUrl}/icon/icon.svg`,
    image: `${baseUrl}/images/face-care.png`,
    telephone: '+380965180956',
    email: 'info@skinera.com.ua', // Update with actual email
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'пр. Червоної калини, 36в',
      addressLocality: 'Львів',
      addressCountry: 'UA',
      postalCode: '79000', // Update with actual postal code
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 49.79993463398742,
      longitude: 24.045562377439794,
    },
    openingHours: ['Mo-Sa 10:00-20:00'],
    sameAs: [
      // Add your social media URLs here
      'https://www.facebook.com/skinera.lviv',
      'https://www.instagram.com/skinera.lviv',
    ],
  };

  // Local Business Schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: businessName,
    description: businessDescription,
    url: baseUrl,
    telephone: '+380965180956',
    email: 'info@skinera.com.ua',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'пр. Червоної калини, 36в',
      addressLocality: 'Львів',
      addressRegion: 'Львівська область',
      addressCountry: 'UA',
      postalCode: '79000',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 49.79993463398742,
      longitude: 24.045562377439794,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '20:00',
        validFrom: '2024-01-01',
        validThrough: '2024-12-31',
        description: 'За попереднім записом',
      },
    ],
    priceRange: '$$',
    currenciesAccepted: 'UAH',
    paymentAccepted: 'Cash, Card',
    hasMap:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2575.2623841269046!2d24.045562377439794!3d49.79993463398742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2f0b187dc478a32d%3A0x829982e0bf3aca43!2sSkinera!5e0!3m2!1suk!2sua!4v1739518590779!5m2!1suk!2sua',
    image: [
      `${baseUrl}/images/face-care.png`,
      `${baseUrl}/images/laser-epilation.png`,
      `${baseUrl}/images/massage.png`,
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
  };

  // Services Schema
  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Послуги салону краси Skinera',
    provider: {
      '@type': 'BeautySalon',
      name: businessName,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Каталог послуг',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Догляд за обличчям',
            description: "Професійні процедури для чистоти та здоров'я вашої шкіри",
            category: 'Facial Care',
            offers: {
              '@type': 'Offer',
              priceCurrency: 'UAH',
              availability: 'https://schema.org/InStock',
            },
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Лазерна епіляція',
            description: 'Сучасний метод позбавлення від небажаного волосся',
            category: 'Laser Hair Removal',
            offers: {
              '@type': 'Offer',
              priceCurrency: 'UAH',
              availability: 'https://schema.org/InStock',
            },
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Масаж',
            description: 'Розслаблюючий та лікувальний масаж для вашого тіла',
            category: 'Massage Therapy',
            offers: {
              '@type': 'Offer',
              priceCurrency: 'UAH',
              availability: 'https://schema.org/InStock',
            },
          },
        },
      ],
    },
  };

  // Website Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: businessName,
    url: baseUrl,
    description: businessDescription,
    publisher: {
      '@type': 'Organization',
      name: businessName,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'uk-UA',
  };

  // Page-specific schemas
  let pageSpecificSchema = {};

  if (type === 'services') {
    pageSpecificSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageTitle || 'Послуги салону краси Skinera',
      description: pageDescription || "Повний спектр послуг для вашої краси та здоров'я",
      url: pageUrl || `${baseUrl}/services`,
      mainEntity: servicesSchema,
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Головна',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Послуги',
            item: `${baseUrl}/services`,
          },
        ],
      },
    };
  } else if (type === 'about') {
    pageSpecificSchema = {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: pageTitle || 'Про нас - Skinera',
      description: pageDescription || 'Наші цінності та філософія роботи',
      url: pageUrl || `${baseUrl}/about`,
      mainEntity: organizationSchema,
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Головна',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Про нас',
            item: `${baseUrl}/about`,
          },
        ],
      },
    };
  } else if (type === 'contact') {
    pageSpecificSchema = {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: pageTitle || 'Контакти - Skinera',
      description: pageDescription || 'Наша адреса, телефон та графік роботи',
      url: pageUrl || `${baseUrl}/contacts`,
      mainEntity: localBusinessSchema,
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Головна',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Контакти',
            item: `${baseUrl}/contacts`,
          },
        ],
      },
    };
  }

  // Combine all schemas
  const allSchemas = [
    organizationSchema,
    localBusinessSchema,
    websiteSchema,
    ...(Object.keys(pageSpecificSchema).length > 0 ? [pageSpecificSchema] : []),
    ...(type === 'home' || type === 'services' ? [servicesSchema] : []),
  ];

  return (
    <>
      {allSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 2),
          }}
        />
      ))}
    </>
  );
};

export default StructuredData;
