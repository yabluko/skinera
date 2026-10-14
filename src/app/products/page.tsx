'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import PriceSlider from '@/components/products/PriceSlider';
import PriceButton from '@/components/products/PriceButton';
import PriceModal from '@/components/products/PriceModal';
import CategoryFilter from '@/components/products/CategoryFilter';
import CategoryModal from '@/components/products/CategoryModal';
import CategoryButton from '@/components/products/CategoryButton';

// Lazy load the ProductList component
const ProductList = dynamic(() => import('@/components/products/ProductList'), {
  loading: () => (
    <div className="w-full flex flex-col items-center sm:grid sm:grid-cols-2 md:grid-cols-4 gap-10 sm:gap-6 p-4 sm:p-6 sm:justify-items-center">
      {Array(12)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg flex flex-col h-full w-full max-w-xs"
          >
            <div className="w-full h-[350px] sm:h-48 md:h-64 bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="grow p-4 text-center">
              <div className="h-4 bg-gray-200 animate-pulse rounded-sm w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded-sm w-1/4 mx-auto"></div>
            </div>
          </div>
        ))}
    </div>
  ),
  ssr: false,
});

interface Product {
  id: number;
  name: {
    en: string;
    ua: string;
  };
  price: number;
  image_url: string;
  category: string;
  brand: string;
  country: string;
  capacity: number;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const ProductsPage = () => {
  const [sortOption, setSortOption] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const isInitialLoadRef = useRef(true);
  // const [allBrands, setAllBrands] = useState<string[]>([]);
  // const [allCountries, setAllCountries] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

  // Функція для прокручування сторінки вгору
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Функція для відкриття модалки категорій
  const openCategoryModal = () => {
    setIsCategoryModalOpen(true);
  };

  // Функція для закриття модалки категорій
  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
  };

  // Функція для відкриття модалки цін
  const openPriceModal = () => {
    setIsPriceModalOpen(true);
  };

  // Функція для закриття модалки цін
  const closePriceModal = () => {
    setIsPriceModalOpen(false);
  };

