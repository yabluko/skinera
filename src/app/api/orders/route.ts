import { NextRequest, NextResponse } from 'next/server';
import { adminDb as db } from '@/lib/firebase-admin';
import { Order, CreateOrderRequest } from '@/interfaces/Order';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'База даних не ініціалізована' }, { status: 500 });
    }

    const orderData: CreateOrderRequest = await request.json();

    // Валідація обов'язкових полів
    if (!orderData.userName || !orderData.userPhone) {
      return NextResponse.json({ error: "Відсутні обов'язкові поля користувача" }, { status: 400 });
    }

    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json({ error: 'Кошик порожній' }, { status: 400 });
    }

    if (!orderData.delivery.city || !orderData.delivery.department) {
      return NextResponse.json({ error: 'Відсутні дані доставки' }, { status: 400 });
    }

    // Генеруємо унікальний ID для замовлення
    const orderId = uuidv4();
    const now = new Date();

    // Створюємо об'єкт замовлення
    const order: Order = {
      id: orderId,
      userEmail: orderData.userEmail || `user-${Date.now()}@skinera.com`,
      userName: orderData.userName,
      userPhone: orderData.userPhone,
      items: orderData.items,
      total: orderData.total,
      delivery: orderData.delivery,
      payment: orderData.payment,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    // Зберігаємо замовлення в Firebase
    await db.collection('orders').doc(orderId).set(order);

    console.log('✅ Замовлення збережено в Firebase:', orderId);

    return NextResponse.json({
      success: true,
      orderId: orderId,
      message: 'Замовлення успішно створено',
    });
  } catch (error) {
    console.error('❌ Помилка створення замовлення:', error);
    return NextResponse.json({ error: 'Внутрішня помилка сервера' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'База даних не ініціалізована' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json({ error: 'ID замовлення не надано' }, { status: 400 });
    }

    const orderDoc = await db.collection('orders').doc(orderId).get();

    if (!orderDoc.exists) {
      return NextResponse.json({ error: 'Замовлення не знайдено' }, { status: 404 });
    }

    const orderData = orderDoc.data() as Order;

    return NextResponse.json({
      success: true,
      order: orderData,
    });
  } catch (error) {
    console.error('❌ Помилка отримання замовлення:', error);
    return NextResponse.json({ error: 'Внутрішня помилка сервера' }, { status: 500 });
  }
}
