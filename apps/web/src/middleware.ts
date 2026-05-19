import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const ACCESS_TOKEN_KEY = 'fruitlink_access_token';
const USER_ROLE_KEY = 'fruitlink_user_role';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value;
  const role = request.cookies.get(USER_ROLE_KEY)?.value;
  const { pathname } = request.nextUrl;

  const protectedPaths = ['/dashboard', '/ho-so', '/admin'];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/dang-nhap', request.url));
  }

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/ho-so/:path*', '/admin/:path*'],
};
