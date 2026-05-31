import { Controller } from '@nestjs/common';
import { HttpController, HttpOperation } from '@opra/common';
import { HttpContext } from '@opra/http';
import { ShipmentService } from './shipment.service.js';
import { ShipmentType } from './shipment.schema.js';

@Controller('shipments')
@HttpController({
  path: '/shipments',
  description: 'Shipment API endpoints',
})
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @(HttpOperation.Entity.FindMany(ShipmentType).Filter('productId', ['=', 'in']))
  async findMany(ctx: HttpContext) {
    const { limit = 10, skip = 0, filter } = ctx.queryParams || {};
    console.log('FILTER AST:', typeof filter, filter);
    let productId: string | undefined;
    
    if (filter) {
      // Traverse OpraFilter AST to find productId
      const findProductId = (node: any): string | undefined => {
        if (!node) return undefined;
        if (node.kind === 'ComparisonExpression' && node.left?.value === 'productId' && (node.op === '=' || node.op === 'eq')) {
          return String(node.right?.value);
        }
        if (node.kind === 'LogicalExpression' && node.items) {
          for (const item of node.items) {
            const found = findProductId(item);
            if (found) return found;
          }
        }
        return undefined;
      };
      
      productId = findProductId(filter);
    }
    
    return this.shipmentService.findMany({ limit: Number(limit), skip: Number(skip), productId });
  }

  @HttpOperation.Entity.Get(ShipmentType)
  async get(ctx: HttpContext) {
    const id = ctx.pathParams.id;
    return this.shipmentService.get(String(id));
  }
}
