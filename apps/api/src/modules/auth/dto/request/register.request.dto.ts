import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterRequestDto {
  @IsString({ message: 'Họ và tên phải là chuỗi ký tự.' })
  @MinLength(2, { message: 'Họ và tên phải có ít nhất 2 ký tự.' })
  fullName!: string;

  @IsEmail({}, { message: 'Email không đúng định dạng.' })
  email!: string;

  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự.' })
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự.' })
  password!: string;

  @IsString({ message: 'Xác nhận mật khẩu phải là chuỗi ký tự.' })
  confirmPassword!: string;
}
