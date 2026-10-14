import PhotoSlider from '@/components/common/PhotoSlider';
import ImageGallery from '@/components/common/ImageGallery';
import ServiceGallerySection from '@/components/sections/ServiceGallerySection';

// Sample data for demonstrations
const heroSliderImages = [
  {
    src: '/images/spa-composition.png',
    alt: 'SPA композиція',
    title: 'Розслабляючий SPA',
    description: 'Професійні SPA процедури для повного відновлення',
  },
  {
    src: '/images/laser-epilation.png',
    alt: 'Лазерна епіляція',
    title: 'Лазерна епіляція',
    description: 'Безболісне видалення небажаного волосся',
  },
  {
    src: '/images/massage.jpg',
    alt: 'Масаж',
    title: 'Лікувальний масаж',
    description: 'Терапевтичний масаж для зняття напруги',
  },
];

const serviceGalleryImages = [
  {
    src: '/images/cosmetologist-doing-face-treatment-applying-face-mask.jpg',
    alt: 'Маска для обличчя',
    title: 'Зволожуюча маска',
    description: 'Глибоке зволоження для всіх типів шкіри',
  },
  {
    src: '/images/woman-visiting-cosmetologist-making-rejuvenation-procedures.jpg',
    alt: 'Омолоджуючі процедури',
    title: 'Омолодження',
    description: 'Відновлення молодості шкіри',
  },
  {
    src: '/images/woman-visiting-cosmetologist-making-rejuvenation-procedures 2.jpg',
    alt: 'Консультація',
    title: 'Консультація',
    description: 'Індивідуальний підхід до кожного клієнта',
  },
  {
    src: '/images/clean-face.png',
    alt: 'Чистка обличчя',
    title: 'Глибока чистка',
    description: 'Професійна чистка пор',
  },
  {
    src: '/images/face-care.png',
    alt: 'Догляд за шкірою',
    title: 'Комплексний догляд',
    description: 'Повний цикл процедур красотки',
  },
  {
    src: '/images/laser-hair-remove.png',
    alt: 'Лазерне видалення волосся',
    title: 'Лазерна епіляція',
    description: 'Сучасні технології видалення волосся',
  },
];

const beforeAfterImages = [
  {
    src: '/images/ready-for-change.png',
    alt: 'До та після процедур',
    title: 'Результати догляду',
    description: 'Видимі зміни після курсу процедур',
  },
  {
    src: '/images/Rectangle.png',
    alt: 'Результат лікування',
    title: 'Результат',
    description: 'Ефективність наших методів',
  },
  {
    src: '/images/Rectangle2.png',
    alt: 'Покращення шкіри',
    title: 'Покращення',
    description: 'Помітні зміни стану шкіри',
  },
  {
    src: '/images/Rectangle3.png',
    alt: 'Омолодження',
    title: 'Омолодження',
    description: 'Відновлення природної краси',
  },
];

export default function SliderDemoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider Section */}
      <section className="relative mt-16 bg-linear-to-b from-purple-50 to-pink-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Демонстрація Photo Slider
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Переглядайте наші можливості створення інтерактивних галерей та слайдерів
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <PhotoSlider
              images={heroSliderImages}
              showNavigation={true}
              showIndicators={true}
              autoPlay={true}
              autoPlayInterval={5000}
              className="rounded-2xl overflow-hidden shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Service Gallery Section */}
      <ServiceGallerySection
        title="Наші послуги"
        subtitle="Професійні косметологічні процедури з використанням сучасного обладнання та інноваційних методик."
        images={serviceGalleryImages}
        columns={3}
        showTitles={true}
        className="bg-gray-50"
      />

      {/* Before/After Gallery */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
              Результати наших процедур
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Переконайтеся в ефективності наших методів на реальних прикладах клієнтів
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Квадратна галерея</h3>
              <div className="max-w-md">
                <PhotoSlider
                  images={beforeAfterImages}
                  showNavigation={true}
                  showIndicators={true}
                  className="rounded-xl overflow-hidden shadow-lg"
                />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Портретна орієнтація</h3>
              <div className="max-w-sm mx-auto">
                <PhotoSlider
                  images={beforeAfterImages.slice(0, 2)}
                  showNavigation={true}
                  showIndicators={true}
                  autoPlay={true}
                  autoPlayInterval={3000}
                  className="rounded-xl overflow-hidden shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Grid Gallery */}
      <section className="py-20 bg-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">Компактна галерея</h2>
            <p className="text-lg text-gray-600">
              Клікніть на будь-яке зображення для перегляду в повному розмірі
            </p>
          </div>

          <ImageGallery
            images={serviceGalleryImages}
            columns={4}
            showTitles={false}
            className="max-w-5xl mx-auto"
          />
        </div>
      </section>

      {/* Usage Guide */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
              Переваги нашого рішення
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-linear-to-b from-purple-50 to-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-white"
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
              <h3 className="text-xl font-bold text-gray-800 mb-4">Швидкість</h3>
              <p className="text-gray-600">
                Використовує Framer Motion для плавних анімацій без додаткових залежностей
              </p>
            </div>

            <div className="text-center p-8 bg-linear-to-b from-pink-50 to-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Адаптивність</h3>
              <p className="text-gray-600">
                Повністю адаптивний дизайн з підтримкою жестів на мобільних пристроях
              </p>
            </div>

            <div className="text-center p-8 bg-linear-to-b from-brand-50 to-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Інтеграція</h3>
              <p className="text-gray-600">
                Ідеально інтегрується з вашою існуючою системою дизайну Tailwind CSS
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
