import { Module } from '@nestjs/common';
import { transactionProviders } from './transaction.providers';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { LoggerModule } from '../logger/logger.module';
import { ConfigModule } from '../config/config.module';
import {DatabaseModule} from '../database/database.module';
import {TransactionRepositoryService} from './transaction-repository.service';

export const TransactionModuleConfig = {
  imports: [LoggerModule, ConfigModule, DatabaseModule],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    TransactionRepositoryService,
    ...transactionProviders,
  ],
  exports: [
    TransactionService,
    TransactionRepositoryService,
    ...transactionProviders,
  ],
};

@Module(TransactionModuleConfig)
export class TransactionModule { }
