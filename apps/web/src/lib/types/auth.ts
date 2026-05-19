export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type VerifyOtpPayload = {
  email: string;
  otpCode: string;
};

export type RegisterResponse = {
  email: string;
  status: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: {
    id: string;
    email: string;
    role: string;
    status: string;
    emailVerifiedAt: string | null;
  };
};

export type ProfileResponse = {
  userId: string;
  fullName: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
  email: string;
};

export type UpdateProfilePayload = {
  fullName: string;
  phoneNumber?: string;
};
