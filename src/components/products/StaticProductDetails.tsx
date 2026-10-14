'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Product } from '@/lib/products';
import ProductCard from '@/components/products/ProductCard';
import DescriptionRenderer from '@/components/common/DescriptionRenderer';
import AddToCartButton from '@/components/products/AddToCartButton';
import Modal from '@/components/common/Modal';
// import ModalButton from '@/components/common/ModalButton';
import ProductConsultationForm from '@/components/forms/ProductConsultationForm';
import { formatPriceWithCurrency } from '@/lib/utils';
import { toast } from 'react-toastify';
import { useFavorites } from '@/hooks/useFavorites';
import { useSession } from 'next-auth/react';
import { useState as useModalState } from 'react';
import AuthModal from '@/components/auth/AuthModal';

interface StaticProductDetailsProps {
  product: Product;
  relatedProducts: Product[];
}

export default function StaticProductDetails({
  product,
  relatedProducts,
}: StaticProductDetailsProps) {
  const { data: session, update } = useSession();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useModalState(false);
  const { addToFavorites, removeFromFavorites, isFavorite, hasHydrated } = useFavorites();

  // Використовуємо стан гідратації зі стора для запобігання помилці SSR
  const isProductFavorite = hasHydrated ? isFavorite(product.id) : false;

  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const openConsultationModal = () => {
    setIsConsultationModalOpen(true);
  };

  const closeConsultationModal = () => {
    setIsConsultationModalOpen(false);
  };

  const handleToggleFavorite = async () => {
    // Якщо користувач не авторизований, показуємо модальне вікно
    if (!session) {
      setShowAuthModal(true);
      return;
    }

    if (isProductFavorite) {
      await removeFromFavorites(product.id);
      toast.success('Товар видалено з улюблених', {
        position: 'top-right',
        autoClose: 2000,
      });
    } else {
      await addToFavorites(product);
      toast.success('Товар додано до улюблених!', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  const handleAuthSuccess = async () => {
    try {
      // Примусово оновлюємо сесію
      await update();

      // Невелика затримка для впевненості
      await new Promise(resolve => setTimeout(resolve, 200));

      // Тепер addToFavorites сам перевірить свіжу сесію
      await addToFavorites(product);
      toast.success('Товар додано до улюблених!', {
        position: 'top-right',
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error adding to favorites after auth:', error);
      toast.error('Помилка при додаванні до улюблених', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Main content */}
        <div className="flex flex-col md:flex-row gap-8 p-8">
          {/* Left side - Image and Details */}
          <div className="w-full md:w-3/5 flex flex-col">
            {/* Product image */}
            <div className="flex justify-center mb-6">
              <div
                className="relative w-full max-w-sm h-[500px] group cursor-pointer"
                onClick={handleImageClick}
              >
                <Image
                  src={product.image_url}
                  alt={product.name.en}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain transition-transform duration-300 group-hover:scale-110 p-8"
                  priority
                />
              </div>
            </div>
            {/* Product details accordion */}
            <ProductDetailsAccordion product={product} />
          </div>
          {/* Right side - Product info and purchase buttons */}
          <div className="w-full md:w-2/5 flex flex-col items-start space-y-6 mt-12 md:sticky md:top-20 md:self-start md:max-h-screen">
            <div className="flex flex-col gap-2 mb-10">
              <h2 className="text-3xl font-bold">{product.name.en}</h2>
              <p className="text-gray-600">{product.name.ua}</p>
            </div>
            <div className="flex justify-between items-center w-full border-b border-gray-400 pb-2">
              <span className="text-lg text-gray-600 border border-gray-300 rounded-md px-2 py-1">
                {product.volume} мл
              </span>
              <p className="text-3xl font-bold text-brand-600">
                {formatPriceWithCurrency(product.price)}
              </p>
            </div>
            <AddToCartButton product={product} />

            {/* Favorite Button */}
            <button
              onClick={handleToggleFavorite}
              className={`
                w-full py-3 px-4 rounded-lg border-2 transition-all duration-300 
                flex items-center justify-center gap-3 font-medium
                ${
                  isProductFavorite
                    ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-red-300 hover:bg-red-50 hover:text-red-600'
                }
              `}
            >
              <Image
                src={isProductFavorite ? '/heart-filled.svg' : '/heart.svg'}
                alt="heart"
                width={20}
                height={20}
                className="transition-all duration-300"
              />
              <span>{isProductFavorite ? 'Додано до улюблених' : 'Додати до улюблених'}</span>
            </button>

            <div className="mt-8 text-gray-600 flex flex-col gap-2 ">
              <p className="flex items-center gap-2">
                <span className="text-pink-500">🚚</span> Доставка: Нова пошта, Укрпошта
              </p>
              <p className="flex items-center gap-2">
                <span className="text-pink-500">✔️</span> Наявність: В наявності
              </p>
            </div>

            {/* Product Highlights */}
            <div className="w-full bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-gray-800">Ключові переваги</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span>100% оригінальна продукція</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span>Сертифікована косметика</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span>Швидка доставка</span>
                </div>
              </div>
            </div>

            {/* Customer Support */}
            <div
              className="w-full rounded-lg p-4 text-center"
              style={{ backgroundColor: '#FCEFE7' }}
            >
              <div className="text-brand-600 mb-2">💬</div>
              <p className="text-sm text-gray-900 font-medium mb-1">Потрібна консультація?</p>
              <p className="text-xs text-gray-700">Наші експерти готові допомогти</p>
              <button
                onClick={openConsultationModal}
                className="text-xs text-brand-600 underline hover:text-brand-700 cursor-pointer"
              >
                Замовити консультацію
              </button>
              <div></div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="p-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Схожі продукти</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <div
                  key={relatedProduct.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <ProductCard product={relatedProduct} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <Modal isOpen={isImageModalOpen} onClose={closeImageModal}>
        <div className="text-center p-4">
          <div className="relative w-full min-h-[800px]">
            <Image
              src={product.image_url}
              alt={product.name.en}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </Modal>

      {/* Consultation Modal */}
      <Modal isOpen={isConsultationModalOpen} onClose={closeConsultationModal}>
        <ProductConsultationForm productName={product.name.ua} productBrand={product.brand} />
      </Modal>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        defaultTab="signin"
      />
    </div>
  );
}

function ProductDetailsAccordion({ product }: { product: Product }) {
  // За замовчуванням всі секції закриті для уникнення hydration mismatch
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['description']));

  // Функція для оновлення стану секцій при зміні розміру екрану
  const updateSectionsForScreenSize = () => {
    if (window.innerWidth >= 768) {
      // На десктопах відкриваємо всі секції
      setOpenSections(new Set(['description', 'characteristics', 'usage', 'components']));
    } else {
      // На мобільних залишаємо тільки "Опис"
      setOpenSections(new Set(['description']));
    }
  };

  // Встановлюємо початковий стан після монтування компонента
  useEffect(() => {
    updateSectionsForScreenSize();

    // Додаємо слухач зміни розміру екрану
    window.addEventListener('resize', updateSectionsForScreenSize);
    return () => window.removeEventListener('resize', updateSectionsForScreenSize);
  }, []);

  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId);
    } else {
      newOpenSections.add(sectionId);
    }
    setOpenSections(newOpenSections);
  };

  const Section = ({
    id,
    title,
    children,
  }: {
    id: string;
    title: string;
    children: React.ReactNode;
  }) => {
    const isOpen = openSections.has(id);

    return (
      <div className="border-b border-gray-200 last:border-b-0">
        <button
          onClick={() => toggleSection(id)}
          className="w-full py-4 px-6 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
        >
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 pb-4 text-gray-600">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-xs border border-gray-200 overflow-hidden">
      {/* Description */}
      {product.content?.description && (
        <Section id="description" title="Опис">
          <DescriptionRenderer description={product.content.description} />
        </Section>
      )}

      {/* Characteristics */}
      <Section id="characteristics" title="Характеристики">
        <ul className="space-y-2">
          {product.characteristics?.cosmetic_classification && (
            <li>
              <strong>Класифікація:</strong> {product.characteristics.cosmetic_classification}
            </li>
          )}
          {product.characteristics?.skin_type && (
            <li>
              <strong>Тип шкіри:</strong> {product.characteristics.skin_type}
            </li>
          )}
          {product.characteristics?.purpose_and_result && (
            <li>
              <strong>Призначення:</strong> {product.characteristics.purpose_and_result}
            </li>
          )}
          {(product.characteristics?.volume || product.volume) && (
            <li>
              <strong>Обʼєм:</strong> {product.characteristics?.volume || product.volume} мл
            </li>
          )}
          {product.characteristics?.cleanser_type && (
            <li>
              <strong>Тип очищувача:</strong> {product.characteristics.cleanser_type}
            </li>
          )}
          {product.characteristics?.skin_problem && (
            <li>
              <strong>Проблеми шкіри:</strong> {product.characteristics.skin_problem}
            </li>
          )}
          {product.characteristics?.age && (
            <li>
              <strong>Вік:</strong> {product.characteristics.age}
            </li>
          )}
          {product.characteristics?.hypoallergenic && (
            <li>
              <strong>Гіпоалергенність:</strong> {product.characteristics.hypoallergenic}
            </li>
          )}
          <li>
            <strong>Бренд:</strong> {product.brand}
          </li>
          <li>
            <strong>Країна:</strong> {product.country}
          </li>
        </ul>
      </Section>

      {/* Instructions */}
      {product.content?.usage && (
        <Section id="usage" title="Як використовувати">
          <p className="leading-relaxed">{product.content.usage}</p>
        </Section>
      )}

      {/* Ingredients */}
      {product.content?.activeComponents && (
        <Section id="components" title="Активні компоненти">
          <p className="leading-relaxed">{product.content.activeComponents}</p>
        </Section>
      )}
    </div>
  );
}
