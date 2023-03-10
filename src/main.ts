import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config: ConfigService = app.get(ConfigService);
  const port = process.env.PORT || 3001;

  await app.listen(port, () => {
    console.log('[WEB]', `http://localhost:${port}`);
    console.log('[PROD]', `${config.get('PRODUCTION')}`);
  });
}

bootstrap();
