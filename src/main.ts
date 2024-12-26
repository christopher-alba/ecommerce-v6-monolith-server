import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [process.env.ADMINAPP_ORIGIN, process.env.CLIENT_ORIGIN],
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
