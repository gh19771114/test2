/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        // 移动设备（手机竖版）
        'mobile': {'max': '767px'},
        // 平板设备（iPad竖版、手机横版）
        'tablet': {'min': '768px', 'max': '1023px'},
        // 平板横版/小桌面（iPad横版、iPad Pro竖版）
        'tablet-lg': {'min': '1024px', 'max': '1279px'},
        // 桌面版
        'desktop': {'min': '1280px'},
        // iPad竖版（包含iPad Pro 11"）
        'ipad-portrait': {'min': '768px', 'max': '1023px', 'raw': '(orientation: portrait)'},
        // iPad横版
        'ipad-landscape': {'min': '768px', 'max': '1023px', 'raw': '(orientation: landscape)'},
        // iPad Pro竖版（1024px-1279px竖屏）
        'ipad-pro-portrait': {'min': '1024px', 'max': '1279px', 'raw': '(orientation: portrait)'},
        // iPad Pro横版/小桌面
        'ipad-pro-landscape': {'min': '1024px', 'max': '1279px', 'raw': '(orientation: landscape)'},
      },
      fontFamily: {
        'noto': ['Noto Sans JP', 'Yu Gothic', '游ゴシック', 'Meiryo', 'メイリオ', 'MS PGothic', 'MS Pゴシック', 'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ ProN W3', 'sans-serif'],
        'inter': ['Inter', 'Yu Gothic', '游ゴシック', 'Meiryo', 'メイリオ', 'sans-serif'],
        'sans': ['var(--font-noto-sans-sc)', 'Noto Sans SC', 'Noto Sans JP', 'Yu Gothic', '游ゴシック', 'Meiryo', 'メイリオ', 'MS PGothic', 'MS Pゴシック', 'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ ProN W3', 'var(--font-inter)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        'navy': {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
        },
        'blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

