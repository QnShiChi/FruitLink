import { LoginRequestDto } from '../dto/request/login.request.dto';
import { RegisterRequestDto } from '../dto/request/register.request.dto';
import { ResendRegisterOtpRequestDto } from '../dto/request/resend-register-otp.request.dto';
import { VerifyRegisterOtpRequestDto } from '../dto/request/verify-register-otp.request.dto';

export abstract class AuthService {
  abstract registerInvestor(dto: RegisterRequestDto): Promise<{ email: string; status: string }>;
  abstract verifyRegisterOtp(dto: VerifyRegisterOtpRequestDto): Promise<{ email: string; status: string }>;
  abstract resendRegisterOtp(dto: ResendRegisterOtpRequestDto): Promise<{ email: string; status: string }>;
  abstract login(dto: LoginRequestDto): Promise<{
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
  }>;
  abstract getCurrentUser(userId: string): Promise<{
    id: string;
    email: string;
    role: string;
    status: string;
    emailVerifiedAt: string | null;
  }>;
}
