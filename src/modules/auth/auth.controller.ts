import { HttpController, HttpOperation } from '@opra/common';
import { HttpContext } from '@opra/http';
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './login.dto.js';
import { LoginInputType, LoginResponseType } from './auth.schema.js';

@Controller('auth')
@HttpController({
  path: '/auth',
  description: 'Authentication endpoints',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @(HttpOperation.POST({
    path: 'login',
    description: 'Authenticate a user and return a JWT',
  })
  .RequestContent(LoginInputType)
  .Response(200, { description: 'Login successful', type: LoginResponseType })
  .Response(401, { description: 'Invalid credentials' }))
  async login(ctx: HttpContext) {
    const loginDto = await ctx.getBody<LoginDto>();
    return this.authService.login(loginDto);
  }
}
