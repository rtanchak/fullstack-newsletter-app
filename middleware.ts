import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === '/author/login';
  const isAuthorApi = pathname.startsWith('/api/author');
  const isLoginApi = pathname === '/api/author/login';

  if (isLoginPage || isLoginApi) return NextResponse.next();

  const isAuthorUi = pathname.startsWith('/author/');
  if (!isAuthorUi && !isAuthorApi) return NextResponse.next();

  const isLoggedIn = req.cookies.get(env.COOKIE_NAME)?.value === '1';

  if (isLoggedIn) return NextResponse.next();

  if (isAuthorApi) {
    return NextResponse.json(
      { data: null, error: { message: 'Unauthorized' } },
      { status: 401 }
    );
  }

  const url = req.nextUrl.clone();
  url.pathname = '/author/login';
  url.searchParams.set('next', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/author/:path*', '/api/author/:path*'],
};
