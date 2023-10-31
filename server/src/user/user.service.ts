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
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtservice: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existEmail = await this.userRepository.findOne({
      where: [{ login: createUserDto.login }, { email: createUserDto.email }],
    });
    if (existEmail)
      throw new BadRequestException('This login or email alreadt exist!');

    const saltOrRounds = 10;
    const user = await this.userRepository.save({
      login: createUserDto.login,
      description: createUserDto.description,
      age: createUserDto.age,
      email: createUserDto.email,
      password: await bcrypt.hashSync(createUserDto.password, saltOrRounds),
    });
    const token = this.jwtservice.sign({ login: createUserDto.login });
    return { user, token };
  }

  async findOne(login: string) {
    const search = await this.userRepository.findOne({
      where: { login },
    });
    if (!search) throw new NotFoundException('User not found');
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
  //Я ошибся и то что ниже не работает((((
  async editprofile(user: User, updateUserDto: UpdateUserDto) {
    const saltOrRounds = 10;
    user.email = updateUserDto.email;
    user.description = updateUserDto.description;
    user.age = updateUserDto.age;
    if (updateUserDto.password) {
      user.password = await bcrypt.hashSync(
        updateUserDto.password,
        saltOrRounds,
      );
    }
    await this.userRepository.update(user, updateUserDto);
    return user;
  }
}
