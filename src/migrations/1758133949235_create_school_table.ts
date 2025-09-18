import pool from '../utils/dbClient';

export const name = '1758133949235_create_school_table';

export const run = async () => {
  // Write your SQL query here
  await pool.query(`
    CREATE TABLE school (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    eiin VARCHAR(100),
    mobile VARCHAR(20),
    logo VARCHAR(255),
    district_id INT NOT NULL REFERENCES district(id) ON DELETE CASCADE,
    thana_id INT NOT NULL REFERENCES thana(id) ON DELETE CASCADE,
    website VARCHAR(255),
    email VARCHAR(255),
    address TEXT,
    payable_amount NUMERIC(18,2),
    established_at VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  `);
};