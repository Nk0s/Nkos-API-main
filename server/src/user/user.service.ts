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
import { paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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
    const token = this.jwtService.sign({ login: createUserDto.login });
    return { user, token };
  }

  async findOne(login: string) {
    const search = await this.userRepository.findOne({
      where: { login },
    });
    if (!search) throw new NotFoundException('User not found');
    return search;
  }

  async profile(user: IUser) {
    const { login } = user;
    this.userRepository.findOne({ where: { login } });
    return user;
  }
  async editProfile(user: User, updateUserDto: UpdateUserDto) {
    const profile = await this.userRepository.findOne({
      where: {
        login: user.login,
      },
    });
    const saltOrRounds = 10;
    if (updateUserDto.login) {
      user.login = updateUserDto.login;
    }
    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }
    if (updateUserDto.description) {
      user.description = updateUserDto.description;
    }
    if (updateUserDto.age) {
      user.age = updateUserDto.age;
    }
    if (updateUserDto.password) {
      user.password = await bcrypt.hashSync(
        updateUserDto.password,
        saltOrRounds,
      );
    }

    await this.userRepository.save({ ...profile, ...user });
    return user;
  }
  async findAll(
    page: number,
    limit: number,
    filterLogin?: string,
  ): Promise<[User[], number]> {
    const skip = (page - 1) * limit;
    const query = this.userRepository
      .createQueryBuilder('user')
      .skip(skip)
      .take(limit);

    if (filterLogin) {
      query.where('user.login LIKE :login', { login: `%${filterLogin}%` });
    }

    const [users, total] = await query.getManyAndCount();

    return [users, total];
  }
}
