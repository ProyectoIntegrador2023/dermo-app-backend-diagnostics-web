import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { DiagnosticDto } from './diagnostic.dto';
import { Diagnostic } from './diagnostic.entity';
import { DiagnosticService } from './diagnostic.service';

@Controller('')
export class DiagnosticController {
  private readonly logger = new Logger(DiagnosticController.name);

  @Inject(DiagnosticService)
  private readonly service: DiagnosticService;

  @Post('register')
  private registerDiagnostic(
    @Body() body: DiagnosticDto,
  ): Promise<Diagnostic | never> {
    return this.service.registerDiagnostic(body);
  }

  @Put('register')
  private updateDiagnostic(
    @Body() body: DiagnosticDto,
  ): Promise<Diagnostic | never> {
    return this.service.updateDiagnostic(body);
  }

  @Get(':injuryId')
  private getDiagnostic(
    @Param() injuryId: string,
  ): Promise<Diagnostic | never | UpdateResult> {
    return this.service.queryDiagnostic(injuryId);
  }
}
