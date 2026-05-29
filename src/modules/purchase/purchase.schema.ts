import { ComplexType, ApiField } from '@opra/common';

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
}
