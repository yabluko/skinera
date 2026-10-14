import Image from 'next/image';
import React from 'react';
import { useCartStore } from '../store/cartStore';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import { formatPriceWithCurrency } from '@/lib/utils';

const OrderSection = () => {
  const router = useRouter();

  const cart = useCartStore(state => state.cart);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const updateQuantity = useCartStore(state => state.updateQuantity);

  const deleteProduct = (id: number) => {
    router.push('/');
    setTimeout(() => {
      removeFromCart(id);
    }, 5000);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-4 md:p-6 w-full lg:min-w-[440px] border-[#ebebeb] border h-auto">
      <div className="border-b border-[#ebebeb] pb-4">
        <h2 className="text-[#212121] text-lg md:text-xl font-bold">Ваше замовлення</h2>{' '}
      </div>
      <div
        className="orders-container max-h-[300px] md:max-h-[440px] overflow-y-auto overflow-x-hidden pr-2 md:pr-5 -mr-2 md:-mr-5"
        style={{ scrollbarGutter: 'stable' }}
      >
        <ul>
          {cart.map((item, index) => {
            return (
              <li className="flex flex-1 py-3 border-b border-[#ebebeb]" key={index}>
                <div className="relative w-16 h-20 md:w-24 md:h-28 shrink-0">
                  <Image
                    alt="Appereance of how looking cream for face care"
                    fill
                    src={item.image_url ?? ''}
                    className="object-fill"
                  />
                </div>
                <div className="flex-1 ml-3 md:ml-0">
                  <h3 className="text-[#212121] text-xs md:text-sm font-normal mb-1 line-clamp-2">
                    {item.name.ua}
                  </h3>
                  <p className="text-[#A6A2A2] text-xs md:text-sm line-clamp-1">{item.name.en}</p>
                  <span className="text-[#A6A2A2] text-xs md:text-sm">
                    {formatPriceWithCurrency(item.price, '$')}
                  </span>
                  <div className="flex justify-between items-center mt-2 md:mt-3">
                    <div className="relative flex items-center">
                      <button
                        className="w-8 h-8 md:w-10 md:h-10 border-[#ebebeb] border relative
                  before:content-[''] before:absolute before:w-[12px] md:before:w-[16px] before:border-t before:border-black before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      ></button>
                      <span className="w-8 md:w-10 h-full flex items-center justify-center text-xs md:text-sm">
                        {item.quantity}
                      </span>
                      <button
                        className="w-8 h-8 md:w-10 md:h-10 border-[#ebebeb] border relative
                  before:content-[''] before:absolute before:w-[12px] md:before:w-[16px] before:border-t before:border-black before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2
                  after:content-[''] after:absolute after:h-[12px] md:after:h-[16px] after:border-l after:border-black after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      ></button>
                    </div>
                    <RiDeleteBin6Line
                      width={24}
                      height={24}
                      className="cursor-pointer text-gray-500 hover:text-red-500 transition-colors"
                      onClick={() => deleteProduct(item.id)}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="pt-3">
        <div className="flex justify-between mb-3">
          <span className="text-xs md:text-sm">Підсумок</span>
          <span className="text-xs md:text-sm font-medium">
            {formatPriceWithCurrency(total, '$')}
          </span>
        </div>
        <div className="flex justify-between mt-4 md:mt-6">
          <h2 className="text-lg md:text-xl font-semibold">Разом</h2>
          <span className="text-sm md:text-base font-semibold">
            {formatPriceWithCurrency(total, '$')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSection;
