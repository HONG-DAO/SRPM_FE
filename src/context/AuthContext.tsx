/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentUser } from '@cnpm/services/userService';
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextProps {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUser: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  signOut: () => {},
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = React.useState<string | null>(
    sessionStorage.getItem('accessToken') || null
  );
  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);
  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const token = localStorage.getItem('token');
    if (token) {
      // Tùy chọn: Giải mã token để lấy thông tin người dùng hoặc fetch dữ liệu người dùng
      setUser({ token });
      console.log('check token', token)
    }
  }, []);

  React.useEffect(() => {
    if (token) {
      sessionStorage.setItem('accessToken', token);
    } else {
      sessionStorage.removeItem('accessToken');
    }
  }, [token]);

  const handleSignOut = async () => {
    try {
      await import('../services/authService').then(({ authService }) => authService.logout());
    } catch (error) {
      // fallback: vẫn xóa token local nếu có lỗi
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
