// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Get IP address with better fallback logic
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  const ip = cfConnectingIp || 
            realIp || 
            forwardedFor?.split(',')[0]?.trim() || 
            'Unknown IP'

  // Get location data from Vercel headers
  const country = request.headers.get('x-vercel-ip-country') || 'Unknown'
  const region = request.headers.get('x-vercel-ip-country-region') || 'Unknown'
  const city = request.headers.get('x-vercel-ip-city') || 'Unknown'
  const timezone = request.headers.get('x-vercel-ip-timezone') || 'Unknown'

  // Create visitor info object
  const visitorInfo = {
    ip,
    country,
    region,
    city,
    timezone,
    userAgent: request.headers.get('user-agent'),
    url: request.url,
    method: request.method,
    timestamp: new Date().toISOString(),
    // Debug: Show all headers to see what's available
    allHeaders: Object.fromEntries(request.headers.entries())
  }

  // Multiple logging approaches for Vercel
  console.log('=== VISITOR INFO ===')
  console.log(JSON.stringify(visitorInfo, null, 2))
  
  // Also log to stderr (sometimes more visible in Vercel)
  console.error('VISITOR_LOG:', JSON.stringify(visitorInfo))

  // Create response and add custom headers for debugging
  const response = NextResponse.next()
  
  // Add debug headers (you can check these in browser dev tools)
  response.headers.set('x-debug-ip', ip)
  response.headers.set('x-debug-country', country)
  response.headers.set('x-debug-city', city)
  response.headers.set('x-debug-middleware', 'executed')

  return response
}

// More specific matcher to avoid unnecessary executions
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}