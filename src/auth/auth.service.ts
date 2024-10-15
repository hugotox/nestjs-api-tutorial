import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { SignupDto } from 'src/auth/dto/auth.signup';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(private dataSource: DataSource) {}

  async signup(dto: SignupDto) {
    // generate the password hash
    const hashedPwd = await hash(dto.password);

    const userRepo = this.dataSource.getRepository('User');
    const result = await userRepo.save({
      firstName: '',
      lastName: '',
      email: dto.email,
      password: hashedPwd,
    });
    delete result.password;
    return result;
  }

  signin() {
    console.log('AuthService signup');
  }
}
