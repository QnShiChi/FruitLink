import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProfileRequestDto {
  @IsString({ message: 'Họ và tên phải là chuỗi ký tự.' })
  @MinLength(2, { message: 'Họ và tên phải có ít nhất 2 ký tự.' })
  fullName!: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự.' })
  phoneNumber?: string;
}
