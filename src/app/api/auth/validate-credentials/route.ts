import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { compare } from 'bcryptjs';
import { z } from 'zod';

const validateCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
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
    const { email, password } = validateCredentialsSchema.parse(body);

    // Get user from Firestore
    const userDocRef = adminDb.collection('users').doc(email);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return NextResponse.json(
        {
          valid: false,
          message: 'Користувач з таким email не знайдений',
        },
        { status: 404 }
      );
    }

    const user = userDoc.data();
    if (!user) {
      return NextResponse.json(
        {
          valid: false,
          message: 'Дані користувача не знайдені',
        },
        { status: 404 }
      );
    }

    // Verify password
    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          valid: false,
          message: 'Невірний пароль',
        },
        { status: 401 }
      );
    }

    // Credentials are valid
    return NextResponse.json(
      {
        valid: true,
        user: {
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Validate credentials error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Невірний формат даних',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        valid: false,
        error: 'Помилка сервера',
      },
      { status: 500 }
    );
  }
}
