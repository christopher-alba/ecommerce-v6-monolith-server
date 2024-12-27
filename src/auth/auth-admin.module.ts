import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAdminStrategy } from './jwt.admin-strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt-admin' }),
    JwtModule.register({}),
  ],
  providers: [JwtAdminStrategy],
  exports: [PassportModule],
})
export class AuthAdminModule {}
