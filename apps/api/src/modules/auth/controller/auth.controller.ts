import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { CurrentUserPayload } from '../../../common/interfaces/current-user.interface';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { LoginRequestDto } from '../dto/request/login.request.dto';
import { RegisterRequestDto } from '../dto/request/register.request.dto';
import { ResendRegisterOtpRequestDto } from '../dto/request/resend-register-otp.request.dto';
import { VerifyRegisterOtpRequestDto } from '../dto/request/verify-register-otp.request.dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterRequestDto) {
    const data = await this.authService.registerInvestor(dto);
    return {
      message: 'Đăng ký tài khoản thành công. Vui lòng kiểm tra email để lấy mã OTP.',
      data,
    };
  }

  @Post('verify-register-otp')
  async verifyRegisterOtp(@Body() dto: VerifyRegisterOtpRequestDto) {
    const data = await this.authService.verifyRegisterOtp(dto);
    return {
      message: 'Xác thực đăng ký thành công.',
      data,
    };
  }

  @Post('resend-register-otp')
  async resendRegisterOtp(@Body() dto: ResendRegisterOtpRequestDto) {
    const data = await this.authService.resendRegisterOtp(dto);
    return {
      message: 'Đã gửi lại mã OTP đăng ký tới email của bạn.',
      data,
    };
  }

  @Post('login')
  async login(@Body() dto: LoginRequestDto) {
    const data = await this.authService.login(dto);
    return {
      message: 'Đăng nhập thành công.',
      data,
    };
  }

  @Post('logout')
  async logout() {
    return {
      message: 'Đăng xuất thành công.',
      data: null,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() currentUser: CurrentUserPayload) {
    const data = await this.authService.getCurrentUser(currentUser.id);
    return {
      message: 'Lấy thông tin người dùng hiện tại thành công.',
      data,
    };
  }
}
