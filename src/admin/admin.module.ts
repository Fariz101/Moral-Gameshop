import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

import { BcryptModule } from '../bcrypt/bcrypt.module'; 

@Module({
  imports: [BcryptModule], 
  
  controllers: [AdminController],
  providers: [AdminService], 
})
export class AdminModule {}