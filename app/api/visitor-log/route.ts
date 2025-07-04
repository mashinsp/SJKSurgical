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

  const country = request.headers.get('x-vercel-ip-country') || 'Unknown'
  const region = request.headers.get('x-vercel-ip-country-region') || 'Unknown'
  const city = request.headers.get('x-vercel-ip-city') || 'Unknown'

  const visitorInfo = {
    ip,
    country,
    region,
    city,
    userAgent: request.headers.get('user-agent'),
    timestamp: new Date().toISOString()
  }

  console.log('🔍 VISITOR API LOG:', JSON.stringify(visitorInfo, null, 2))

  return NextResponse.json({ 
    success: true, 
    visitor: visitorInfo 
  })
}