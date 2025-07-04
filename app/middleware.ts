// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

interface LocationData {
  country?: string
  region?: string
  city?: string
  timezone?: string
  lat?: number
  lon?: number
  isp?: string
}

async function getLocationFromIP(ip: string): Promise<LocationData | null> {
  try {
    // Using ip-api.com (free tier: 45 requests/minute)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,regionName,city,timezone,lat,lon,isp`, {
      headers: {
        'User-Agent': 'NextJS-Middleware'
      }
    })
    
    if (!response.ok) return null
    
    const data = await response.json()
    
    return {
      country: data.country,
      region: data.regionName,
      city: data.city,
      timezone: data.timezone,
      lat: data.lat,
      lon: data.lon,
      isp: data.isp
    }
  } catch (error) {
    console.error('Error fetching location:', error)
    return null
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

  // Skip location lookup for localhost/development
  if (ip === 'Unknown IP' || ip === '127.0.0.1' || ip === '::1') {
    console.log('Local development - skipping location lookup')
    return NextResponse.next()
  }

  // Get location data
  const locationData = await getLocationFromIP(ip)
  
  // Log comprehensive visitor information
  console.log(`Visitor Info:`, {
    ip,
    location: locationData,
    userAgent: request.headers.get('user-agent'),
    url: request.url,
    method: request.method,
    timestamp: new Date().toISOString(),
    referer: request.headers.get('referer') || 'Direct'
  })

  // Optional: Store in database here
  // await storeVisitorData({ ip, location: locationData, ... })

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}