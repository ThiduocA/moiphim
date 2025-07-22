"use client"

import { useState } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { HLSVideoPlayer } from "./hls-player"

interface Movie {
  id: number;
  movieId: string;
  episodeName: string;
  serverName: string;
  slug: string;
  filename: string;
  linkEmbed: string;
  linkM3u8: string;
}

interface VideoPlayerSectionProps {
  movie: Movie
}

export function VideoPlayerSection({ movie }: VideoPlayerSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(100)
  const [volume, setVolume] = useState(80)
  const [showControls, setShowControls] = useState(true)
  const [useEmbedPlayer, setUseEmbedPlayer] = useState(true)

  const togglePlay = () => setIsPlaying(!isPlaying)
  const toggleMute = () => setIsMuted(!isMuted)

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Debug log
  console.log('Video Player Props:', movie)

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">{movie.episodeName}</h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={useEmbedPlayer ? "default" : "outline"}
              onClick={() => setUseEmbedPlayer(true)}
              className="text-white"
              disabled={!movie.linkEmbed}
            >
              Embed Player {!movie.linkEmbed && "Không có"}
            </Button>
            <Button
              size="sm"
              variant={!useEmbedPlayer ? "default" : "outline"}
              onClick={() => setUseEmbedPlayer(false)}
              className="text-white"
              disabled={!movie.linkM3u8}
            >
            
              HLS Player {!movie.linkM3u8 && "Không có"}
            </Button>
          </div>
        </div>
        
        {/* Debug Info */}
        <div className="text-gray-400 text-sm">
          <p>Episode: {movie.episodeName} - {movie.serverName}</p>
          <p>Link Embed: {movie.linkEmbed || "Không có"}</p>
          <p>Link M3U8: {movie.linkM3u8 || "Không có"}</p>
        </div>
      </div>

      {/* Video Player */}
      <div
        className="relative aspect-video bg-gray-900 group cursor-pointer"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Embedded Video Player */}
        {useEmbedPlayer && movie.linkEmbed ? (
          <iframe
            src={movie.linkEmbed}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; encrypted-media; fullscreen"
            referrerPolicy="no-referrer"
            sandbox="allow-same-origin allow-scripts allow-presentation"
            title={movie.episodeName}
          />
          
        ) : !useEmbedPlayer && movie.linkM3u8 ? (
          // M3U8 Player (có thể cần thư viện hls.js)
          <HLSVideoPlayer
            src={movie.linkM3u8}
            title={movie.episodeName}
          />
        ) : (
          // Fallback khi không có video
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold mb-4">{movie.episodeName}</h3>
              <p className="text-gray-400 mb-4">
                {!movie.linkEmbed && !movie.linkM3u8 
                  ? "Không có link video khả dụng" 
                  : "Đang tải video..."}
              </p>
              <div className="text-sm text-gray-500">
                <p>Embed: {movie.linkEmbed ? "Có" : "Không"}</p>
                <p>M3U8: {movie.linkM3u8 ? "Có" : "Không"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Video Controls Overlay - chỉ hiện khi không có embed player */}
        {(!movie.linkEmbed || !useEmbedPlayer) && (
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
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
                  onValueChange={(value) => setCurrentTime(value[0])}
                  max={duration}
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

                  <Button variant="ghost" size="sm" className="text-white hover:text-orange-500">
                    <SkipBack className="w-5 h-5" />
                  </Button>

                  <Button variant="ghost" size="sm" className="text-white hover:text-orange-500">
                    <SkipForward className="w-5 h-5" />
                  </Button>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={toggleMute} className="text-white hover:text-orange-500">
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                    <div className="w-24">
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        onValueChange={(value) => setVolume(value[0])}
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
                  <Button variant="ghost" size="sm" className="text-white hover:text-orange-500">
                    <Maximize className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Episode Navigation */}
      <div className="bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-white">{movie.episodeName}</h4>
            <p className="text-sm text-gray-400">Episode {movie.id}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-gray-600 text-gray-300 bg-transparent"
              onClick={() => window.history.back()}
            >
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}