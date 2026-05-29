import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';
import { UserType } from './user.schema.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findMany(options: { limit: number; skip: number }) {
    const [data, total] = await this.userRepository.findAndCount({
      take: options.limit,
      skip: options.skip,
      order: { createdAt: 'DESC' },
    });
    return { data, total };
  }

  async get(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async create(data: Partial<UserType> & { password?: string }) {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async update(id: string, data: Partial<UserType> & { password?: string }) {
    const user = await this.get(id);
    Object.assign(user, data);
    return this.userRepository.save(user);
  }

  async delete(id: string) {
    const user = await this.get(id);
    await this.userRepository.remove(user);
    return { success: true };
  }
}
