import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { User } from '../entities/user.entity';
export class CreateUserDto {
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
  user: User;
}