  const fetchProducts = useCallback(async () => {
    try {
      if (isInitialLoadRef.current) {
        setIsLoading(true);
      } else {
        setIsFilterLoading(true);
      }
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedBrand) params.append('brand', selectedBrand);
      if (selectedCategories.length > 0) {
        selectedCategories.forEach(category => params.append('category', category));
      }
      if (selectedCountry) params.append('country', selectedCountry);
      if (minPrice > priceRange.min) params.append('minPrice', minPrice.toString());
      if (maxPrice < priceRange.max) params.append('maxPrice', maxPrice.toString());
      if (sortOption && sortOption !== 'default') params.append('sort', sortOption);
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());

      const url = `/api/products?${params.toString()}`;
      console.log('Fetching products with URL:', url);
      console.log('Selected categories:', selectedCategories);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setProducts(data.products);
      setPagination(data.pagination);

      // Update filters only on first load
      if (allCategories.length === 0) {
        try {
          const filtersResponse = await fetch('/api/products/filters');
          if (filtersResponse.ok) {
            const filtersData = await filtersResponse.json();
            setAllCategories(filtersData.categories || []);
            // setAllBrands(filtersData.brands || []);
            // setAllCountries(filtersData.countries || []);
          } else {
            console.error('Помилка завантаження фільтрів:', filtersResponse.status);
          }
        } catch (filterError) {
          console.error('Помилка завантаження фільтрів:', filterError);
        }

        // Завантаження діапазону цін
        try {
          const priceRangeResponse = await fetch('/api/products/price-range');
          if (priceRangeResponse.ok) {
            const priceData = await priceRangeResponse.json();
            setPriceRange({ min: priceData.minPrice, max: priceData.maxPrice });
            setMinPrice(priceData.minPrice);
            setMaxPrice(priceData.maxPrice);
          }
        } catch (priceError) {
          console.error('Помилка завантаження діапазону цін:', priceError);
        }
      }
    } catch (error) {
      console.error('Помилка завантаження продуктів:', error);
    } finally {
      setIsLoading(false);
      setIsFilterLoading(false);
      isInitialLoadRef.current = false;
    }
  }, [
    sortOption,
    searchQuery,
    selectedBrand,
    selectedCategories,
    selectedCountry,
    minPrice,
    maxPrice,
    priceRange.min,
    priceRange.max,
    pagination.page,
    pagination.limit,
    allCategories.length,
  ]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    scrollToTop();
  };

  const handlePriceChange = (min: number, max: number) => {
    console.log('ProductsPage: handlePriceChange called', { min, max });
    setMinPrice(min);
    setMaxPrice(max);
    setPagination(prev => ({ ...prev, page: 1 })); // Скидаємо на першу сторінку
    scrollToTop();
  };

  const resetPriceFilter = useCallback(() => {
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
    setPagination(prev => ({ ...prev, page: 1 }));
    scrollToTop();
  }, [priceRange.min, priceRange.max]);

  const resetAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedBrand('');
    setSelectedCategories([]);
    setSelectedCountry('');
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
    setSortOption('default');
    setPagination(prev => ({ ...prev, page: 1 }));
    scrollToTop();
  }, [priceRange.min, priceRange.max]);

  const handleCategoryChange = useCallback((categories: string[]) => {
    setSelectedCategories(categories);
    setPagination(prev => ({ ...prev, page: 1 })); // Скидаємо на першу сторінку
    scrollToTop();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            pagination.page === i
              ? 'bg-brand-600 text-white'
              : 'bg-white text-gray-700 hover:bg-brand-100'
          } transition-colors duration-200`}
        >
          {i}
        </button>
      );
    }
    return (
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="px-4 py-2 rounded-sm bg-white text-gray-700 hover:bg-pink-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ←
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
          className="px-4 py-2 rounded-sm bg-white text-gray-700 hover:bg-pink-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          →
        </button>
      </div>
    );
  };

  if (isLoading) {
    return <p className="text-center text-gray-600 text-lg">⏳ Завантаження...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 text-center m-6 sm:m-8 md:m-10 lg:m-12">
        Наші Товари
      </h1>
      <div className="flex flex-col md:flex-row gap-6 relative">
        <aside className="md:w-1/4 p-6 bg-white rounded-lg shadow-md space-y-6 h-fit md:sticky md:top-20 md:max-h-[calc(100vh-3rem)]">
          {/* Пошук товарів */}
          <div className="space-y-3">
            <label className="text-gray-700 font-semibold block text-sm uppercase tracking-wide">
              Пошук товарів
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Введіть назву товару..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 })); // Скидаємо на першу сторінку
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    scrollToTop();
                  }
                }}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:bg-white transition-all duration-300 outline-hidden hover:border-pink-300 hover:bg-white text-sm shadow-xs hover:shadow-md"
              />
              {searchQuery && (
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      scrollToTop();
                    }}
                    className="pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => scrollToTop()}
                    className="pr-3 text-pink-500 hover:text-pink-600 transition-colors"
                    title="Почати пошук"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Кнопки фільтрів на мобільному */}
          <div className="md:hidden flex gap-3 w-full">
            <CategoryButton
              onClick={openCategoryModal}
              selectedCategories={selectedCategories}
              totalCategories={allCategories.length}
            />

            <PriceButton
              onClick={openPriceModal}
              currentMin={minPrice}
              currentMax={maxPrice}
              defaultMin={priceRange.min}
              defaultMax={priceRange.max}
              onReset={resetPriceFilter}
            />
          </div>

          {/* Фільтр за категорією (тільки на десктопі) */}
          <div className="hidden md:block space-y-2">
            <CategoryFilter
              categories={allCategories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
            />
          </div>
          {/* Фільтр за ціною (тільки на десктопі) */}
          <div className="hidden md:block space-y-2">
            <PriceSlider
              minPrice={priceRange.min}
              maxPrice={priceRange.max}
              currentMin={minPrice}
              currentMax={maxPrice}
              onPriceChange={handlePriceChange}
            />
          </div>

          {/* Кнопка скидання всіх фільтрів */}
          <div className="hidden md:block pt-4 border-t border-gray-200">
            <button
              onClick={resetAllFilters}
              className="hidden md:block w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:text-gray-800"
            >
              🗑️ Скинути всі фільтри
            </button>
          </div>
        </aside>
        <div className="md:w-3/4 flex flex-col">
          <div className="w-full flex justify-center sm:block relative min-h-[500px]">
            {isFilterLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg transition-opacity duration-300">
                <div className="flex flex-col items-center space-y-4 p-8">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200"></div>
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent absolute top-0 left-0"></div>
                  </div>
                  <p className="text-gray-600 font-medium text-center">🔄 Оновлення товарів...</p>
                </div>
              </div>
            )}
            <div
              className={`transition-opacity duration-300 ${
                isFilterLoading ? 'opacity-30' : 'opacity-100'
              }`}
            >
              <ProductList products={products} />
            </div>
          </div>
          {!isFilterLoading && renderPagination()}
        </div>
      </div>

      {/* Модалка категорій */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={closeCategoryModal}
        categories={allCategories}
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryChange}
      />

      {/* Модалка цін */}
      <PriceModal
        isOpen={isPriceModalOpen}
        onClose={closePriceModal}
        minPrice={priceRange.min}
        maxPrice={priceRange.max}
        currentMin={minPrice}
        currentMax={maxPrice}
        onPriceChange={handlePriceChange}
      />
    </div>
  );
};

export default ProductsPage;
