import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AccountRole } from '../../../../common/enums/account-role.enum';
import { AccountStatus } from '../../../../common/enums/account-status.enum';
import { AuditService } from '../../../audit/service/audit.service';
import { MailService } from '../../../mail/service/mail.service';
import { UsersService } from '../../../users/service/users.service';
import { AuthRepository } from '../../repository/auth.repository';
import { LoginRequestDto } from '../../dto/request/login.request.dto';
import { RegisterRequestDto } from '../../dto/request/register.request.dto';
import { ResendRegisterOtpRequestDto } from '../../dto/request/resend-register-otp.request.dto';
import { VerifyRegisterOtpRequestDto } from '../../dto/request/verify-register-otp.request.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authRepository: AuthRepository,
    private readonly mailService: MailService,
    private readonly auditService: AuditService,
    private readonly jwtService: JwtService,
  ) {}

  async registerInvestor(dto: RegisterRequestDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Mật khẩu xác nhận không khớp.');
    }

    const existingUser = await this.usersService.findByEmail(dto.email.toLowerCase());
    if (existingUser) {
      throw new BadRequestException('Email đã tồn tại trong hệ thống.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.createInvestorAccount({
      email: dto.email.toLowerCase(),
      passwordHash,
      fullName: dto.fullName,
      role: AccountRole.INVESTOR,
      status: AccountStatus.PENDING_VERIFICATION,
    });

    const otpCode = this.generateOtp();
    const otpTtl = Number(process.env.OTP_REGISTER_TTL_SECONDS ?? 300);
    const resendCooldown = Number(process.env.OTP_REGISTER_RESEND_COOLDOWN_SECONDS ?? 60);

    await this.authRepository.saveRegisterOtp(user.email, otpCode, otpTtl);
    await this.authRepository.setRegisterOtpCooldown(user.email, resendCooldown);
    await this.mailService.sendRegisterOtpEmail({
      to: user.email,
      fullName: user.profile?.fullName ?? dto.fullName,
      otpCode,
    });

    await this.auditService.record({
      userId: user.id,
      action: 'register_investor',
      targetType: 'user',
      targetId: user.id,
      metadata: { email: user.email },
    });

    return {
      email: user.email,
      status: user.status,
    };
  }

  async verifyRegisterOtp(dto: VerifyRegisterOtpRequestDto) {
    const email = dto.email.toLowerCase();
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Không tìm thấy tài khoản cần xác thực.');
    }

    if (user.status !== AccountStatus.PENDING_VERIFICATION) {
      throw new BadRequestException('Tài khoản này không ở trạng thái chờ xác thực.');
    }

    const savedOtp = await this.authRepository.getRegisterOtp(email);
    if (!savedOtp) {
      throw new BadRequestException('Mã OTP đã hết hạn.');
    }

    const maxAttempts = Number(process.env.OTP_REGISTER_MAX_ATTEMPTS ?? 5);
    const attemptTtl = Number(process.env.OTP_REGISTER_TTL_SECONDS ?? 300);

    if (savedOtp !== dto.otpCode) {
      const attempts = await this.authRepository.increaseRegisterOtpAttempts(email, attemptTtl);

      if (attempts >= maxAttempts) {
        await this.auditService.record({
          userId: user.id,
          action: 'verify_register_otp_blocked',
          targetType: 'user',
          targetId: user.id,
          metadata: { email },
        });
        throw new BadRequestException('Bạn đã nhập sai quá số lần cho phép. Vui lòng yêu cầu gửi lại mã OTP mới.');
      }

      throw new BadRequestException('Mã OTP không đúng.');
    }

    const activatedUser = await this.usersService.activateUser(user.id);
    await this.authRepository.clearRegisterOtp(email);
    await this.auditService.record({
      userId: activatedUser.id,
      action: 'verify_register_otp_success',
      targetType: 'user',
      targetId: activatedUser.id,
      metadata: { email },
    });

    return {
      email: activatedUser.email,
      status: activatedUser.status,
    };
  }

  async resendRegisterOtp(dto: ResendRegisterOtpRequestDto) {
    const email = dto.email.toLowerCase();
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Không tìm thấy tài khoản cần gửi lại mã OTP.');
    }

    if (user.status !== AccountStatus.PENDING_VERIFICATION) {
      throw new BadRequestException('Tài khoản này không còn ở trạng thái chờ xác thực.');
    }

    const cooldownKey = await this.authRepository.getRegisterOtpCooldown(email);
    if (cooldownKey) {
      throw new BadRequestException('Bạn vừa yêu cầu gửi mã OTP. Vui lòng thử lại sau ít phút.');
    }

    const otpCode = this.generateOtp();
    const otpTtl = Number(process.env.OTP_REGISTER_TTL_SECONDS ?? 300);
    const resendCooldown = Number(process.env.OTP_REGISTER_RESEND_COOLDOWN_SECONDS ?? 60);

    await this.authRepository.saveRegisterOtp(email, otpCode, otpTtl);
    await this.authRepository.setRegisterOtpCooldown(email, resendCooldown);
    await this.mailService.sendRegisterOtpEmail({
      to: email,
      fullName: user.profile?.fullName ?? 'Nhà đầu tư FruitLink',
      otpCode,
    });

    await this.auditService.record({
      userId: user.id,
      action: 'resend_register_otp',
      targetType: 'user',
      targetId: user.id,
      metadata: { email },
    });

    return {
      email,
      status: user.status,
    };
  }

  async login(dto: LoginRequestDto) {
    const email = dto.email.toLowerCase();
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash ?? '');
    if (!isMatch) {
      await this.auditService.record({
        userId: user.id,
        action: 'login_failed',
        targetType: 'user',
        targetId: user.id,
        metadata: { email },
      });
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
    }

    if (user.status === AccountStatus.PENDING_VERIFICATION) {
      throw new UnauthorizedException('Tài khoản của bạn chưa xác thực email.');
    }

    if (user.status === AccountStatus.LOCKED) {
      throw new UnauthorizedException('Tài khoản của bạn đã bị khóa.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    const jwtExpiresIn = (process.env.JWT_EXPIRES_IN ?? '1d') as unknown as never;
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET ?? 'fruitlink-secret-key',
      expiresIn: jwtExpiresIn,
    });

    await this.auditService.record({
      userId: user.id,
      action: 'login_success',
      targetType: 'user',
      targetId: user.id,
      metadata: { email },
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
      },
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Không tìm thấy thông tin người dùng hiện tại.');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
    };
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
