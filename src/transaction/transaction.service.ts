import {Injectable} from '@nestjs/common';
import {TransactionGranularity, TransactionInstanceType} from './models/transaction.model';
import {TransactionRepositoryService} from './transaction-repository.service';
import moment, {Duration, Moment} from 'moment';

@Injectable()
export class TransactionService {
  constructor(
    readonly transactionRepository: TransactionRepositoryService
  ) { }

  indexTransactionByTypeAndTime(type: number, timestamp: number): Promise<TransactionInstanceType[]> {

    const sec = moment(timestamp).utc();
    const day = moment(timestamp).utc().startOf('day').toDate();
    const promises = [];
    promises.push(this.transactionRepository.incrementTransactionCount({date: day, type, granularity: TransactionGranularity.Day}, 1));

    if (moment(timestamp).isSameOrAfter(moment().subtract(2,'days')) ) {
      promises.push(this.transactionRepository.incrementTransactionCount({date: sec.toDate(), type, granularity: TransactionGranularity.Sec}, 1));
    }

    const time = moment(timestamp);
    const comparetime = moment().subtract(2, 'months');

    if (moment(timestamp).isSameOrAfter(moment().subtract(2, 'months'))) {
      const hour = moment(timestamp).utc().startOf('hour').toDate();
      promises.push(this.transactionRepository.incrementTransactionCount({date: hour, type, granularity: TransactionGranularity.Hour}, 1));
    }

    return Promise.all(promises);
  }

  async getTransactions(startDate: Moment, endDate: Moment, granularity: TransactionGranularity, type?: number): Promise<TransactionInstanceType[]> {
    return (await this.transactionRepository.find(startDate.toDate(), endDate.toDate(), granularity, Number(type))).map((tx) => {
      tx.date = tx._id;
      delete tx._id;
      return tx;
    });
  }

  getGranularity(startDate: Moment, endDate: Moment, granularity?: TransactionGranularity) {
    const duration: Duration = moment.duration(endDate.diff(startDate));
    if (duration.asMonths() > 2) {
      return TransactionGranularity.Day;
    } else if (duration.asDays() > 2) {
      return granularity && granularity == TransactionGranularity.Day ? granularity : TransactionGranularity.Hour;
    } else {
      return granularity ? granularity : TransactionGranularity.Sec;
    }
  }
}
