// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

// Database storage function (replace with your DB logic)
async function storeVisitorData(data: {
  ip: string
  country: string
  region: string
  city: string
  userAgent: string
  url: string
  timestamp: string
}) {
  try {
    // Example with fetch to your API endpoint
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/analytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ANALYTICS_SECRET}`
      },
      body: JSON.stringify(data)
    })
  } catch (error) {
    console.error('Failed to store visitor data:', error)
  }
}

export async function middleware(request: NextRequest) {
  // Get IP address
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  const ip = cfConnectingIp || 
            realIp || 
            forwardedFor?.split(',')[0]?.trim() || 
            'Unknown IP'

  // Get location from Vercel headers
  const country = request.headers.get('x-vercel-ip-country') || 'Unknown'
  const region = request.headers.get('x-vercel-ip-country-region') || 'Unknown'
  const city = request.headers.get('x-vercel-ip-city') || 'Unknown'
  const userAgent = request.headers.get('user-agent') || 'Unknown'

  const visitorData = {
    ip,
    country,
    region,
    city,
    userAgent,
    url: request.url,
    timestamp: new Date().toISOString()
  }

  // Log to console
  console.log('Visitor:', visitorData)

  // Store in database (non-blocking)
  if (process.env.NODE_ENV === 'production') {
    storeVisitorData(visitorData).catch(console.error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}