import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 获取客户端IP地址
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
    
    // 使用免费的IP地理位置API
    // 注意：在生产环境中，建议使用付费的API服务以获得更好的准确性和可靠性
    const response = await fetch(`https://ipapi.co/${ip}/json/`)
    
    if (!response.ok) {
      // 如果API失败，返回默认值
      return NextResponse.json({ country: 'TW', countryCode: 'TW' })
    }
    
    const data = await response.json()
    const countryCode = data.country_code || 'TW'
    
    return NextResponse.json({ 
      country: countryCode,
      countryCode: countryCode,
      ip: ip
    })
  } catch (error) {
    console.error('Geolocation error:', error)
    // 出错时返回默认值（台湾）
    return NextResponse.json({ country: 'TW', countryCode: 'TW' })
  }
}


