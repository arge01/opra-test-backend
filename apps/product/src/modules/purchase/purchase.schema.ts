import { ComplexType, ApiField } from '@opra/common';
import { ProductType } from '../product/product.schema.js';
@ComplexType({
  description: 'Purchase details',
})
export class PurchaseType {
  @ApiField()
  id: string;

  @ApiField()
  userId: string;

  @ApiField()
  productId: string;

  @ApiField()
  quantity: number;

  @ApiField()
  purchasedAt: Date;

  @ApiField({ type: () => ProductType, required: false })
  product?: ProductType;
}
