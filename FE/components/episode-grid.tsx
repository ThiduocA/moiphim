"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface Episode {
  id: number;
  movieId: string;
  serverName: string;
  episodeName: string;
  slug: string;
  filename: string;
  linkEmbed: string;
  linkM3u8: string;
}

interface EpisodeListProps {
  episodes: Episode[]
  movieId: string
}

export function EpisodeList({ episodes, movieId }: EpisodeListProps) {
  const searchParams = useSearchParams()
  const currentEpisodeParam = searchParams.get('episode') || '1'
  const currentServerParam = searchParams.get('server') || 'vietsub'
  
  const [selectedServer, setSelectedServer] = useState(currentServerParam)

  // Lấy danh sách server có sẵn
  const availableServers = [...new Set(episodes.map(ep => ep.serverName))]
  
  // Filter episodes theo server được chọn
  const filteredEpisodes = episodes.filter(ep => 
    selectedServer === 'vietsub' 
      ? ep.serverName.includes('Vietsub')
      : ep.serverName.includes('Lồng Tiếng')
  )

  // Group episodes theo số tập
  const groupedEpisodes = filteredEpisodes.reduce((acc, episode) => {
    const epNum = parseInt(episode.episodeName.replace('Tập ', ''))
    if (!acc[epNum]) {
      acc[epNum] = episode
    }
    return acc
  }, {} as Record<number, Episode>)

  const sortedEpisodes = Object.entries(groupedEpisodes)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([_, episode]) => episode)

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Danh sách tập phim</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={selectedServer === 'vietsub' ? "default" : "outline"}
            onClick={() => setSelectedServer('vietsub')}
            className="text-white"
          >
            Vietsub
          </Button>
          <Button
            size="sm"
            variant={selectedServer === 'longtiem' ? "default" : "outline"}
            onClick={() => setSelectedServer('longtiem')}
            className="text-white"
          >
            Lồng Tiếng
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
        {sortedEpisodes.map((episode) => {
          const episodeNum = parseInt(episode.episodeName.replace('Tập ', ''))
          const isActive = parseInt(currentEpisodeParam) === episodeNum
          
          return (
            <Link
              key={episode.id}
              href={`/watch/${movieId}?episode=${episodeNum}&server=${selectedServer}`}
              className={`
                group relative aspect-square rounded-lg overflow-hidden transition-all duration-300
                ${isActive 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }
              `}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-semibold text-sm">{episodeNum}</span>
              </div>
              
              {/* Play overlay on hover */}
              {!isActive && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-current" />
                </div>
              )}
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </Link>
          )
        })}
      </div>

      <div className="mt-4 text-sm text-gray-400">
        <p>Server hiện tại: {selectedServer === 'vietsub' ? 'Vietsub' : 'Lồng Tiếng'}</p>
        <p>Tổng số tập: {sortedEpisodes.length}</p>
      </div>
    </div>
  )
}