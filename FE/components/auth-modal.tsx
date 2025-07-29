"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Eye, EyeOff, Loader2, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { userService, type LoginRequest, type RegisterRequest } from "@/services/userService"
import Image from "next/image"
import { DialogTitle } from "@radix-ui/react-dialog"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "login" | "register"
  onAuthSuccess?: () => void // Callback khi đăng nhập/đăng ký thành công
}
interface UserData{
  userName?: string
  email?: string
}
// Component để hiển thị dropdown user
interface UserDropdownProps {
  user: UserData
  onLogout: () => void
  className?: string
}

export function UserDropdown({ user, onLogout, className = "" }: UserDropdownProps) {
  const getDisplayName = (user: UserData) => {
    return user?.userName || 'User'
  }

  // Function để lấy email từ user object
  const getEmail = (user: UserData) => {
    return user?.email || null
  }

  const displayName = getDisplayName(user)
  const email = getEmail(user)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`bg-gray-700 border-gray-600 text-white hover:bg-gray-600 ${className}`}
        >
          <User className="w-4 h-4 mr-2" />
          {user.userName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gray-800 border-gray-600" align="end">
        <DropdownMenuLabel className="text-gray-300">
          Tài khoản của tôi
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-600" />
        <DropdownMenuItem className="text-gray-300 focus:bg-gray-700 focus:text-white" disabled>
          <User className="w-4 h-4 mr-2" />
          {user.userName}
        </DropdownMenuItem>
        {user.email && (
          <DropdownMenuItem className="text-gray-400 focus:bg-gray-700" disabled>
            {user.email}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="bg-gray-600" />
        <DropdownMenuItem 
          className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Hook để quản lý trạng thái đăng nhập
export function useAuth() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi component mount
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)
      // Giả sử userService có method để lấy thông tin user hiện tại
      const currentUser = await userService.getCurrentUser()
      if (currentUser.success && currentUser.data) {
        setUser(currentUser.data)
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = (userData: { username: string; email?: string }) => {
    setUser(userData)
  }

  const logout = async () => {
    try {
      await userService.logout()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
      // Vẫn clear user state ngay cả khi có lỗi
      setUser(null)
    }
  }

  return {
    user,
    isLoading,
    login,
    logout,
    checkAuthStatus
  }
}

export function AuthModal({ isOpen, onClose, initialMode = "login", onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error khi user bắt đầu nhập lại
    if (error) setError("")
  }

  const validateForm = (): boolean => {
    if (mode === "login") {
      if (!formData.username.trim()) {
        setError("Vui lòng nhập tên đăng nhập")
        return false
      }
    } else {
      if (!formData.email.trim()) {
        setError("Vui lòng nhập email")
        return false
      }
    }

    if (!formData.password.trim()) {
      setError("Vui lòng nhập mật khẩu")
      return false
    }

    if (mode === "register") {
      if (!formData.username.trim()) {
        setError("Vui lòng nhập tên hiển thị")
        return false
      }

      if (formData.password.length < 6) {
        setError("Mật khẩu phải có ít nhất 6 ký tự")
        return false
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Mật khẩu không khớp")
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      if (mode === "login") {
        const loginData: LoginRequest = {
          userName: formData.username,
          password: formData.password
        }

        const response = await userService.login(loginData)
        
        if (response.success) {
          setSuccess("Đăng nhập thành công!")
          
          // Gọi callback nếu có để cập nhật trạng thái user
          if (onAuthSuccess) {
            onAuthSuccess()
          }
          
          // Đóng modal sau 1 giây
          setTimeout(() => {
            onClose()
            resetForm()
          }, 1000)
        } else {
          setError(response.message || "Đăng nhập thất bại")
        }
      } else {
        const registerData: RegisterRequest = {
          userName: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }

        const response = await userService.register(registerData)
        
        if (response.success) {
          if (response.data) {
            // Đăng ký và tự động đăng nhập thành công
            setSuccess("Đăng ký thành công!")
            
            if (onAuthSuccess) {
              onAuthSuccess()
            }
            
            setTimeout(() => {
              onClose()
              resetForm()
            }, 1000)
          } else {
            // Đăng ký thành công nhưng chưa đăng nhập
            setSuccess("Đăng ký thành công! Vui lòng đăng nhập.")
            setTimeout(() => {
              setMode("login")
              setSuccess("")
              setFormData(prev => ({ ...prev, username: "", confirmPassword: "" }))
            }, 2000)
          }
        } else {
          setError(response.message || "Đăng ký thất bại")
        }
      }
    } catch (error) {
      console.error("Auth error:", error)
      setError("Có lỗi xảy ra, vui lòng thử lại")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ username: "", email: "", password: "", confirmPassword: "" })
    setError("")
    setSuccess("")
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login")
    resetForm()
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl p-0 bg-transparent border-0 overflow-hidden">
        <DialogTitle>Open</DialogTitle>
        <div className="flex bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
          {/* Left Side - Movie Posters Background */}
          <div className="relative w-1/2 bg-gradient-to-br from-blue-900/80 to-purple-900/80">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="/placeholder.svg?height=600&width=400&text=Movie+Posters+Background"
                alt="Movie Background"
                fill
                className="object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-purple-900/60" />
            </div>

            {/* Logo and Branding */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[6px] border-l-orange-500 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">RoPhim</h2>
                  <p className="text-blue-200 text-sm">Phim hay có rồi</p>
                </div>
              </div>

              {/* Movie Posters Grid Simulation */}
              <div className="grid grid-cols-3 gap-2 opacity-60">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-16 h-20 bg-gray-700/50 rounded border border-gray-600/30"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-1/2 bg-gray-800 p-8 relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              disabled={isLoading}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Form Content */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {mode === "login" ? "Đăng nhập" : "Tạo tài khoản mới"}
                </h3>
                <p className="text-gray-400">
                  {mode === "login" ? (
                    <>
                      Nếu bạn chưa có tài khoản,{" "}
                      <button 
                        onClick={toggleMode} 
                        className="text-orange-500 hover:text-orange-400"
                        disabled={isLoading}
                      >
                        đăng ký ngay
                      </button>
                    </>
                  ) : (
                    <>
                      Nếu bạn đã có tài khoản,{" "}
                      <button 
                        onClick={toggleMode} 
                        className="text-orange-500 hover:text-orange-400"
                        disabled={isLoading}
                      >
                        đăng nhập
                      </button>
                    </>
                  )}
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <p className="text-green-400 text-sm">{success}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username/Email Field */}
                <div>
                  <Label htmlFor={mode === "login" ? "username" : "email"} className="text-gray-300 mb-2 block">
                    {mode === "login" ? "Tên đăng nhập" : "Email"}
                  </Label>
                  <Input
                    id={mode === "login" ? "username" : "email"}
                    type={mode === "login" ? "text" : "email"}
                    value={mode === "login" ? formData.username : formData.email}
                    onChange={(e) => handleInputChange(mode === "login" ? "username" : "email", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                    placeholder={mode === "login" ? "Nhập tên đăng nhập" : "Nhập email của bạn"}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Username (Register only) */}
                {mode === "register" && (
                  <div>
                    <Label htmlFor="username" className="text-gray-300 mb-2 block">
                      Tên hiển thị
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                      placeholder="Nhập tên hiển thị"
                      required
                      disabled={isLoading}
                    />
                  </div>
                )}

                {/* Password */}
                <div>
                  <Label htmlFor="password" className="text-gray-300 mb-2 block">
                    Mật khẩu
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 pr-10"
                      placeholder="Nhập mật khẩu"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (Register only) */}
                {mode === "register" && (
                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-300 mb-2 block">
                      Nhập lại mật khẩu
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 pr-10"
                        placeholder="Nhập lại mật khẩu"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{mode === "login" ? "Đang đăng nhập..." : "Đang đăng ký..."}</span>
                    </div>
                  ) : (
                    mode === "login" ? "Đăng nhập" : "Đăng ký"
                  )}
                </Button>

                {/* Forgot Password (Login only) */}
                {mode === "login" && (
                  <div className="text-center">
                    <button 
                      type="button" 
                      className="text-gray-400 hover:text-white text-sm disabled:opacity-50"
                      disabled={isLoading}
                      onClick={() => {
                        // TODO: Implement forgot password functionality
                        console.log("Forgot password clicked")
                      }}
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}