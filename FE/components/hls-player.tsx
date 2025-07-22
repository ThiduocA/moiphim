"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface HLSVideoPlayerProps {
  src: string
  title: string
}

export function HLSVideoPlayer({ src, title }: HLSVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(80)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    const loadVideo = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Kiểm tra xem trình duyệt có hỗ trợ HLS không
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Safari hỗ trợ HLS native
          video.src = src
        } else {
          // Các trình duyệt khác cần HLS.js
          try {
            // Dynamic import HLS.js
            const Hls = (await import('hls.js')).default
            
            if (Hls.isSupported()) {
              const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
              })
              
              hls.loadSource(src)
              hls.attachMedia(video)
              
              hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setIsLoading(false)
              })
              
              hls.on(Hls.Events.ERROR, (event, data) => {
                console.error('HLS Error:', data)
                if (data.fatal) {
                  setError('Không thể tải video')
                  setIsLoading(false)
                }
              })
              
              return () => {
                hls.destroy()
              }
            } else {
              setError('Trình duyệt không hỗ trợ phát video này')
              setIsLoading(false)
            }
          } catch (hlsError) {
            console.error('Failed to load HLS.js:', hlsError)
            // Fallback: thử load trực tiếp
            video.src = src
            setIsLoading(false)
          }
        }
      } catch (err) {
        setError('Lỗi khi tải video')
        setIsLoading(false)
      }
    }

    loadVideo()
  }, [src])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    const handleLoadedData = () => setIsLoading(false)
    const handleError = () => {
      setError('Không thể phát video')
      setIsLoading(false)
    }

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('error', handleError)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0]
    video.volume = newVolume / 100
    setVolume(newVolume)
    
    if (newVolume === 0) {
      setIsMuted(true)
      video.muted = true
    } else {
      setIsMuted(false)
      video.muted = false
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const handleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (video.requestFullscreen) {
      video.requestFullscreen()
    }
  }

  if (error) {
    return (
      <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h3 className="text-white text-lg mb-2">Lỗi phát video</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button
            onClick={() => window.open(src, '_blank')}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Mở link gốc
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="relative aspect-video bg-black group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        playsInline
        onClick={togglePlay}
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
            <p>Đang tải video...</p>
          </div>
        </div>
      )}

      {/* Video Controls */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="lg"
            onClick={togglePlay}
            className="w-20 h-20 rounded-full bg-orange-500/90 hover:bg-orange-500 text-white"
          >
            {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Progress Bar */}
          <div className="mb-4">
            <Slider
              value={[currentTime]}
              onValueChange={handleSeek}
              max={duration || 100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-300 mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={togglePlay} className="text-white hover:text-orange-500">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={toggleMute} className="text-white hover:text-orange-500">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <div className="w-24">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-white hover:text-orange-500">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleFullscreen} className="text-white hover:text-orange-500">
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}