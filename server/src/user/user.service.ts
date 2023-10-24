import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/types/types';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtservice: JwtService,
  ) {}

  async create(CreateUserDto: CreateUserDto) {
    const existEmail = await this.userRepository.findOne({
      where: {
        email: CreateUserDto.email,
      },
    });
    const existUser = await this.userRepository.findOne({
      where: {
        login: CreateUserDto.login,
      },
    });
    if (existEmail) throw new BadRequestException('This email already exist!')

    if (existUser) throw new BadRequestException('This login already exist!')

    const user = await this.userRepository.save({
      login: CreateUserDto.login,
      description: CreateUserDto.description,
      age: CreateUserDto.age,
      email: CreateUserDto.email,
      password: CreateUserDto.password,
    })
    const token = this.jwtservice.sign({ login: CreateUserDto.login })

    return { user, token };
  }

  async findOne(login: string) {
    const search = await this.userRepository.findOne({
      where: { login },
    });
    if (!search) throw new NotFoundException('User not found')
    return search;
  }
  async findAll() {
    return await this.userRepository.find();
  }
  async profile(user: IUser) {
    const { login, email, description, age } = user;
    return {
      login,
      email,
      description,
      age,
      token: this.jwtservice.sign({
        login: user.login,
        email: user.email,
        description: user.description,
        age: user.age,
      }),
    };
  }
}
