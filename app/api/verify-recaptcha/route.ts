import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json(
        { success: false, error: '缺少 reCAPTCHA token' },
        { status: 400 }
      )
    }

    // 验证 reCAPTCHA token
    const secretKey = process.env.RECAPTCHA_SECRET_KEY
    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY 环境变量未设置')
      return NextResponse.json(
        { success: false, error: '服务器配置错误' },
        { status: 500 }
      )
    }

    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify'
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    })

    const data = await response.json()

    if (data.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA 验证失败' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('reCAPTCHA 验证错误:', error)
    return NextResponse.json(
      { success: false, error: error.message || '验证过程出错' },
      { status: 500 }
    )
  }
}

















