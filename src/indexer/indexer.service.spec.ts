import { Test, TestingModule } from '@nestjs/testing';
import { IndexerModuleConfig } from './indexer.module';
import { IndexerService } from './indexer.service';

describe('AnchorService', () => {
  let module: TestingModule;
  let indexerService: IndexerService;

  function spy() {
    const indexer = {
      index: jest.spyOn(indexerService, 'index'),
    };

    return { indexer };
  }

  beforeEach(async () => {
    module = await Test.createTestingModule(IndexerModuleConfig).compile();
    await module.init();

    indexerService = module.get<IndexerService>(IndexerService);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('index()', () => {
    test('should index the anchor transaction', async () => {
      // ToDo: Create tests
    });
  });
});
