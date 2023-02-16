import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getEnvPath } from './config/env.helper';
import { HealthModule } from './health/health.module';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { DiagnosticModule } from './diagnostic/diagnostic.module';

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
    DiagnosticModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
