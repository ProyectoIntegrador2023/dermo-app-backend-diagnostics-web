import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticController } from './diagnostic.controller';
import { Diagnostic } from './diagnostic.entity';
import { DiagnosticService } from './diagnostic.service';

@Module({
  controllers: [DiagnosticController],
  providers: [DiagnosticService],
  exports: [DiagnosticService],
  imports: [TypeOrmModule.forFeature([Diagnostic])],
})
export class DiagnosticModule {}
