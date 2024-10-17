import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/get-user-decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/user/user.entity';

@Controller('users')
export class UserController {
  constructor() {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@GetUser() user: User) {
    console.log(user);
    return user;
  }
}
