import { Controller, UseGuards } from '@nestjs/common';
import { HttpController, HttpOperation } from '@opra/common';
import { HttpContext } from '@opra/http';
import { AuthGuard } from '../auth/auth.guard.js';
import { UserService } from './user.service.js';
import { UserType } from './user.schema.js';

@Controller('users')
@HttpController({
  path: '/users',
  description: 'Users collection',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpOperation.Entity.FindMany(UserType)
  async findMany(ctx: HttpContext) {
    const { limit = 10, skip = 0 } = ctx.queryParams || {};
    return this.userService.findMany({ limit, skip });
  }

  @HttpOperation.Entity.Get(UserType)
  async get(ctx: HttpContext) {
    const id = ctx.pathParams.id;
    return this.userService.get(id);
  }

  @HttpOperation.Entity.Create(UserType)
  async create(ctx: HttpContext) {
    const body = await ctx.getBody<UserType>();
    return this.userService.create(body);
  }

  @UseGuards(AuthGuard)
  @HttpOperation.Entity.Update(UserType)
  async update(ctx: HttpContext) {
    const id = ctx.pathParams.id;
    const body = await ctx.getBody<Partial<UserType>>();
    return this.userService.update(id, body);
  }

  @UseGuards(AuthGuard)
  @HttpOperation.Entity.Delete(UserType)
  async delete(ctx: HttpContext) {
    const id = ctx.pathParams.id;
    return this.userService.delete(id);
  }
}
