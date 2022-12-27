import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from 'src/routes/users/users.service';
import { User } from '@prisma/client';

export class SessionSerializer extends PassportSerializer {
  constructor(@Inject('USERS_SERVICE') private readonly usersService: UsersService) {
    super();
  }

  async serializeUser(user: User, done: (err, user: User) => void) {
    done(null, user);
  }

  async deserializeUser(user: User, done: (err, user: User) => void) {
    const userDB = await this.usersService.findUserById(user.id);
    return userDB ? done(null, userDB) : done(null, null);
  }
}
