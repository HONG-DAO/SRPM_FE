// src/services/googleAuthService.ts

export const handleGoogleResponse = async (response: any) => {
    console.log('🔐 [Fake] Xử lý phản hồi Google OAuth:', response);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      email: "user@fe.edu.vn",
      name: "Fake User",
      picture: "https://i.pravatar.cc/150?img=5"
    };
  };
  