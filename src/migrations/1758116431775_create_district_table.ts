import pool from '../utils/dbClient';

export const name = '1758116431775_create_district_table';

export const run = async () => {
  // Write your SQL query here
  await pool.query(`
   CREATE TABLE district (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  `);
};