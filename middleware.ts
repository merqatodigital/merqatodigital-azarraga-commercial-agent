import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

export function middleware(req:NextRequest){
  const {pathname} = req.nextUrl
  // Allow login page, auth endpoint, static assets, and Next.js internals
  if(pathname.startsWith('/login')) return NextResponse.next()
  if(pathname.startsWith('/api/auth')) return NextResponse.next()
  if(pathname.startsWith('/_next')) return NextResponse.next()
  if(pathname.startsWith('/favicon')) return NextResponse.next()
  if(pathname.includes('.')) return NextResponse.next()

  const session = req.cookies.get('azarraga_session')
  if(session && session.value === 'verified') return NextResponse.next()

  return NextResponse.redirect(new URL('/login', req.url))
}

export const config = {matcher:['/((?!api/auth/verify|login|_next|favicon.ico|.*\\..*).*)']}
