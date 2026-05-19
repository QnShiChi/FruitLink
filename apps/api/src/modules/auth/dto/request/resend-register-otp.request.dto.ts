import { IsEmail } from 'class-validator';

export class ResendRegisterOtpRequestDto {
  @IsEmail({}, { message: 'Email không đúng định dạng.' })
  email!: string;
}
