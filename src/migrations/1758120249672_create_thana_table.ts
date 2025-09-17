import pool from '../utils/dbClient';

export const name = '1758120249672_create_thana_table';

export const run = async () => {
  // Write your SQL query here
  await pool.query(`
    CREATE TABLE thana (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    district_id INT REFERENCES district(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  `);
};