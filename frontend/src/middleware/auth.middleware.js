import { NextResponse } from 'next/server'

export default function middleware(req) {
  const token =
    req.cookies.get('token')?.value ||
    req.headers.get('authorization')?.split(' ')[1]

  const isProtected = req.nextUrl.pathname.startsWith('/generate')

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/generate/:path*']
}
