import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { BcryptModule } from '../bcrypt/bcrypt.module';

@Module({
  imports: [BcryptModule], 
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
