import { Search, Bell, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold text-white">RoPhim</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-orange-500 font-medium">
              Chủ Đề
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Thể Loại
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Phim Lẻ
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Phim Bộ
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Xem Chung
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Quốc Gia
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Diễn Viên
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Lịch Chiếu
            </a>
          </nav>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm phim, diễn viên..."
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 w-64"
              />
            </div>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <User className="w-5 h-5" />
              <span className="ml-2 hidden lg:inline">Thành viên</span>
            </Button>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
