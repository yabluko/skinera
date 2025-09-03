import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { z } from 'zod';

const checkUserSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  // Skip Firebase operations during build time
  if (process.env.VERCEL_BUILD) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  if (!adminDb) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { email } = checkUserSchema.parse(body);

    // Check if user exists
    const userRef = adminDb.collection('users').doc(email);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      return NextResponse.json(
        {
          exists: true,
          user: {
            name: userData?.name,
            email: userData?.email,
          },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          exists: false,
          message: 'Користувач з таким email не знайдений',
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Check user error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Невірний формат email',
          details: error.errors,
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
