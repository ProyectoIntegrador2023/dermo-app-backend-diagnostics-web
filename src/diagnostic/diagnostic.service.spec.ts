import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Diagnostic } from './diagnostic.entity';
import { DiagnosticService } from './diagnostic.service';

describe('DiagnosticService', () => {
  let service: DiagnosticService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiagnosticService,
        {
          provide: getRepositoryToken(Diagnostic),
          useValue: {},
        },
        { provide: CACHE_MANAGER, useValue: {} },
      ],
    }).compile();

    service = module.get<DiagnosticService>(DiagnosticService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
