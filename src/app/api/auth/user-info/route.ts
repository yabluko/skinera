import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { z } from 'zod';

const userInfoSchema = z.object({
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
    const { email } = userInfoSchema.parse(body);

    // Get user from Firestore
    const userDocRef = adminDb.collection('users').doc(email);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return NextResponse.json(
        {
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    const user = userDoc.data();
    if (!user) {
      return NextResponse.json(
        {
          error: 'User data not found',
        },
        { status: 404 }
      );
    }

    // Return user info (without password)
    return NextResponse.json(
      {
        email: user.email,
        name: user.name,
        phone: user.phone || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user info error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid email format',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Server error',
      },
      { status: 500 }
    );
  }
}
