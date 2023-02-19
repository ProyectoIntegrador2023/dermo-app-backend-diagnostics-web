import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getEnvPath } from './config/env.helper';
import { HealthModule } from './health/health.module';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { DiagnosticModule } from './diagnostic/diagnostic.module';
import { AppController } from './app.controller';
import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';

const envFilePath: string = getEnvPath(`${__dirname}/environments`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    HttpModule,
    HealthModule,
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      isGlobal: true,
    }),
    DiagnosticModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
