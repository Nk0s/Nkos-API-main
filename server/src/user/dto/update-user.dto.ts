import { IsEmail, MinLength, MaxLength, IsOptional } from 'class-validator';
export class UpdateUserDto {
  @IsOptional()
  @MinLength(4, { message: 'Login must be more then 4 symbols' })
  login: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @MinLength(6, { message: 'Password must be more then 6 symbols' })
  password: string;

  @IsOptional()
  age: number;

  @IsOptional()
  @MaxLength(1000, {
    message: 'Description too long. Maximum number of symbols 1000',
  })
  description: string;
}
