import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyRegisterOtpRequestDto {
  @IsEmail({}, { message: 'Email không đúng định dạng.' })
  email!: string;

  @IsString({ message: 'Mã OTP phải là chuỗi ký tự.' })
  @Length(6, 6, { message: 'Mã OTP phải gồm đúng 6 ký tự.' })
  otpCode!: string;
}
