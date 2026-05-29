import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import jwt from 'jsonwebtoken';
import { Token } from './token.entity.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, 'super-secret-jwt-key') as { userId: string };

      // Check if token exists in DB
      const tokenRecord = await this.tokenRepository.findOne({ where: { token } });
      if (!tokenRecord) {
        throw new UnauthorizedException('Token is revoked or invalid');
      }

      // Important: Attach userId to headers so Opra HttpContext can read it
      request.headers['x-user-id'] = decoded.userId;
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
