import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { SignupDto } from 'src/auth/dto/auth.signup';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class AuthService {
  userRepo: Repository<ObjectLiteral>;

  constructor(
    private dataSource: DataSource,
    private jwt: JwtService,
    private config: ConfigService,
  ) {
    this.userRepo = this.dataSource.getRepository('User');
  }

  async signup(dto: SignupDto) {
    // generate the password hash
    const hashedPwd = await hash(dto.password);

    try {
      const result = await this.userRepo.save({
        firstName: '',
        lastName: '',
        email: dto.email,
        password: hashedPwd,
      });
      return this.signToken(result.id, result.email);
    } catch (error) {
      if (error.code === '23505') {
        throw new ForbiddenException('User already exists');
      }
      throw error;
    }
  }

  async signin(dto: SignupDto) {
    const user = await this.userRepo.findOneBy({ email: dto.email });
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    const pwMatches = await verify(user.password, dto.password);
    if (!pwMatches) {
      throw new ForbiddenException('Invalid password');
    }
    return this.signToken(user.id, user.email);
  }

  signToken(userId: number, email: string) {
    return {
      access_token: this.jwt.sign(
        { sub: userId, email },
        { expiresIn: '5000h', secret: this.config.get('JWT_SECRET') },
      ),
    };
  }
}
