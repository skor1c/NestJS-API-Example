import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dtos/loginUserDto.dto';
import { LocalAuthGuard } from '../../core/guards/LocalAuthGuard.guard';
import { CreateUserDto } from '../users/dtos';
import { SerializedUser } from '../users/types';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('singup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.createUser(createUserDto);
    if (user) return new SerializedUser(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body()
    LoginUserDto: LoginUserDto,
    @Session() session: Record<string, any>,
  ) {
    session.authenticated = true;
    return { message: 'Login successful' };
  }

  @Post('/logout')
  async logout(@Req() req): Promise<{ message: string }> {
    req.session.destroy();
    return { message: 'The user session has ended' };
  }
}
