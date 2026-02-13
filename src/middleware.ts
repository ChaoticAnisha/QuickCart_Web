import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl;

  // console.log('🔍 Middleware checking:', pathname);

  // // Get auth cookie
  // const authCookie = request.cookies.get('quickcart_auth');
  
  // let user = null;
  // let isAuthenticated = false;
  
  // if (authCookie) {
  //   try {
  //     const authData = JSON.parse(authCookie.value);
  //     if (authData.expiresAt > Date.now()) {
  //       user = authData.user;
  //       isAuthenticated = true;
  //       console.log('✅ User authenticated:', user.email, 'Role:', user.role);
  //     } else {
  //       console.log('⏰ Token expired');
  //     }
  //   } catch (error) {
  //     console.log('❌ Invalid cookie');
  //   }
  // } else {
  //   console.log('🔒 No auth cookie found');
  // }

  // const isAdmin = user?.role === 'admin';
  // const isClient = user?.role === 'USER';

  // // Public routes (accessible without login)
  // const publicRoutes = ['/', '/login', '/register'];
  // const isPublicRoute = publicRoutes.includes(pathname);

  // // Admin routes
  // const isAdminRoute = pathname.startsWith('/admin');

  // // Client routes  
  // const isClientRoute = pathname.startsWith('/dashboard') || 
  //                       pathname.startsWith('/products') || 
  //                       pathname.startsWith('/cart') || 
  //                       pathname.startsWith('/orders') || 
  //                       pathname.startsWith('/profile');

  // // REDIRECT LOGIC

  // // 1. Not authenticated trying to access protected routes
  // if (!isAuthenticated && !isPublicRoute) {
  //   console.log('🚫 Not authenticated, redirecting to /login');
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  // // 2. Already authenticated trying to access login/register
  // if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
  //   console.log('👤 Already logged in, redirecting based on role');
  //   if (isAdmin) {
  //     console.log('➡️ Redirecting admin to /admin/dashboard');
  //     return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  //   } else {
  //     console.log('➡️ Redirecting client to /dashboard');
  //     return NextResponse.redirect(new URL('/dashboard', request.url));
  //   }
  // }

  // // 3. Client trying to access admin routes
  // if (isAuthenticated && isAdminRoute && !isAdmin) {
  //   console.log('🚫 Client trying to access admin route, redirecting to /dashboard');
  //   return NextResponse.redirect(new URL('/dashboard', request.url));
  // }

  // // 4. Admin trying to access client routes (redirect to admin dashboard)
  // if (isAuthenticated && isAdmin && isClientRoute) {
  //   console.log('🚫 Admin trying to access client route, redirecting to /admin/dashboard');
  //   return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  // }

  // console.log('✅ Access granted to:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};