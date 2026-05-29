import { ComplexType, ApiField } from '@opra/common';

@ComplexType({
  description: 'Login payload',
})
export class LoginInputType {
  @ApiField({ type: 'string', required: true })
  email: string;

  @ApiField({ type: 'string', required: true })
  password: string;
}

@ComplexType({
  description: 'Login response containing JWT and user ID',
})
export class LoginResponseType {
  @ApiField({ type: 'string', required: true })
  accessToken: string;

  @ApiField({ type: 'string', required: true })
  userId: string;
}
