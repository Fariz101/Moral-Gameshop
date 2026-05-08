import { PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from './create-game.dto';
import { IsEnum, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
import { Genre } from '@prisma/client';
import { Type } from 'class-transformer';

export class UpdateGameDto extends PartialType(CreateGameDto) {
    @IsOptional()
      @IsString()
      title?: string;
    
      @IsOptional()
      @IsString()
      description?: string;
    
      @IsOptional()
      @IsString()
      specification?: string;
    
      @IsOptional()
      image?: any;
    
      @IsOptional()
      @Type(() => Number)
      @IsNumber()
      price?: number;
    
      @IsOptional()
      @IsEnum(Genre)
      genre?: Genre;
}
