// src/services/authService.ts

export interface UserProfile {
  fullname: string;
  email: string;
  password: string;
  address: string;
  role: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface RegisterPayload {
  fullname: string;
  email: string;
  password: string;
  repeatPassword: string;
  address: string;
}

interface VerifyEmailPayload {
  email: string;
  verificationCode: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface ForgotPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
  repeatNewPassword: string;
}

interface AuthResponse {
  message: string;
  accessToken?: string;
  refreshToken?: string;
  profile?: UserProfile;
}

// Fake database (in-memory)
const fakeUsers: UserProfile[] = [];
const userState = { profile: null as UserProfile | null };

// Fake token
const fakeToken = 'fake.jwt.token';

export const authService = {
  AUTH_PATH: '/auth',

  async sendOtp(email: string): Promise<{ message: string }> {
    console.log(`📧 [Mock] OTP sent to ${email}`);
    await delay(500);
    return { message: 'OTP sent' };
  },

  async verifyEmail({ email, verificationCode }: VerifyEmailPayload): Promise<{ message: string }> {
    console.log(`🔍 [Mock] Verifying OTP ${verificationCode} for ${email}`);
    await delay(500);
    if (verificationCode !== '123456') throw new Error('Invalid OTP');
    return { message: 'Email verified' };
  },

  async completeRegistration(payload: RegisterPayload): Promise<{ message: string }> {
    const { email, password, fullname, address } = payload;
    if (fakeUsers.find((u) => u.email === email)) {
      throw new Error('Email already registered');
    }
    const user: UserProfile = {
      fullname,
      email,
      password,
      address,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    fakeUsers.push(user);
    console.log('✅ [Mock] Registered user:', user);
    await delay(500);
    return { message: 'User registered successfully' };
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const user = fakeUsers.find(
      (u) => u.email === payload.email && u.password === payload.password
    );
    if (!user) throw new Error('Invalid email or password');
    sessionStorage.setItem('accessToken', fakeToken);
    sessionStorage.setItem('user_profile', JSON.stringify(user));
    userState.profile = user;
    console.log('✅ [Mock] Logged in as:', user.email);
    return { message: 'Login successful', accessToken: fakeToken, profile: user };
  },

  async sendOTP(email: string): Promise<{ message: string }> {
    console.log(`📧 [Mock] Sending OTP for password reset to ${email}`);
    await delay(500);
    return { message: 'OTP sent for password reset' };
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
    const user = fakeUsers.find((u) => u.email === payload.email);
    if (!user) throw new Error('Email not found');
    if (payload.otp !== '123456') throw new Error('Invalid OTP');
    if (payload.newPassword !== payload.repeatNewPassword) throw new Error('Passwords do not match');
    user.password = payload.newPassword;
    user.updatedAt = new Date().toISOString();
    console.log(`🔐 [Mock] Password reset for ${user.email}`);
    await delay(500);
    return { message: 'Password updated successfully' };
  },

  async logout(): Promise<void> {
    sessionStorage.clear();
    userState.profile = null;
    console.log('🚪 [Mock] User logged out');
    await delay(300);
    window.location.replace('/signin');
  },

  async getProfile(): Promise<{ data: UserProfile }> {
    const stored = sessionStorage.getItem('user_profile');
    if (!stored) throw new Error('No profile in session');
    return { data: JSON.parse(stored) };
  },

  async updateUserProfile(profile: UserProfile): Promise<{ message: string }> {
    const index = fakeUsers.findIndex((u) => u.email === profile.email);
    if (index !== -1) {
      fakeUsers[index] = { ...profile };
      userState.profile = profile;
      sessionStorage.setItem('user_profile', JSON.stringify(profile));
      console.log('✏️ [Mock] Profile updated:', profile);
      await delay(500);
      return { message: 'Profile updated' };
    }
    throw new Error('User not found');
  },

  async checkExistingUser(email: string): Promise<boolean> {
    return fakeUsers.some((u) => u.email === email);
  },

  async googleLogin(code: string): Promise<AuthResponse> {
    console.log('🌐 [Mock] Google login with code:', code);
    const user: UserProfile = {
      fullname: 'Google User',
      email: 'google@example.com',
      password: '',
      address: 'Google HQ',
      role: 'user',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
    };
    fakeUsers.push(user);
    sessionStorage.setItem('accessToken', fakeToken);
    sessionStorage.setItem('user_profile', JSON.stringify(user));
    userState.profile = user;
    await delay(300);
    return { message: 'Google login successful', accessToken: fakeToken, profile: user };
  },

  handleError(error: any): Error {
    return new Error(error.message || 'Something went wrong');
  },

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('accessToken');
  },

  async fetchAndStoreUserProfile(): Promise<void> {
    const profile = userState.profile || JSON.parse(sessionStorage.getItem('user_profile') || 'null');
    if (profile) {
      userState.profile = profile;
      sessionStorage.setItem('user_profile', JSON.stringify(profile));
    }
  },

  getCurrentProfile(): UserProfile | null {
    if (!userState.profile) {
      const stored = sessionStorage.getItem('user_profile');
      if (stored) userState.profile = JSON.parse(stored);
    }
    return userState.profile;
  },

  getUserID(): number | null {
    return 1; // fake ID
  },
};

// Helper delay function
function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
