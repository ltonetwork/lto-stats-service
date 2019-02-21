import { Module } from '@nestjs/common';
import { healthProviders } from './health.providers';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { ConfigModule } from '../config/config.module';
import { NodeModule } from '../node/node.module';

export const HealthModuleConfig = {
  imports: [
    ConfigModule,
    NodeModule,
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
