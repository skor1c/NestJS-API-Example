import {
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/core/guards/LocalAuthGuard.guard';
import { UsersService } from './users.service';
import { SerializedUser, SerializedUserPagination } from './types';
import { Query } from '@nestjs/common/decorators/http/route-params.decorator';
import { UserNotFoundException } from './exceptions/UserNotFound.exception';

@ApiCookieAuth()
@ApiTags('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthenticatedGuard)
@Controller('users')
export class UsersController {
  constructor(@Inject('USERS_SERVICE') private readonly usersService: UsersService) {}

  @Get()
  //#region Swagger
  @ApiOperation({ summary: 'Get All Users with pagination' })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'orderBy', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  //#endregion
  async getUsers(
    @Query('sortBy', new DefaultValuePipe('id')) sortBy: string,
    @Query('orderBy', new DefaultValuePipe('asc')) orderBy: 'asc' | 'desc',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const usersWithPagination = await this.usersService.findUsers(sortBy, orderBy, page, limit);
    if (usersWithPagination) return new SerializedUserPagination(usersWithPagination);
  }

  @Get('/:id')
  //#region Swagger
  @ApiOperation({ summary: 'Get User by ID' })
  //#endregion
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findUserById(id);
    if (user) return new SerializedUser(user);
    throw new UserNotFoundException();
  }

  @Delete('/:id')
  //#region Swagger
  @ApiOperation({ summary: 'Delete User by ID' })
  //#endregion
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.deleteUser(id);
    if (user) return { message: 'User deleted successfully' };
    throw new UserNotFoundException();
  }
}
