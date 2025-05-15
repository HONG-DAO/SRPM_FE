// src/services/userService.ts

export const findUserByEmail = async (email: string) => {
    console.log(`🔍 [Fake] Kiểm tra email đã tồn tại: ${email}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return null; // hoặc return { email: ..., name: ... }
  };
  
  export const saveUser = async (user: any) => {
    console.log('💾 [Fake] Lưu người dùng:', user);
    await new Promise((resolve) => setTimeout(resolve, 500));
  };
  


export const getCurrentUser = () => {
    // Fake user data
    const token = localStorage.getItem('token');
  
    if (!token) return null;
  
    return {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'vana@example.com',
      role: 'user',
      avatar: 'https://i.pravatar.cc/150?img=3',
      token,
    };
  };