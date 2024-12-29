import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from '../services/app.service';

@Controller('protected')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/test')
  getProtectedResource() {
    return { message: 'This is a protected route' };
  }

  @UseGuards(AuthGuard('jwt-admin'))
  @Get('/test/admin')
  getProtectedAdminResource() {
    return { message: 'This is a protected admin route' };
  }
}
