import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import FormatValidation from '../helper/validation-format';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @UsePipes(new ValidationPipe({exceptionFactory: FormatValidation}))
  auth(@Body() authDto: AuthDto) {
    return this.authService.auth(authDto);
  }
}
