import { Play, Heart, Share2, Download, Bookmark, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types/movie";

interface MovieHeroSectionProps {
  movie: Movie;
}

export function MovieHeroSection({ movie }: MovieHeroSectionProps) {
  // const genreArray = ensureGenreArray(movie.category);

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden">
      {/* Background Image */}
      <div className="relative h-96 md:h-[500px]">
        <Image
          src={movie.backdrop || movie.poster_url || "/placeholder.svg"}
          alt={movie.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0 md:space-x-8">
              {/* Movie Poster */}
              <div className="flex-shrink-0">
                <div className="relative w-48 h-72 rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={movie.poster_url || "/placeholder.svg"}
                    alt={movie.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Movie Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {movie.name}
                  </h1>
                  {movie.name && (
                    <p className="text-xl text-gray-300">{movie.name}</p>
                  )}
                </div>

                {/* Rating and Badges */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-yellow-400 font-bold text-lg">
                      {movie.rating}
                    </span>
                    <span className="text-gray-400">/10</span>
                  </div>
                  <Badge className="bg-orange-500 text-white">HD</Badge>
                  <Badge className="bg-green-500 text-white">Vietsub</Badge>
                  <Badge className="bg-blue-500 text-white">Thuyết Minh</Badge>
                  <Badge className="bg-purple-500 text-white">
                    {movie.status}
                  </Badge>
                </div>

                {/* Genre Tags */}
                <div className="flex flex-wrap gap-2">
                  {movie.category.map((g) => (
                    <Badge
                      key={g.id}
                      variant="outline"
                      className="border-gray-500 text-gray-300"
                    >
                      {g.name}
                    </Badge>
                  ))}
                </div>

                {/* Movie Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Năm:</span>
                    <span className="text-white ml-2">{movie.year}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Quốc gia:</span>
                    <span className="text-white ml-2">{movie.country}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Thời lượng:</span>
                    <span className="text-white ml-2">{movie.duration}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Số tập:</span>
                    <span className="text-white ml-2">
                      {movie.episodesCount}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Link href={`/watch/${movie._id}`}>
                    <Button
                      size="lg"
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                    >
                      <Play className="w-5 h-5 mr-2 fill-current" />
                      Xem Ngay
                    </Button>
                  </Link>

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-500 text-gray-300 hover:bg-gray-700 bg-transparent"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Yêu thích
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-500 text-gray-300 hover:bg-gray-700 bg-transparent"
                  >
                    <Bookmark className="w-5 h-5 mr-2" />
                    Lưu lại
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-500 text-gray-300 hover:bg-gray-700 bg-transparent"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Chia sẻ
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-500 text-gray-300 hover:bg-gray-700 bg-transparent"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Tải về
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
