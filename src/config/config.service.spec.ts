import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModuleConfig } from './config.module';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let module: TestingModule;
  let configService: ConfigService;

  beforeEach(async () => {
    module = await Test.createTestingModule(ConfigModuleConfig).compile();
    await module.init();

    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('get config', () => {
    test('getEnv()', async () => {
      expect(configService.getEnv()).toBe('test');
    });

    test('getLoggerGlobal()', () => {
      expect(configService.getLoggerGlobal()).toEqual({ level: 'debug' });
    });

    test('getLoggerConsole()', () => {
      expect(configService.getLoggerConsole()).toEqual({ level: 'debug' });
    });

    test('getLoggerCombined()', () => {
      expect(configService.getLoggerCombined()).toEqual({ level: 'debug' });
    });

    test('Mongo Default Url', () => {
      expect(configService.getMongoDefaultUrl()).toEqual('mongodb://localhost:27017/lt-stats');
    });

    test('getMonitorInterval', () => {
      expect(configService.getMonitorInterval()).toEqual(5000);
    });
  });
});
