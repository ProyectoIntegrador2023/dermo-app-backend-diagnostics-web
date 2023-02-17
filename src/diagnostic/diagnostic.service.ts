import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosticDto } from './diagnostic.dto';
import { Diagnostic } from './diagnostic.entity';

@Injectable()
export class DiagnosticService {
  private readonly logger = new Logger(DiagnosticService.name);

  @InjectRepository(Diagnostic)
  private readonly repository: Repository<Diagnostic>;

  public async registerDiagnostic(
    body: DiagnosticDto
  ): Promise<Diagnostic | never> {
    this.logger.log('registerDiagnostic body', JSON.stringify(body));
    this.logger.log(body);

    const injuryId = body.injuryId;
    const diagnosticTmp: Diagnostic = await this.repository.findOne({
      where: { injuryId },
    });
    this.logger.log('diagnosticTmp ', JSON.stringify(diagnosticTmp));

    if (diagnosticTmp) {
      throw new HttpException(
        'Conflict Diagnostic Already Exist',
        HttpStatus.CONFLICT
      );
    }

    return this.repository.save(body);
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

    return this.repository.save(diagnosticTmp);
  }

  public async queryDiagnostic(injuryId: string): Promise<Diagnostic | never> {
    const diagnosticTmp: Diagnostic = await this.repository.findOne({
      where: { injuryId },
    });
    if (!diagnosticTmp) {
      throw new HttpException(
        'Diagnostic Not Found ' + injuryId,
        HttpStatus.NOT_FOUND,
      );
    }

    return diagnosticTmp;
  }
}
