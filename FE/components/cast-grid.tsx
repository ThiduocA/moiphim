import Image from "next/image"
import { CastMember } from "@/types/movie"

interface CastGridProps {
  cast: CastMember[]
}

export function CastGrid({ cast }: CastGridProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white">Diễn viên</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {cast.map((member) => (
          <div key={member.id} className="group text-center">
            <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-gray-700">
              <Image
                src={member.avatar || "/placeholder.svg"}
                alt={member.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h4 className="font-semibold text-white text-sm mb-1 group-hover:text-orange-500 transition-colors">
              {member.name}
            </h4>
            <p className="text-xs text-gray-400">{member.character}</p>
          </div>
        ))}
      </div>
    </div>
  )
}