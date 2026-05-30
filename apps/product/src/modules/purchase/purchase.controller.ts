import { HttpController, HttpOperation } from '@opra/common';
import { HttpContext } from '@opra/http';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { PurchaseService } from './purchase.service.js';
import { PurchaseType } from './purchase.schema.js';

@Controller('purchases')
@HttpController({
  path: '/purchases',
  description: 'Purchases collection',
})
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @HttpOperation.Entity.FindMany(PurchaseType)
  async findMany(ctx: HttpContext) {
    const { limit = 10, skip = 0 } = ctx.queryParams || {};
    return this.purchaseService.findMany({ limit, skip });
  }

  @HttpOperation.Entity.Get(PurchaseType)
  async get(ctx: HttpContext) {
    const id = ctx.pathParams.id;
    return this.purchaseService.get(id);
  }

  @UseGuards(AuthGuard)
  @HttpOperation.Entity.Create(PurchaseType)
  async create(ctx: HttpContext) {
    const body = await ctx.getBody<any>();
    body.userId = ctx.request.headers['x-user-id']; // Prevent buying for someone else
    return this.purchaseService.create(body);
  }

  @UseGuards(AuthGuard)
  @HttpOperation.Entity.Update(PurchaseType)
  async update(ctx: HttpContext) {
    const id = ctx.pathParams.id;
    const body = await ctx.getBody<any>();
    body.userId = ctx.request.headers['x-user-id']; // Ensure it stays attached to the user
    return this.purchaseService.update(id, body);
  }

  @UseGuards(AuthGuard)
  @HttpOperation.Entity.Delete(PurchaseType)
  async delete(ctx: HttpContext) {
    const id = ctx.pathParams.id;
    return this.purchaseService.delete(id);
  }
}
