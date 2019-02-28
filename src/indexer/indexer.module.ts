import { Module } from '@nestjs/common';
import { IndexerService } from './indexer.service';
import { MonitorService } from './monitor.service';
import { MonitorRespositoryService } from './monitor-respository.service';
import { ConfigModule } from '../config/config.module';
import { LoggerModule } from '../logger/logger.module';
import { NodeModule } from '../node/node.module';
import { TransactionModule } from '../transaction/transaction.module';
import { DatabaseModule } from '../database/database.module';
import { indexerProviders } from './indexer.providers';
import { BlockModule } from '../block/block.module';

export const IndexerModuleConfig = {
  imports: [
    LoggerModule,
    ConfigModule,
    NodeModule,
    TransactionModule,
    BlockModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [
    ...indexerProviders,
    IndexerService,
    MonitorService,
    MonitorRespositoryService,
  ],
  exports: [
    ...indexerProviders,
    IndexerService,
    MonitorService,
    MonitorRespositoryService,
  ],
};

@Module(IndexerModuleConfig)
export class IndexerModule { }
