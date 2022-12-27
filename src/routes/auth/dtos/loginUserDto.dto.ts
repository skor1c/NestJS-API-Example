import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(10)
  password: string;
}
