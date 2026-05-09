import { Controller, Get, Post, Body, Put, Param, Delete, UsePipes, ValidationPipe, UseGuards, Query, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleGuard, Roles } from '../helper/roles-guard';
import { AuthGuard } from '@nestjs/passport';
import { FindUserDto } from './dto/find-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('ADMIN')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('ADMIN')
  findAll(@Query() findUserDto: FindUserDto) {
    return this.userService.findAll(findUserDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
