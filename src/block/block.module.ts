import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { ConfigModule } from '../config/config.module';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { BlockRepositoryService } from './block-repository.service';
import { blockProviders } from './block.providers';
import { DatabaseModule } from '../database/database.module';

export const BlockModuleConfig = {
  imports: [LoggerModule, ConfigModule, DatabaseModule],
  controllers: [
    BlockController,
  ],
  providers: [
    BlockService,
    BlockRepositoryService,
    ...blockProviders,
  ],
  exports: [
    BlockService,
    BlockRepositoryService,
    ...blockProviders,
  ],
};

@Module(BlockModuleConfig)
export class BlockModule { }