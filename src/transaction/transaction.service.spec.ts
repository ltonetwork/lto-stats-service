import { Test, TestingModule } from '@nestjs/testing';
import { TransactionModuleConfig } from './transaction.module';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let module: TestingModule;
  let transactionService: TransactionService;

  beforeEach(async () => {
    module = await Test.createTestingModule(TransactionModuleConfig).compile();
    await module.init();

    transactionService = module.get<TransactionService>(TransactionService);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('indexTransactionByTypeAndTime', () => {
    test('', () => {

    });
  });

  describe('getTransactions', () => {

  });

  describe('getGranularity', () => {

  });
});
