import { Play } from "lucide-react"
import Image from "next/image"

export function PromoBanner() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative bg-gradient-to-r from-orange-600 to-yellow-500 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
              <Image src="/placeholder.svg?height=64&width=64" alt="Promo" width={64} height={64} className="rounded" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">2 HẾT TIỀN RỒI !!!</h3>
              <p className="text-white/90">BỚI GIÚP 2 CHÉN NÀY...</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-white text-right">
              <p className="text-sm opacity-90">Chưa hết thời gian cảo phí</p>
              <p className="font-bold">Xem ngay</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Play className="w-6 h-6 text-white fill-current" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
