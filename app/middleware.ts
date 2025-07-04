// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const ip = forwardedFor?.split(',')[0]?.trim() || 'Unknown IP'

  // Log the IP address (replace this with DB logic if needed)
  console.log(`Visitor IP: ${ip}`)

  return NextResponse.next()
}

// Apply to all routes
export const config = {
  matcher: '/:path*',
}
