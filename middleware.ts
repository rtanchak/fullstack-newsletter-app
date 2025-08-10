import { NextRequest, NextResponse } from 'next/server';

// TODO add once we have author scope
// ADD middleware.ts just to pass
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  const response = NextResponse.next();
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  if (pathname === '/posts/new') {
    console.log('Accessing post creation page');
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
