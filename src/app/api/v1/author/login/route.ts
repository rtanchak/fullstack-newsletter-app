import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { setAuthorCookie, clearAuthorCookie, verifyAuthorKey } from '@/lib/auth';

const LoginDto = z.object({ key: z.string().min(1) });

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = LoginDto.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ data: null, error: { message: 'Invalid body' } }, { status: 400 });
  }

  const { key } = parsed.data;
  if (!verifyAuthorKey(key)) {
    const res = NextResponse.json({ data: null, error: { message: 'Forbidden' } }, { status: 403 });
    clearAuthorCookie(res);
    return res;
  }

  const res = new NextResponse(null, { status: 204 });
  setAuthorCookie(res);
  return res;
}
