import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DiagnosticController } from './diagnostic.controller';
import { Diagnostic } from './diagnostic.entity';
import { DiagnosticService } from './diagnostic.service';

describe('DiagnosticController', () => {
  let controller: DiagnosticController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiagnosticController],
      providers: [
        DiagnosticService,
        {
          provide: getRepositoryToken(Diagnostic),
          useValue: {},
        },
        { provide: CACHE_MANAGER, useValue: {} },
      ],
    }).compile();

    controller = module.get<DiagnosticController>(DiagnosticController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
