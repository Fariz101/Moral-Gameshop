import { Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, UsePipes, ValidationPipe, UseGuards, Query, UploadedFile } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { RoleGuard, Roles } from '../helper/roles-guard';
import { AuthGuard } from '@nestjs/passport';
import { FindGameDto } from './dto/find-game.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @UsePipes(new ValidationPipe)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() createGameDto: CreateGameDto,
  @UploadedFile() file: Express.Multer.File,) {
    return this.gameService.create(createGameDto, file);
  }

  @Get()
  findAll(@Query() findGameDto: FindGameDto) {
    return this.gameService.findAll(findGameDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('ADMIN')
  @UsePipes(new ValidationPipe)
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto, @UploadedFile() file: Express.Multer.File) {
    return this.gameService.update(+id, updateGameDto, file);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.gameService.remove(+id);
  }
}
