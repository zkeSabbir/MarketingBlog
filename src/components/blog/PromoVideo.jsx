import React, { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

const FALLBACK_VIDEO = 'https://www.youtube.com/embed/BNJ__q5XYe8'
const CHANNEL_URL = 'https://www.youtube.com/@AVADeepMeditation'

export default function PromoVideo({ className = '' }) {
  const videoRef = useRef(null)
  const wrapRef = useRef(null)
  const [videoUrl, setVideoUrl] = useState(null)
  const [tapToPlay, setTapToPlay] = useState(false)

  // Load from site_settings
  useEffect(() => {
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'promo_video_url')
      .single()
      .then(({ data }) => {
        setVideoUrl(data?.value || FALLBACK_VIDEO)
      })
  }, [])

  // IntersectionObserver for autoplay
  useEffect(() => {
    const video = videoRef.current
    if (!video || !wrapRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => setTapToPlay(true))
        } else {
          video.pause()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(wrapRef.current)
    return () => observer.disconnect()
  }, [videoUrl])

  const isYoutube = videoUrl && (videoUrl.includes('youtube') || videoUrl.includes('youtu.be'))

  return (
    <div className={`my-10 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          🎬 Watch on AVA Deep Meditation
        </h3>
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
        >
          Subscribe →
        </a>
      </div>

      <div ref={wrapRef} className="promo-video-wrap">
        {isYoutube ? (
          <iframe
            src={`${videoUrl}?autoplay=1&mute=1&rel=0`}
            title="AVA Deep Meditation"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : videoUrl ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
              poster="/video-poster.jpg"
              style={{ width: '100%', height: '100%' }}
            >
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl?.replace('.mp4', '.webm')} type="video/webm" />
              Your browser does not support the video tag.
            </video>
            {tapToPlay && (
              <div
                className="tap-to-play"
                onClick={() => {
                  videoRef.current?.play()
                  setTapToPlay(false)
                }}
              >
                <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center shadow-2xl">
                  <span className="text-3xl">▶️</span>
                </div>
                <span className="text-white font-semibold text-sm">Tap to Play</span>
              </div>
            )}
          </>
        ) : (
          // Skeleton while loading
          <div className="w-full h-full skeleton" />
        )}
      </div>

      <p className="text-center text-xs text-gray-400 mt-2">
        Subscribe to{' '}
        <a href={CHANNEL_URL} target="_blank" rel="noreferrer" className="text-brand-500 hover:underline">
          AVA Deep Meditation on YouTube
        </a>{' '}
        for daily sleep sounds, guided meditations & focus music.
      </p>
    </div>
  )
}
