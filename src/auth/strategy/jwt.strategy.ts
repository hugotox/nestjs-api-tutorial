import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  userRepo: Repository<ObjectLiteral>;

  constructor(
    private config: ConfigService,
    private dataSource: DataSource,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
    this.userRepo = this.dataSource.getRepository('User');
  }

  // appends the return value of this method to the request.user
  async validate(payload: { sub: number; email: string }) {
    const user = await this.userRepo.findOneBy({ id: payload.sub });
    delete user.password;
    return user;
  }
}
