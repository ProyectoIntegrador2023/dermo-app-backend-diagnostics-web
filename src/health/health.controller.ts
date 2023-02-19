import { Controller, Get, Logger } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { readFile } from 'fs/promises';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    let packageFile = {};
    try {
      const packageFileTmp = await readFile('./package.json');
      packageFile = JSON.parse(packageFileTmp.toString());
    } catch (error) {
      console.error(`Got an error trying to read the file: ${error.message}`);
    }

    const healthCheck = await this.health.check([
      () => this.http.pingCheck('Basic Check', 'https://www.google.com'),
      () => this.db.pingCheck('database'),
    ]);

    return {
      name: packageFile['name'],
      version: packageFile['version'],
      ...healthCheck,
    };
  }
}
