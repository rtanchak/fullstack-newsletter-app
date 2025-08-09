import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === '/login';
  const isAuthorApi = pathname.startsWith('/api/author') || pathname.startsWith('/api/v1/author');
  const isLoginApi = pathname === '/api/author/login' || pathname === '/api/v1/author/login';

  if (isLoginPage || isLoginApi) return NextResponse.next();

  const isAuthorUi = pathname.startsWith('/author/');
  if (!isAuthorUi && !isAuthorApi) return NextResponse.next();

  // Debug cookie value through headers
  const cookieValue = req.cookies.get(env.COOKIE_NAME)?.value;
  const isLoggedIn = cookieValue === '1';
  
  // Create a response object that we can modify and return
  const response = NextResponse.next();
  
  // Add debug headers
  response.headers.set('X-Debug-Cookie-Name', env.COOKIE_NAME);
  response.headers.set('X-Debug-Cookie-Value', cookieValue || 'not-set');
  response.headers.set('X-Debug-Is-Logged-In', String(isLoggedIn));
  
  if (isLoggedIn) return response;

  if (isAuthorApi) {
    return NextResponse.json(
      { data: null, error: { message: 'Unauthorized' } },
      { status: 401 }
    );
  }

  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.searchParams.set('next', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/login', '/author/:path*', '/api/v1/author/:path*'],
};
