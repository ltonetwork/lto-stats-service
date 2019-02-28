import { Module } from '@nestjs/common';
import { healthProviders } from './health.providers';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { ConfigModule } from '../config/config.module';
import { IndexerModule } from '../indexer/indexer.module';

export const HealthModuleConfig = {
  imports: [
    ConfigModule,
    IndexerModule,
  ],
  controllers: [HealthController],
  providers: [
    HealthService,
    ...healthProviders,
  ],
  exports: [
    HealthService,
    ...healthProviders,
  ],
};

@Module(HealthModuleConfig)
export class HealthModule { }
