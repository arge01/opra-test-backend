import { EnumType } from '@opra/common';

export enum ShipmentStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  AT_FACILITY = 'AT_FACILITY',
  FAILED_DELIVERY = 'FAILED_DELIVERY',
}

EnumType.apply(void 0, [ShipmentStatus, { name: 'ShipmentStatus', description: 'Shipping status' }]);
