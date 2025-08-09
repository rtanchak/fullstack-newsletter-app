import { NextResponse } from 'next/server';
import { clearAuthorCookie } from '@/lib/auth';

export async function POST() {
  const res = new NextResponse(null, { status: 204 });
  clearAuthorCookie(res);
  return res;
}
