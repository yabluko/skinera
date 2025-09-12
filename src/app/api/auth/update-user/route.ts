import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { z } from 'zod';

const updateUserSchema = z.object({
  email: z
    .string()
    .optional()
    .refine(email => !email || z.string().email().safeParse(email).success, {
      message: 'Невірний формат email',
    }),
  firstName: z.string().min(1, "Ім'я обов'язкове"),
  lastName: z.string().min(1, "Прізвище обов'язкове"),
  phone: z.string().min(1, "Телефон обов'язковий"),
});

export async function POST(request: NextRequest) {
  // Skip Firebase operations during build time
  if (process.env.VERCEL_BUILD) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  if (!adminDb) {
    console.error('❌ Firebase Admin DB not initialized');
    return NextResponse.json({ error: 'Database not initialized' }, { status: 503 });
  }

  console.log('✅ Firebase Admin DB is ready');

  try {
    const body = await request.json();
    console.log('🔍 Received data:', body);

    const { email, firstName, lastName, phone } = updateUserSchema.parse(body);
    console.log('✅ Parsed data:', { email, firstName, lastName, phone });

    // Формуємо повне ім'я
    const fullName = `${firstName} ${lastName}`.trim();

    if (email) {
      console.log('📧 Email provided, saving to users collection:', email);
      // Якщо є email - зберігаємо в колекції users
      const userRef = adminDb.collection('users').doc(email);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        console.log('👤 User exists, updating data');
        // Користувач існує - оновлюємо його дані
        await userRef.update({
          name: fullName,
          phone: phone,
          updatedAt: new Date(),
        });
        console.log('✅ User data updated successfully');

        return NextResponse.json(
          {
            message: 'Дані користувача оновлено успішно',
            user: {
              email,
              name: fullName,
              phone,
            },
          },
          { status: 200 }
        );
      } else {
        console.log('🆕 User does not exist, creating new user');
        // Користувач не існує - створюємо новий документ без пароля
        const newUserData = {
          email,
          name: fullName,
          phone,
          createdAt: new Date(),
          updatedAt: new Date(),
          isIncomplete: true, // позначаємо що це неповний профіль
        };
        console.log('📝 Creating user with data:', newUserData);

        await userRef.set(newUserData);
        console.log('✅ New user created successfully');

        return NextResponse.json(
          {
            message: 'Дані користувача збережено успішно',
            user: {
              email,
              name: fullName,
              phone,
            },
            isNewUser: true,
          },
          { status: 201 }
        );
      }
    } else {
      console.log('📝 No email provided, saving to anonymous_orders collection');
      // Якщо немає email - зберігаємо в колекції anonymous_orders з ім'ям як ID документа
      const anonymousOrderRef = adminDb.collection('anonymous_orders').doc(fullName);
      const anonymousOrderDoc = await anonymousOrderRef.get();

      if (anonymousOrderDoc.exists) {
        // Користувач з таким ім'ям вже існує - оновлюємо дані
        console.log('👤 Anonymous user exists, updating data');
        await anonymousOrderRef.update({
          phone,
          updatedAt: new Date(),
        });
        console.log('✅ Anonymous user data updated successfully');

        return NextResponse.json(
          {
            message: 'Дані оновлено успішно',
            user: {
              name: fullName,
              phone,
            },
            isAnonymous: true,
          },
          { status: 200 }
        );
      } else {
        // Створюємо новий запис з ім'ям як ID
        console.log('🆕 Creating new anonymous user');
        const anonymousOrderData = {
          name: fullName,
          phone,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        console.log('📝 Creating anonymous user with data:', anonymousOrderData);
        await anonymousOrderRef.set(anonymousOrderData);
        console.log('✅ Anonymous user created successfully');

        return NextResponse.json(
          {
            message: 'Дані збережено успішно',
            user: {
              name: fullName,
              phone,
            },
            isAnonymous: true,
            isNewUser: true,
          },
          { status: 201 }
        );
      }
    }
  } catch (error) {
    console.error('Update user error:', error);

    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => err.message).join(', ');
      console.error('Validation error:', error.errors);

      return NextResponse.json(
        {
          error: `Помилка валідації даних: ${errorMessages}`,
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Помилка сервера',
      },
      { status: 500 }
    );
  }
}
