import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { TransactionModuleConfig } from './transaction.module';
import { NodeService } from '../node/node.service';

describe('TransactionController', () => {
  let module: TestingModule;
  let app: INestApplication;

  beforeEach(async () => {
    module = await Test.createTestingModule(TransactionModuleConfig).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await module.close();
  });

  describe('get()', () => {
    test('should return list of nr of txs per day', () => {
      // ToDo: Create tests
    });
  });
});
