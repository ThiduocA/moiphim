"use client"

import { useState } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface Movie {
  id: number;
  movieId: string;
  episodeName: string;
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

  const togglePlay = () => setIsPlaying(!isPlaying)
  const toggleMute = () => setIsMuted(!isMuted)

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      {/* Video Player */}
      <div
        className="relative aspect-video bg-gray-900 group cursor-pointer"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onClick={togglePlay}
      >
        {/* Video Content Area */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-2xl font-bold mb-4">{movie.episodeName}</h3>
          </div>
        </div>

        {/* Video Controls Overlay */}
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
      </div>
    </div>
  )
}
