import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { DiagnosticDto } from './diagnostic.dto';
import { Diagnostic } from './diagnostic.entity';

const INJURY_REDIS_KEY = 'injury/';
const REDIS_TTL = parseInt(process.env.REDIS_TTL, 10) || 90;

@Injectable()
export class DiagnosticService {
  private readonly logger = new Logger(DiagnosticService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @InjectRepository(Diagnostic)
  private readonly repository: Repository<Diagnostic>;

  public async registerDiagnostic(
    body: DiagnosticDto
  ): Promise<Diagnostic | never> {
    this.logger.log('registerDiagnostic body', JSON.stringify(body));
    this.logger.log(body);
    const injuryId = body.injuryId;

    const cachedData = await this.cacheManager.get<Diagnostic>(
      INJURY_REDIS_KEY + injuryId
    );

    if (cachedData) {
      throw new HttpException(
        'Conflict Diagnostic Already Exist (Cached)',
        HttpStatus.CONFLICT
      );
    }

    const diagnosticTmp: Diagnostic = await this.repository.findOne({
      where: { injuryId },
    });
    this.logger.log('Getting data from DB ', JSON.stringify(diagnosticTmp));

    if (diagnosticTmp) {
      throw new HttpException(
        'Conflict Diagnostic Already Exist in DB',
        HttpStatus.CONFLICT
      );
    }

    const diagnosticSaved = await this.repository.save(body);

    await this.cacheManager.set<Diagnostic>(
      INJURY_REDIS_KEY + injuryId,
      diagnosticSaved,
      { ttl: REDIS_TTL }
    );

    return diagnosticSaved;
  }

  public async updateDiagnostic(
    body: DiagnosticDto
  ): Promise<Diagnostic | never> {
    this.logger.log('updateDiagnostic body', body);

    const injuryId = body.injuryId;
    const diagnosticTmp: Diagnostic = await this.repository.findOne({
      where: { injuryId },
    });

    if (!diagnosticTmp) {
      throw new HttpException('Diagnostic Not Found', HttpStatus.NOT_FOUND);
    }

    diagnosticTmp.condition = body.condition;
    diagnosticTmp.level = body.level;
    diagnosticTmp.requeresTreatment = body.requeresTreatment;
    diagnosticTmp.treatmentTerm = body.treatmentTerm;
    diagnosticTmp.treatmentControl = body.treatmentControl;
    diagnosticTmp.recommendations = body.recommendations;

    const diagnosticSaved = await this.repository.save(diagnosticTmp);

    await this.cacheManager.set<Diagnostic>(
      INJURY_REDIS_KEY + injuryId,
      diagnosticSaved,
      { ttl: REDIS_TTL }
    );

    return diagnosticSaved;
  }

  public async queryDiagnostic(injuryId: string): Promise<Diagnostic | never> {
    const cachedData = await this.cacheManager.get<Diagnostic>(
      INJURY_REDIS_KEY + injuryId
    );

    if (cachedData) {
      this.logger.log('Getting data from cache', JSON.stringify(cachedData));
      return cachedData;
    }

    const diagnosticTmp: Diagnostic = await this.repository.findOne({
      where: { injuryId },
    });

    if (!diagnosticTmp) {
      throw new HttpException(
        'Diagnostic Not Found ' + injuryId,
        HttpStatus.NOT_FOUND
      );
    }

    await this.cacheManager.set<Diagnostic>(
      INJURY_REDIS_KEY + injuryId,
      diagnosticTmp,
      { ttl: REDIS_TTL }
    );

    return diagnosticTmp;
  }
}
