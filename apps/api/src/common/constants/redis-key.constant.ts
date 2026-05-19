export const RedisKeyConstant = {
  registerOtp: (email: string) => `auth:register-otp:${email}`,
  registerOtpAttempts: (email: string) => `auth:register-otp-attempts:${email}`,
  registerOtpCooldown: (email: string) => `auth:register-otp-cooldown:${email}`,
};
