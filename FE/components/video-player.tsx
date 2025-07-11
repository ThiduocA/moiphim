"use client"

import { useState, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface Movie {
  id: number
  title: string
  videoUrl: string
  episodes?: string
}

interface VideoPlayerProps {
  movie: Movie
}

export function VideoPlayer({ movie }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(100)
  const [volume, setVolume] = useState(80)
  const [showControls, setShowControls] = useState(true)

  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="relative bg-black rounded-lg overflow-hidden group">
      {/* Video Container */}
      <div className="relative aspect-video bg-gray-800">
        {/* Placeholder Video Area */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="text-center">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold mb-2">{movie.title}</h3>
            <p className="text-gray-400 mb-4">Tập hiện tại: {movie.episodes || "1/1"}</p>

            {/* Korean Subtitle Simulation */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/70 px-4 py-2 rounded">
              <p className="text-white text-center">오늘 정말 좋은 날씨네요. 같이 산책하러 갈까요?</p>
              <p className="text-yellow-300 text-sm text-center mt-1">
                (Không liên quan đến sự việc
                <br />
                hay có nhận có thật nào.)
              </p>
            </div>
          </div>
        </div>

        {/* Video Controls Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="lg"
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-orange-500/80 hover:bg-orange-500 text-white"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <Slider
                value={[currentTime]}
                onValueChange={(value) => setCurrentTime(value[0])}
                max={duration}
                step={1}
                className="w-full"
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={togglePlay} className="text-white hover:text-orange-500">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
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
                  <div className="w-20">
                    <Slider value={[volume]} onValueChange={(value) => setVolume(value[0])} max={100} step={1} />
                  </div>
                </div>

                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
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
      </div>

      {/* Episode Navigation */}
      <div className="bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-white">Tập 1: Khởi đầu mới</h4>
            <p className="text-sm text-gray-400">Thời lượng: 60 phút</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent">
              Tập trước
            </Button>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent">
              Tập tiếp
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
