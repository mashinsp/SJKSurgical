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

  // Skip for localhost
  if (ip === 'Unknown IP' || ip === '127.0.0.1' || ip === '::1') {
    return NextResponse.json({ 
      success: false, 
      message: 'Localhost detected, skipping geolocation' 
    })
  }

  try {
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`,
      {
        headers: { 'User-Agent': 'NextJS-GeoLocation/1.0' }
      }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.status === 'fail') {
      console.error('IP-API Error:', data.message)
      return NextResponse.json({ 
        success: false, 
        error: data.message 
      }, { status: 400 })
    }
    
    const visitorInfo = {
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
      provider: 'ip-api.com',
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString(),
      // Additional useful data
      coordinates: `${data.lat}, ${data.lon}`,
      googleMapsUrl: `https://maps.google.com/maps?q=${data.lat},${data.lon}`
    }
    
    console.log('🔍 VISITOR API LOG:', JSON.stringify(visitorInfo, null, 2))
    
    // Return the visitor info as JSON response
    return NextResponse.json({ 
      success: true, 
      visitor: visitorInfo,
      message: 'Visitor logged successfully' 
    })
    
  } catch (error) {
    console.error('IP-API request failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch geolocation data' 
    }, { status: 500 })
  }
}