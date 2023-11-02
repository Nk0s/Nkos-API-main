import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Get,
  Request,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { GetUser } from './GetUser';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('reg')
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Get('users/')
  async findAll(
    @Query('page') page,
    @Query('limit') limit,
    @Query('filterLogin') filterLogin?: string,
  ) {
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);

    return this.userService.findAll(parsedPage, parsedLimit, filterLogin);
  }
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return this.userService.profile(req.user);
  }

  @Get('usersfound')
  @UseGuards(JwtAuthGuard)
  findOne(@Param() login: string) {
    return this.userService.findOne(login);
  }

  @Patch('profile/edit')
  @UseGuards(JwtAuthGuard)
  updateProfile(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.editProfile(user, updateUserDto);
  }
}
