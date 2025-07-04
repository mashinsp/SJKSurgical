// app/api/visitor-log/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  const ip = cfConnectingIp || 
            realIp || 
            forwardedFor?.split(',')[0]?.trim() || 
            'Unknown IP'

  try {
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`,
      {
        headers: { 'User-Agent': 'NextJS-GeoLocation/1.0' }
      }
    )
    
    if (!response.ok) return null
    const data = await response.json()
    
    if (data.status === 'fail') {
      console.error('IP-API Error:', data.message)
      return null
    }
    
    const visitorInfo =  {
      ip: data.query,
      country: data.country,
      region: data.regionName,
      city: data.city,
      latitude: data.lat,
      longitude: data.lon,
      timezone: data.timezone,
      isp: data.isp,
      org: data.org,
      postal: data.zip,
      provider: 'ip-api.com'
    }
      console.log('🔍 VISITOR API LOG:', JSON.stringify(visitorInfo, null, 2))
  } catch (error) {
    console.error('IP-API request failed:', error)
    return null
  }
}