export default {
  env: {
    doc: 'The application environment.',
    format: [
      'production',
      'development',
      'test',
    ],
    default: 'development',
    env: 'NODE_ENV',
  },
  port: {
    doc: 'The port the application runs on.',
    default: 80,
    env: 'PORT',
  },
  log: {
    level: {
      default: '',
      env: 'LOG_LEVEL',
    },
  },
  rollbar: {
    access_token: {
      default: '',
      env: 'ROLLBAR_ACCESS_TOKEN',
    },
    environment: {
      default: '',
      env: 'ROLLBAR_ENVIRONMENT',
    },
    level: {
      default: '',
      env: 'ROLLBAR_LEVEL',
    },
  },
  mongodb: {
    doc: 'MongoDB connection urls',
    url: {
      default: 'mongodb://localhost:27017/lt-stats',
      env: 'MONGODB_URL'
    }
  },
  monitor: {
    interval: {
      default: 5000,
      env: 'MONITOR_INTERVAL'
    },
    restart_sync: {
      default: false,
      env: "MONITOR_RESTART_SYNC"
    }
  },
  lto: {
    doc: 'Global config of the LTO node',
    node: {
      url: {
        default: 'http://localhost:6869',
        env: 'LTO_NODE_URL'
      },
    },
  },
};
