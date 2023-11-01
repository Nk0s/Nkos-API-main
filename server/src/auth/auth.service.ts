import { UserService } from './../user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/types/types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(login: string, password: string): Promise<any> {
    const user = await this.userService.findOne(login);
    const passwordIsMatch = await bcrypt.compare(password, user.password);

    if (!passwordIsMatch) {
      throw new UnauthorizedException('The password or username is incorrect!');
    }
    return user;
  }

  async login(user: IUser) {
    const { login, email, description, age } = user;
    return {
      email,
      login,
      description,
      age,
      token: this.jwtService.sign({
        login: user.login,
        email: user.email,
        description: user.description,
        age: user.age,
      }),
    };
  }
}
