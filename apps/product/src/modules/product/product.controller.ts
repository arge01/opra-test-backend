import { HttpController, HttpOperation } from '@opra/common';
import { HttpContext } from '@opra/http';
import { Controller } from '@nestjs/common';
import { ProductService } from './product.service.js';
import { ProductType } from './product.schema.js';

@Controller('products')
@HttpController({
  path: '/products',
  description: 'Products collection',
})
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @HttpOperation.Entity.FindMany(ProductType)
  async findMany(ctx: HttpContext) {
    const { limit = 10, skip = 0 } = ctx.queryParams || {};
    return this.productService.findMany({ limit, skip });
  }

  @HttpOperation.Entity.Get(ProductType)
  async get(ctx: HttpContext) {
    const id = ctx.pathParams.id;
    return this.productService.get(id);
  }

  @HttpOperation.Entity.Create(ProductType)
  async create(ctx: HttpContext) {
    const body = await ctx.getBody<ProductType>();
    return this.productService.create(body);
  }

  @HttpOperation.Entity.Update(ProductType)
  async update(ctx: HttpContext) {
    const id = ctx.pathParams.id;
    const body = await ctx.getBody<Partial<ProductType>>();
    return this.productService.update(id, body);
  }

  @HttpOperation.Entity.Delete(ProductType)
  async delete(ctx: HttpContext) {
    const id = ctx.pathParams.id;
    return this.productService.delete(id);
  }
}
