import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: process.env.DB_HOST || this.config.get<string>('DB_HOST'),
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      database: process.env.DB_NAME || this.config.get<string>('DB_NAME'),
      username: process.env.DB_USER || this.config.get<string>('DB_USER'),
      password:
        process.env.DB_PASSWORD || this.config.get<string>('DB_PASSWORD'),
      entities: ['dist/**/*.entity.{ts,js}'],
      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsTableName: 'typeorm_migrations',
      logger: 'file',
      schema: process.env.DB_SCHEMA || this.config.get<string>('DB_SCHEMA'),
      synchronize: !!this.config.get<string>('PRODUCTION') || false, // never use TRUE in production!
    };
  }
}
