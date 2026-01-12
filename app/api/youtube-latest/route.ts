import { NextResponse } from 'next/server'

// YouTube频道ID：UC217cs4dB9SRDAgpHzaD49w
const CHANNEL_ID = 'UC217cs4dB9SRDAgpHzaD49w'

// 如果没有API密钥，可以使用这个固定的最新视频ID作为fallback
// 请替换为实际的YouTube频道最新视频ID
const FALLBACK_VIDEO_ID = process.env.YOUTUBE_LATEST_VIDEO_ID || 'dQw4w9WgXcQ'

export async function GET() {
  try {
    // 尝试使用YouTube Data API获取最新视频
    // 注意：需要设置环境变量 YOUTUBE_API_KEY
    const apiKey = process.env.YOUTUBE_API_KEY
    
    console.log('YouTube API Key check:', apiKey ? 'Key exists (length: ' + apiKey.length + ')' : 'Key not found')
    
    if (!apiKey || apiKey === 'your_youtube_api_key_here') {
      // 如果没有API密钥，返回fallback视频ID
      console.warn('YOUTUBE_API_KEY not set or using placeholder, using fallback video ID')
      return NextResponse.json({ 
        videoId: FALLBACK_VIDEO_ID,
        source: 'fallback',
        message: 'API key not configured'
      })
    }

    // 直接使用频道ID获取最新视频（按日期排序）
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&order=date&type=video&maxResults=1&key=${apiKey}`
    console.log('Fetching from YouTube API:', apiUrl.replace(apiKey, 'API_KEY_HIDDEN'))
    
    const videosResponse = await fetch(apiUrl)
    
    if (!videosResponse.ok) {
      const errorData = await videosResponse.json().catch(() => ({}))
      console.error('YouTube API error:', videosResponse.status, errorData)
      throw new Error(`Failed to fetch videos: ${videosResponse.status} ${JSON.stringify(errorData)}`)
    }
    
    const videosData = await videosResponse.json()
    console.log('YouTube API response items count:', videosData.items?.length || 0)
    
    if (videosData.items && videosData.items.length > 0) {
      const videoId = videosData.items[0].id.videoId
      const videoTitle = videosData.items[0].snippet.title
      console.log('Latest video found:', videoId, videoTitle)
      return NextResponse.json({ 
        videoId,
        source: 'api',
        title: videoTitle
      })
    }
    
    // 如果没有找到视频，返回fallback
    console.warn('No videos found in channel')
    return NextResponse.json({ 
      videoId: FALLBACK_VIDEO_ID,
      source: 'fallback',
      message: 'No videos found in channel'
    })
  } catch (error) {
    console.error('Error fetching YouTube latest video:', error)
    // 出错时返回fallback
    return NextResponse.json({ 
      videoId: FALLBACK_VIDEO_ID,
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

