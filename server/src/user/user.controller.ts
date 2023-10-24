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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('reg')
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Get('users')
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.userService.findAll();
  }
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return this.userService.profile(req.user);
  }
  @Get('usersfound')
  @UseGuards(JwtAuthGuard)
  findOne(@Param(':login') login: string) {
    return this.userService.findOne(login);
  }
}
