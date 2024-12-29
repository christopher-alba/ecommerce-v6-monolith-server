import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { ConfigModule } from '@nestjs/config';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AuthModule } from './auth/auth.module';
import { AuthAdminModule } from './auth/auth-admin.module';
import { UserFacingAuthController } from './controllers/user-facing/auth/auth.controller';
import { UserFacingProductController } from './controllers/user-facing/product/product.controller';
import { ProductService } from './services/product/product.service';
import { AuthService } from './services/auth/auth.service';
import { Session, SessionSchema } from './mongodb/session.schema';
import {
  AdminSession,
  AdminSessionSchema,
} from './mongodb/admin-session.schema';
import { User, UserSchema } from './mongodb/user.schema';
import { AdminUser, AdminUserSchema } from './mongodb/admin-user.schema';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_ORIGIN}/?retryWrites=true&w=majority&appName=${process.env.DATABASE_APP_NAME}`,
      {
        bufferCommands: false,
      },
    ),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AdminUser.name, schema: AdminUserSchema },
      { name: Session.name, schema: SessionSchema },
      { name: AdminSession.name, schema: AdminSessionSchema },
    ]),
    AuthModule,
    AuthAdminModule,
  ],
  controllers: [
    AppController,
    UserFacingAuthController,
    UserFacingProductController,
  ],
  providers: [AppService, ProductService, AuthService],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    this.logger.log('Initializing MongoDB connection...');
    this.logger.log(
      `MongoDB connection state: ${this.connection.readyState === 1 ? 'Connected' : 'Not yet connected'}`,
    );
  }
}
