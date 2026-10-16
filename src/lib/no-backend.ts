import { NextResponse } from 'next/server';

// Backend (DB) removed; routes return 501 until a new one is wired up
export function notImplemented() {
  return NextResponse.json({ error: 'Сервіс тимчасово недоступний' }, { status: 501 });
}
