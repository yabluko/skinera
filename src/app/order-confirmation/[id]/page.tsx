'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Order } from '@/interfaces/Order';
import { formatPriceWithCurrency } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

const OrderConfirmationPage = () => {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders?id=${orderId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Помилка завантаження замовлення');
        }

        setOrder(data.order);
      } catch (err) {
        console.error('Помилка завантаження замовлення:', err);
        setError(err instanceof Error ? err.message : 'Невідома помилка');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Завантаження замовлення...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Помилка</h1>
          <p className="text-gray-600 mb-6">{error || 'Замовлення не знайдено'}</p>
          <Link
            href="/"
            className="inline-block bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 transition-colors"
          >
            Повернутися на головну
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <div className="text-center mb-12">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Замовлення успішно оформлено!</h1>
        <p className="text-gray-600 mb-4">Ваше замовлення прийнято в обробку</p>
        <div className="bg-gray-100 rounded-lg p-4 inline-block">
          <p className="text-sm text-gray-600">Номер замовлення</p>
          <p className="text-xl font-bold text-gray-900 font-mono">
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Деталі замовлення */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Деталі замовлення</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Клієнт</h3>
              <p className="text-gray-600">{order.userName}</p>
              <p className="text-gray-600">{order.userPhone}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900">Доставка</h3>
              <p className="text-gray-600">{order.delivery.city}</p>
              <p className="text-gray-600">{order.delivery.department}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900">Оплата</h3>
              <p className="text-gray-600">{order.payment.methodLabel}</p>
            </div>

            {/* <div>
              <h3 className="font-medium text-gray-900">Статус</h3>
              <span className="inline-block bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                {order.status === 'pending' ? 'В обробці' : order.status}
              </span>
            </div> */}
          </div>
        </div>

        {/* Товари */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Товари ({order.items.length})
          </h2>

          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 py-2 border-b border-gray-100 last:border-b-0"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 relative">
                  {item.image_url && (
                    <Image
                      src={item.image_url}
                      alt={item.name.ua}
                      fill
                      className="object-contain rounded-lg"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{item.name.ua}</h3>
                  <p className="text-sm text-gray-500">
                    {item.quantity} шт. × {formatPriceWithCurrency(item.price, '$')}
                  </p>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatPriceWithCurrency(item.price * item.quantity, '$')}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Разом:</span>
              <span className="text-xl font-bold text-gray-900">
                {formatPriceWithCurrency(order.total, '$')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600 mb-6">
          Ми звʼяжемося з вами найближчим часом для підтвердження замовлення
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="inline-block bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 transition-colors"
          >
            Продовжити покупки
          </Link>
          {/* <Link
            href="/account"
            className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Мій акаунт
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
