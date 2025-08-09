import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

const COOKIE_MAX_AGE = 60 * 60 * 8;

export function setAuthorCookie(res: NextResponse) {
  res.cookies.set({
    name: env.COOKIE_NAME,
    value: '1',
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
}

export function clearAuthorCookie(res: NextResponse) {
  res.cookies.set({
    name: env.COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 0,
  });
}

export function isAuthor(req?: NextRequest) {
  try {
    const jar = req?.cookies ?? cookies();
    const val = 'get' in jar ? jar.get(env.COOKIE_NAME)?.value : undefined;
    return val === '1';
  } catch {
    return false;
  }
}

export function verifyAuthorKey(key?: string | null) {
  return Boolean(key) && key === env.AUTHOR_KEY;
}
