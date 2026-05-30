import { ComplexType, ApiField } from '@opra/common';
import { ShipmentStatus } from './shipment.enum.js';

@ComplexType({
  description: 'Shipment (Cargo) details',
})
export class ShipmentType {
  @ApiField()
  id: string;

  @ApiField()
  productId: string;

  @ApiField()
  userId: string;

  @ApiField({
    type: 'string',
  })
  status: ShipmentStatus;

  @ApiField()
  createdAt: Date;
}
