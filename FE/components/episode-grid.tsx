import { Play, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

interface Episode {
  id: number;
  movieId: string;
  episodeName: string;
  slug: string;
  filename: string;
  linkEmbed: string;
  linkM3u8: string;
}

interface EpisodeGridProps {
  episodes: Episode[]
}

export function EpisodeGrid({ episodes }: EpisodeGridProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Danh sách tập phim</h3>
        <Badge className="bg-blue-500 text-white">{episodes.length} tập</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {episodes.map((episode) => (
          <div
            key={episode.id}
            className="group bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-all duration-300 cursor-pointer"
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
                // src={episode.thumbnail || "/placeholder.svg"}
                src={"https://www.britannica.com/topic/Get-Out"}
                alt={episode.episodeName}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Episode Number Badge */}
              <div className="absolute top-2 left-2">
                <Badge className="bg-orange-500 text-white border-0">Tập {episode.id}</Badge>
              </div>

              {/* Duration Badge */}
              {/* <div className="absolute bottom-2 right-2">
                <Badge className="bg-black/70 text-white border-0 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {episode.duration}
                </Badge>
              </div> */}

              {/* Play Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Link href={`/watch/1?episode=${episode.id}`}>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Xem ngay
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-4">
              <h4 className="font-semibold text-white mb-2 group-hover:text-orange-500 transition-colors">
                {episode.episodeName}
              </h4>
              {/* <p className="text-sm text-gray-400 line-clamp-2 mb-2">{episode.description}</p>
              <p className="text-xs text-gray-500">Phát sóng: {episode.airDate}</p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
