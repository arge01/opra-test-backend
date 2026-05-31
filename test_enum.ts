import { EnumType } from '@opra/common';
export enum ShipmentStatus { PENDING = 'PENDING' }
try {
  EnumType.call(undefined, ShipmentStatus, { name: 'ShipmentStatus' });
  console.log("Success with undefined this!");
} catch (e) {
  console.error("Failed with undefined this:", e);
}
