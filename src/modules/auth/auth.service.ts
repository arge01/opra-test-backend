import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../user/user.entity.js';
import { Token } from './token.entity.js';
import { LoginDto } from './login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password || '', user.password || '');
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.id };
    const accessToken = jwt.sign(payload, 'super-secret-jwt-key', { expiresIn: '1h' });

    const tokenRecord = this.tokenRepository.create({
      userId: user.id,
      token: accessToken,
    });
    
    await this.tokenRepository.save(tokenRecord);

    return {
      accessToken,
      userId: user.id,
    };
  }
}
