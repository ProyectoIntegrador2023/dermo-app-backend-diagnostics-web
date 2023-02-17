import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { DiagnosticDto } from './diagnostic.dto';
import { Diagnostic } from './diagnostic.entity';
import { DiagnosticService } from './diagnostic.service';

@Controller('diagnostic')
export class DiagnosticController {
  private readonly logger = new Logger(DiagnosticController.name);

  @Inject(DiagnosticService)
  private readonly service: DiagnosticService;

  @Post('register')
  private registerDiagnostic(
    @Body() body: DiagnosticDto
  ): Promise<Diagnostic | never> {
    return this.service.registerDiagnostic(body);
  }

  @Put('register')
  private updateDiagnostic(
    @Body() body: DiagnosticDto
  ): Promise<Diagnostic | never> {
    return this.service.updateDiagnostic(body);
  }

  @Get('injuryId/:injuryId')
  private getDiagnostic(
    @Param('injuryId', ParseUUIDPipe) injuryId: string
  ): Promise<Diagnostic | never> {
    return this.service.queryDiagnostic(injuryId);
  }

  @Get('health')
  redirect(@Res() res) {
    return res.redirect('/health');
  }
}
