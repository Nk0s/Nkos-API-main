import { IsEmail, MinLength, MaxLength } from 'class-validator';
export class UpdateUserDto {
  @IsEmail()
  email: string;

  @MaxLength(1000, {
    message: 'Description too long. Maximum number of symbols 1000',
  })
  description: string;

  @MinLength(8)
  password?: string;
  age: number;
}
