import { UserService } from './../user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/types/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(login: string, password: string): Promise<any> {
    const user = await this.userService.findOne(login);

    if (user && user.password == password) {
      return user;
    }

    throw new UnauthorizedException('The password or username is incorrect!');
  }

  async login(user: IUser) {
    const { login, email } = user;
    return {
      email,
      login,
      token: this.jwtService.sign({ login: user.login }),
    };
  }
}
