"use client"
import { use, useEffect, useState, useRef } from "react"
import { Search, Bell, User, Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthModal, useAuth, UserDropdown } from "@/components/auth-modal"
import { movieService } from "@/services/movieService"
import Link from "next/link"
import { Category } from "@/types/movie"

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const { user, isLoading, checkAuthStatus, logout } = useAuth()
  
  // States cho dropdown thể loại
  const [categories, setCategories] = useState<Category[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleAuthClick = (mode: "login" | "register") => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  const handleAuthSuccess = async () => {
    await checkAuthStatus()
    setIsAuthModalOpen(false)
  }

  const handleLogout = async () => {
    await logout()
  }

  // Fetch categories
// Trong useEffect fetch categories
useEffect(() => {
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true)
      const response = await movieService.getCategories()
      if (response.success) {
        setCategories(response.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setCategoriesLoading(false)
    }
  }

  fetchCategories()
}, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleCategoryClick = (category: Category) => {
    console.log('Selected category:', category)
    // Thêm logic navigation ở đây, ví dụ:
    // router.push(`/category/${category.slug || category.id}`)
    setIsDropdownOpen(false)
  }

  // Tạo grid layout cho dropdown (4 cột như trong ảnh)
  const createCategoryGrid = () => {
    const columns = 4
    const rows = Math.ceil(categories.length / columns)
    const grid = []

    for (let row = 0; row < rows; row++) {
      const rowCategories = []
      for (let col = 0; col < columns; col++) {
        const index = row + col * rows
        if (index < categories.length) {
          rowCategories.push(categories[index])
        }
      }
      grid.push(rowCategories)
    }

    return grid
  }

  return (
    <>
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="text-xl font-bold text-white">RoPhim</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-orange-500 font-medium">Chủ Đề</a>
              
              {/* Dropdown Thể Loại */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  Thể Loại
                  <ChevronDown 
                    className={`ml-1 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                    {categoriesLoading ? (
                      <div className="p-4 text-center text-gray-400">
                        Đang tải...
                      </div>
                    ) : categories.length > 0 ? (
                      <div className="p-4 max-h-96 overflow-y-auto">
                        {createCategoryGrid().map((row, rowIndex) => (
                          <div key={rowIndex} className="grid grid-cols-4 gap-2 mb-2">
                            {row.map((category) => (
                              <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category)}
                                className="text-left text-sm text-gray-300 hover:text-orange-500 hover:bg-gray-700 px-2 py-1 rounded transition-colors"
                              >
                                {category.name}
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-400">
                        Không có thể loại nào
                      </div>
                    )}
                  </div>
                )}
              </div>

              <a href="#" className="text-gray-300 hover:text-white transition-colors">Phim Lẻ</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Phim Bộ</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Quốc Gia</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Diễn Viên</a>
            </nav>

            {/* Search and User Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm phim, diễn viên..."
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 w-64"
                />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Bell className="w-5 h-5" />
              </Button>

              {/* User Authentication Area */}
              {isLoading ? (
                <div className="w-24 h-9 bg-gray-700 animate-pulse rounded-md"></div>
              ) : user ? (
                <UserDropdown 
                  user={user} 
                  onLogout={handleLogout}
                  className="text-gray-300 hover:text-white"
                />
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-300 hover:text-white" 
                  onClick={() => handleAuthClick("login")}
                >
                  <User className="w-5 h-5" />
                  <span className="ml-2 hidden lg:inline">Thành viên</span>
                </Button>
              )}

              {/* Mobile Menu */}
              <Button variant="ghost" size="sm" className="md:hidden text-gray-300 hover:text-white">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm phim, diễn viên..."
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 w-full"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  )
}