import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/** 旧日语首页路径永久迁移到 /jp */
const LEGACY_JA_PATH = /^\/ja\/?$/

/** 供根布局读取真实路径，使 /jp、/en 等与 LanguageProvider initialLocale 一致（避免仅依赖 cookie 与 URL 不符） */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (LEGACY_JA_PATH.test(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/jp'
    return NextResponse.redirect(url, 308)
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
}
