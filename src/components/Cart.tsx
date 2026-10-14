// components/Cart.tsx
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CartItem } from './store/cartStore';
import { formatPriceWithCurrency } from '@/lib/utils';

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveFromCart: (productId: number) => void;
  onClose: () => void;
}

const Cart = ({ cart, onUpdateQuantity, onRemoveFromCart, onClose }: CartProps) => {
  const router = useRouter();
  const handleButtonClick = () => {
    router.push('/checkout');
    onClose();
  };

  if (!cart.length) {
    return (
      <div
        className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-100 pointer-events-auto"
        onClick={onClose}
      >
        <div
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4"
          onClick={e => e.stopPropagation()}
        >
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Ваш кошик порожній</h3>
            <p className="text-gray-600 mb-6">Додайте товари до кошика, щоб зробити замовлення</p>
            <button
              className="w-full bg-brand-600 text-white px-6 py-3 rounded-full hover:bg-brand-700 transition-colors shadow-md hover:shadow-lg"
              onClick={onClose}
            >
              Продовжити покупки
            </button>
          </div>
        </div>
      </div>
    );
  }
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-100 pointer-events-auto"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl w-full mx-2 sm:mx-4 max-h-[90vh] sm:max-h-[85vh] flex flex-col max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
            Кошик <span className="text-brand-600">({totalItems})</span>
          </h3>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-xl sm:text-2xl"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-2">
          <ul className="space-y-4">
            {cart.map(item => (
              <li
                key={item.id}
                className="flex flex-col md:flex-row  justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                {/* Mobile Layout: Image + Info in one row */}
                <div className="flex items-center gap-3 w-full sm:w-auto ">
                  {/* Product Image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 relative">
                    <Image
                      src={item.image_url ?? '/images/placeholder.jpg'}
                      alt={item.name.en}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 sm:min-w-[200px] lg:min-w-[300px]">
                    <h4 className="font-semibold text-gray-800 text-base sm:text-lg mb-1 truncate">
                      {item.name.en}
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2 truncate">
                      {item.name.ua}
                    </p>
                    <p className="text-brand-600 font-bold text-base sm:text-lg">
                      {formatPriceWithCurrency(item.price, '₴')}
                    </p>
                  </div>

                  {/* Remove Button - Mobile (top right) */}
                  <button
                    className="sm:hidden text-gray-400 hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-lg shrink-0"
                    onClick={() => onRemoveFromCart(item.id)}
                  >
                    ×
                  </button>
                </div>

                {/* Mobile: Quantity and Price row */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:shrink-0 sm:gap-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center bg-white rounded-full shadow-xs border border-gray-200">
                    <button
                      className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-600 hover:text-brand-600 transition-colors font-semibold text-sm sm:text-base"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="w-10 sm:w-12 text-center text-gray-800 font-semibold text-sm sm:text-base">
                      {item.quantity}
                    </span>
                    <button
                      className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-600 hover:text-brand-600 transition-colors font-semibold text-sm sm:text-base"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  {/* Total Price for Item */}
                  <div className="text-right min-w-[80px] sm:min-w-[100px]">
                    <p className="text-base sm:text-lg font-bold text-gray-800">
                      {formatPriceWithCurrency(item.price * item.quantity, '₴')}
                    </p>
                  </div>

                  {/* Remove Button - Desktop */}
                  <button
                    className="hidden sm:flex text-gray-400 hover:text-red-500 transition-colors w-10 h-10 items-center justify-center rounded-full hover:bg-gray-200 text-xl shrink-0"
                    onClick={() => onRemoveFromCart(item.id)}
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 bg-white">
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            <div className="flex justify-between items-center text-base sm:text-lg">
              <span className="text-gray-600">Товари ({totalItems} шт.):</span>
              <span className="font-semibold text-gray-800">
                {formatPriceWithCurrency(
                  cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
                  '₴'
                )}
              </span>
            </div>
            <div className="flex justify-between items-center text-base sm:text-lg">
              <span className="text-gray-600">Доставка:</span>
              <span className="font-semibold text-green-600">Безкоштовно</span>
            </div>
            <div className="flex justify-between items-center text-lg sm:text-xl pt-2 sm:pt-3 border-t border-gray-100">
              <span className="font-bold text-gray-800">Загальна сума:</span>
              <span className="text-xl sm:text-2xl font-bold text-brand-600">
                {formatPriceWithCurrency(
                  cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
                  '₴'
                )}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full md:w-[70%]  align-center mx-auto ">
            <button
              className="order-2 sm:order-1 flex-1 bg-gray-100 text-gray-700 px-4 sm:px-6 py-3 rounded-full hover:bg-gray-200 transition-colors font-semibold text-sm sm:text-base"
              onClick={onClose}
            >
              Продовжити покупки
            </button>
            <button
              className="order-1 sm:order-2 flex-1 bg-brand-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-full hover:bg-brand-700 transition-colors shadow-md hover:shadow-lg font-semibold text-base sm:text-lg"
              onClick={handleButtonClick}
            >
              Оформити замовлення
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
