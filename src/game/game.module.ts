import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { BcryptService } from '../bcrypt/bcrypt.service';

@Module({
  controllers: [GameController],
  providers: [GameService, 
    PrismaService,    
    CloudinaryService, 
    BcryptService],
})
export class GameModule {}
