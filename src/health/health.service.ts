import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { MonitorService } from '../indexer/monitor.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly config: ConfigService,
    private readonly monitor: MonitorService,
  ) {
  }

  async isNodeHealthy(): Promise<boolean> {
    return this.monitor.isMonitorSynced();
  }
}
