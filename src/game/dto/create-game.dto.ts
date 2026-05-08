import { Genre } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  specification!: string;

  @IsOptional()
  image?: any;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  price!: number;

  @IsNotEmpty()
  @IsEnum(Genre)
  genre!: Genre;
}
