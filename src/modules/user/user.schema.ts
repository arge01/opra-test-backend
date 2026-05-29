import { ComplexType, ApiField } from '@opra/common';

@ComplexType({
  description: 'User details',
})
export class UserType {
  @ApiField()
  id: string;

  @ApiField()
  email: string;

  @ApiField({ required: false })
  firstName?: string;

  @ApiField({ required: false })
  lastName?: string;

  @ApiField()
  isActive: boolean;

  @ApiField()
  createdAt: Date;
}
