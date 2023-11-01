import { IsEmail, MaxLength, MinLength } from 'class-validator';
export class CreateUserDto {
  @MinLength(4, { message: 'Login must be more then 4 symbols' })
  login: string;

  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Password must be more then 6 symbols' })
  password: string;

  age: number;
  @MaxLength(1000, {
    message: 'Description too long. Maximum number of symbols 1000',
  })
  description: string;
}
