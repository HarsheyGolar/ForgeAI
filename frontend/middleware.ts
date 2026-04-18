import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get('forgeai_token')

    if (!authCookie?.value && request.nextUrl.pathname.startsWith('/chat')) {
        return NextResponse.redirect(new URL('/signin', request.url))
    }

    if (authCookie?.value && (request.nextUrl.pathname === '/signin' || request.nextUrl.pathname === '/signup')) {
        return NextResponse.redirect(new URL('/chat', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/chat/:path*', '/signin', '/signup']
}
