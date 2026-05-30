import { Controller, UseGuards } from '@nestjs/common';
import { HttpController, HttpOperation } from '@opra/common';
import { HttpContext } from '@opra/http';
import { ShipmentService } from './shipment.service.js';
import { ShipmentType } from './shipment.schema.js';
import { AuthGuard } from '../auth/auth.guard.js';

@Controller('shipments')
@HttpController({
  path: '/shipments',
  description: 'Shipment API endpoints',
})
@UseGuards(AuthGuard)
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @HttpOperation.Entity.FindMany(ShipmentType)
  async findMany(ctx: HttpContext) {
    const { limit = 10, skip = 0 } = ctx.queryParams || {};
    return this.shipmentService.findMany({ limit: Number(limit), skip: Number(skip) });
  }

  @HttpOperation.Entity.Get(ShipmentType)
  async get(ctx: HttpContext) {
    const id = ctx.pathParams.id;
    return this.shipmentService.get(String(id));
  }
}
