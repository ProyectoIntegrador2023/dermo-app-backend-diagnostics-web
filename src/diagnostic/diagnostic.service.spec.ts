import { CACHE_MANAGER, HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diagnostic, DiagnosticRepositoryFake } from './diagnostic.entity';
import { DiagnosticService } from './diagnostic.service';
import { Cache } from 'cache-manager';
import { faker } from '@faker-js/faker';
import { DiagnosticDto } from './diagnostic.dto';

const diagnosticMock = {
  medicId: 1,
  injuryId: faker.datatype.uuid(),
  condition: faker.lorem.sentence(),
  level: faker.lorem.sentence(),
  requeresTreatment: faker.datatype.boolean(),
  treatmentTerm: faker.lorem.sentence(),
  medicines: faker.lorem.sentence(),
  treatmentControl: faker.lorem.sentence(),
  recommendations: faker.lorem.sentence(),
};

const savedDiagnosticEntity = Diagnostic.of({
  id: Number(faker.random.numeric(2)),
  createdAt: new Date(),
  updatedAt: null,
  ...diagnosticMock,
});

describe('DiagnosticService', () => {
  let diagnosticService: DiagnosticService;
  let diagnosticRepository: Repository<Diagnostic>;
  let cache: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiagnosticService,
        {
          provide: getRepositoryToken(Diagnostic),
          useClass: DiagnosticRepositoryFake,
        },
        {
          provide: CACHE_MANAGER,
          // useClass: CacheManagerRepositoryFake,
          useValue: {
            get: () => null,
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    diagnosticService = module.get<DiagnosticService>(DiagnosticService);
    diagnosticRepository = module.get(getRepositoryToken(Diagnostic));
    cache = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(diagnosticService).toBeDefined();
  });

  describe('queryDiagnostic', () => {
    it('throws an error when no injuryId is provided or no exist.', async () => {
      const injuryId = '';
      try {
        await diagnosticService.queryDiagnostic(injuryId);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Diagnostic Not Found ' + injuryId);
      }
    });

    it('calls the repository with correct paramaters', async () => {
      jest.spyOn(cache, 'get');
      jest
        .spyOn(diagnosticRepository, 'findOne')
        .mockResolvedValue(savedDiagnosticEntity);

      const injuryId = savedDiagnosticEntity.injuryId;
      const result = await diagnosticService.queryDiagnostic(injuryId);

      expect(result).toBe(savedDiagnosticEntity);
    });

    it('calls the cache with correct paramaters', async () => {
      jest.spyOn(cache, 'get').mockResolvedValueOnce(savedDiagnosticEntity);

      const injuryId = savedDiagnosticEntity.injuryId;
      const result = await diagnosticService.queryDiagnostic(injuryId);

      expect(result).toBe(savedDiagnosticEntity);
    });
  });

  describe('registerDiagnostic', () => {
    it('throws an error when no injuryId is provided or no exist.', async () => {
      const injuryId = '';
      try {
        await diagnosticService.registerDiagnostic(new DiagnosticDto());
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Diagnostic Not Found ' + injuryId);
      }
    });

    it('throws an error when diagnostic exist in db.', async () => {
      jest
        .spyOn(diagnosticRepository, 'findOne')
        .mockResolvedValue(savedDiagnosticEntity);

      try {
        await diagnosticService.registerDiagnostic(diagnosticMock);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Conflict Diagnostic Already Exist in DB');
      }
    });

    it('throws an error when diagnostic exist in cache.', async () => {
      jest.spyOn(cache, 'get').mockResolvedValueOnce(savedDiagnosticEntity);

      try {
        await diagnosticService.registerDiagnostic(diagnosticMock);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Conflict Diagnostic Already Exist (Cached)');
      }
    });

    it('calls the cache with correct paramaters', async () => {
      jest.spyOn(cache, 'get').mockResolvedValueOnce(null);
      jest.spyOn(diagnosticRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(diagnosticRepository, 'save')
        .mockResolvedValue(savedDiagnosticEntity);

      const result = await diagnosticService.registerDiagnostic(diagnosticMock);
      expect(result).toBe(savedDiagnosticEntity);
    });
  });

  describe('updateDiagnostic', () => {
    it('throws an error when no body is provided or no exist.', async () => {
      try {
        await diagnosticService.updateDiagnostic(new DiagnosticDto());
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Diagnostic Not Found');
      }
    });

    it('throws an error when diagnostic exist in db.', async () => {
      jest.spyOn(diagnosticRepository, 'findOne').mockResolvedValue(null);

      try {
        await diagnosticService.updateDiagnostic(diagnosticMock);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Diagnostic Not Found');
      }
    });

    it('calls the cache with correct paramaters', async () => {
      jest.spyOn(cache, 'set');
      jest
        .spyOn(diagnosticRepository, 'findOne')
        .mockResolvedValue(savedDiagnosticEntity);
      jest
        .spyOn(diagnosticRepository, 'save')
        .mockResolvedValue(savedDiagnosticEntity);

      const result = await diagnosticService.updateDiagnostic(diagnosticMock);
      expect(result).toBe(savedDiagnosticEntity);
    });
  });
});
