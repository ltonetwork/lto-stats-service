import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from './config/config.module';
import { HealthModule } from './health/health.module';
import { InfoModule } from './info/info.module';
import { LoggerModule } from './logger/logger.module';
import { appProviders } from './app.providers';
import {DatabaseModule} from './database/database.module';
import {IndexerModule} from './indexer/indexer.module';
import {TransactionModule} from './transaction/transaction.module';

export const AppModuleConfig = {
  imports: [
    ConfigModule,
    DatabaseModule,
    HealthModule,
    IndexerModule,
    InfoModule,
    LoggerModule,
    TransactionModule
  ],
  controllers: [AppController],
  providers: [...appProviders],
};

@Module(AppModuleConfig)
export class AppModule {}
