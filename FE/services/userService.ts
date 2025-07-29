// FE/services/userService.ts
import { api } from '@/lib/api';

// Types for API requests and responses
export interface LoginRequest {
  userName: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  userId: string;
  email: string;
  userName: string;
  createdAt?: string;
  updatedAt?: string;
}

// Backend response format
export interface BackendResponse<T> {
  value: T;
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    description: string;
  };
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
    refreshToken?: string;
  };
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export const userService = {
  // Đăng nhập
  async login(loginData: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('[userService.login] Attempting login for:', loginData.userName);
      
      const response = await api.post<BackendResponse<string>>('/Auth/login', {
        userName: loginData.userName,
        password: loginData.password
      });

      console.log('[userService.login] Login response:', response);

      if (response.isSuccess && response.value) {
        const token = response.value;
        
        // Lưu token vào localStorage
        localStorage.setItem('accessToken', token);
        
        // Decode JWT để lấy thông tin user (cách đơn giản)
        const userInfo = this.getUserFromToken(token);
        
        if (userInfo) {
          // Lưu thông tin user
          localStorage.setItem('user', JSON.stringify(userInfo));
          
          console.log('[userService.login] Login successful, token and user info saved');
          
          return {
            success: true,
            data: {
              user: userInfo,
              token: token
            }
          };
        } else {
          return {
            success: false,
            message: 'Không thể lấy thông tin người dùng từ token'
          };
        }
      } else {
        return {
          success: false,
          message: response.error?.description || 'Đăng nhập thất bại'
        };
      }
    } catch (error) {
      console.error('[userService.login] Login failed:', error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Đăng nhập thất bại'
      };
    }
  },

  // Đăng ký
  async register(registerData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('[userService.register] Attempting registration for:', registerData.email);

      // Validation phía client
      if (registerData.password !== registerData.confirmPassword) {
        return {
          success: false,
          message: 'Mật khẩu không khớp'
        };
      }

      if (registerData.password.length < 6) {
        return {
          success: false,
          message: 'Mật khẩu phải có ít nhất 6 ký tự'
        };
      }

      const response = await api.post<BackendResponse<string>>('/Auth/register', {
        userName: registerData.userName,
        email: registerData.email,
        password: registerData.password
      });

      console.log('[userService.register] Registration response:', response);

      if (response.isSuccess && response.value) {
        const email = response.value; // Backend trả về email
        
        // Tự động đăng nhập sau khi đăng ký thành công
        const loginResult = await this.login({
          userName: registerData.userName,
          password: registerData.password
        });
        
        if (loginResult.success) {
          console.log('[userService.register] Registration and auto-login successful');
          return loginResult;
        } else {
          return {
            success: true,
            message: 'Đăng ký thành công! Vui lòng đăng nhập.'
          };
        }
      } else {
        return {
          success: false,
          message: response.error?.description || 'Đăng ký thất bại'
        };
      }
    } catch (error) {
      console.error('[userService.register] Registration failed:', error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Đăng ký thất bại'
      };
    }
  },

  // Đăng xuất
  async logout(): Promise<ApiResponse<null>> {
    try {
      console.log('[userService.logout] Attempting logout');

      // Xóa tokens và user info từ localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      console.log('[userService.logout] Logout successful, local data cleared');

      return {
        success: true,
        message: 'Đăng xuất thành công'
      };
    } catch (error) {
      console.error('[userService.logout] Logout failed:', error);
      
      return {
        success: false,
        message: 'Đăng xuất thất bại'
      };
    }
  },

  // Lấy thông tin user hiện tại
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return {
          success: false,
          message: 'Không tìm thấy token'
        };
      }

      // Thử decode token để lấy thông tin user
      const userFromToken = this.getUserFromToken(token);
      if (userFromToken) {
        return {
          success: true,
          data: userFromToken
        };
      }

      // Nếu không decode được, gọi API (nếu backend có endpoint này)
      try {
        const response = await api.get<BackendResponse<User>>('/auth/me');
        
        if (response.isSuccess && response.value) {
          // Cập nhật thông tin user trong localStorage
          localStorage.setItem('user', JSON.stringify(response.value));
          return {
            success: true,
            data: response.value
          };
        } else {
          return {
            success: false,
            message: response.error?.description || 'Không thể lấy thông tin người dùng'
          };
        }
      } catch (apiError) {
        // Nếu API không có, trả về user từ token
        if (userFromToken) {
          return {
            success: true,
            data: userFromToken
          };
        }
        
        throw apiError;
      }
    } catch (error) {
      console.error('[userService.getCurrentUser] Failed to get current user:', error);
      
      // Nếu token hết hạn, xóa local data
      if (error instanceof Error && error.message.includes('401')) {
        this.clearLocalData();
      }
      
      return {
        success: false,
        message: 'Không thể lấy thông tin người dùng'
      };
    }
  },

  // Refresh token
  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return {
          success: false,
          message: 'Không tìm thấy refresh token'
        };
      }

      const response = await api.post<AuthResponse>('/auth/refresh', {
        refreshToken
      });

      if (response.success && response.data) {
        localStorage.setItem('accessToken', response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
      }

      return response;
    } catch (error) {
      console.error('[userService.refreshToken] Token refresh failed:', error);
      this.clearLocalData();
      
      return {
        success: false,
        message: 'Không thể làm mới token'
      };
    }
  },

  // Đổi mật khẩu
  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.post<ApiResponse<null>>('/auth/change-password', {
        oldPassword,
        newPassword
      });

      return response;
    } catch (error) {
      console.error('[userService.changePassword] Change password failed:', error);
      
      return {
        success: false,
        message: 'Đổi mật khẩu thất bại'
      };
    }
  },

  // Quên mật khẩu
  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.post<ApiResponse<null>>('/auth/forgot-password', {
        email
      });

      return response;
    } catch (error) {
      console.error('[userService.forgotPassword] Forgot password failed:', error);
      
      return {
        success: false,
        message: 'Gửi email khôi phục thất bại'
      };
    }
  },

  // Reset mật khẩu
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.post<ApiResponse<null>>('/auth/reset-password', {
        token,
        newPassword
      });

      return response;
    } catch (error) {
      console.error('[userService.resetPassword] Reset password failed:', error);
      
      return {
        success: false,
        message: 'Đặt lại mật khẩu thất bại'
      };
    }
  },

  // Cập nhật thông tin profile
  async updateProfile(profileData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await api.put<ApiResponse<User>>('/auth/profile', profileData);
      
      if (response.success && response.data) {
        // Cập nhật localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      return response;
    } catch (error) {
      console.error('[userService.updateProfile] Update profile failed:', error);
      
      return {
        success: false,
        message: 'Cập nhật thông tin thất bại'
      };
    }
  },

  // Utility functions
  clearLocalData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getStoredToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken() && !!this.getStoredUser();
  },

  // Decode JWT token để lấy thông tin user
  getUserFromToken(token: string): User | null {
    try {
      // Decode JWT payload (phần giữa của token)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      
      // Tạo user object từ JWT payload
      return {
        userId: payload.sub || '', // subject
        email: payload.email || '',
        userName: payload.userName || '',
      };
    } catch (error) {
      console.error('Failed to decode JWT token:', error);
      return null;
    }
  }
};