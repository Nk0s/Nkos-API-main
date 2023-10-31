import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, MinLength, MaxLength, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @MaxLength(1000, {
    message: 'Description too long. Maximum number of symbols 1000',
  })
  description: string;

  @IsOptional()
  @MinLength(6, { message: 'Password must be more then 6 symbols' })
  password: string;
}
