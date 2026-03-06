import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * 将当前请求路径写入 request header，供 layout 的 generateMetadata 生成每页的 canonical URL。
 */
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)
  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了静态资源和 API
     */
    '/((?!_next/static|_next/image|imgs|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
