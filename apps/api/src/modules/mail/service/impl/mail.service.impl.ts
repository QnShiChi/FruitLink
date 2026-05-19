import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { MailService } from '../mail.service';

@Injectable()
export class MailServiceImpl implements MailService {
  private readonly transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST ?? 'mailpit',
    port: Number(process.env.MAIL_PORT ?? 1025),
    secure: false,
  });

  async sendRegisterOtpEmail(payload: { to: string; fullName: string; otpCode: string }) {
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM ?? 'fruitlink@example.local',
      to: payload.to,
      subject: 'Mã OTP xác thực đăng ký FruitLink',
      text: `Xin chào ${payload.fullName},

Mã OTP xác thực đăng ký của bạn là: ${payload.otpCode}.
Mã có hiệu lực trong thời gian ngắn.

Trân trọng,
FruitLink`,
    });
  }
}
