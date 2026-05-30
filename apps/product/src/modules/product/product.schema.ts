import { ComplexType, ApiField } from '@opra/common';

@ComplexType({
  description: 'Product schema',
})
export class ProductType {
  @ApiField({
    type: 'string',
    description: 'Product ID',
  })
  id: string;

  @ApiField({
    type: 'string',
    required: true,
  })
  name: string;

  @ApiField({
    type: 'string',
    required: true,
  })
  sku: string;

  @ApiField({
    type: 'string',
  })
  description?: string;

  @ApiField({
    type: 'string',
  })
  image?: string;

  @ApiField({
    type: 'number',
    required: true,
  })
  price: number;

  @ApiField({
    type: 'integer',
  })
  stock?: number;

  @ApiField({
    type: 'boolean',
  })
  isActive?: boolean;
}
