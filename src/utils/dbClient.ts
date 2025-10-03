import { Pool } from 'pg';
import config from '../config';
import { errorlogger, logger } from '../shared/logger';

const pool = new Pool({
  user: config.db.user,
  host: config.db.host,
  database: config.db.database,
  password: config.db.password,
  port: Number(config.db.port)||5432,
  // 🚀 OPTIMIZATION: Enhanced pool configuration for better performance
  max: 20, // Maximum number of clients in the pool
  min: 5, // Minimum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  statement_timeout: 300000, // 5 minutes statement timeout
  query_timeout: 300000, // 5 minutes query timeout
  keepAlive: true,
  keepAliveInitialDelayMillis: 0,
});

pool.on('connect', () => {
  logger.info('✅ Connected to PostgreSQL database');
});

type PoolErrorEventHandler = {
    (err: Error): void;
}

pool.on('error', ((err: Error) => {
    errorlogger.error('❌ Unexpected PostgreSQL error', err);
    process.exit(-1);
}) as PoolErrorEventHandler);

export default pool;
