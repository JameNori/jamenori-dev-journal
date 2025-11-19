// src/db
import pkg from 'pg';
const { Pool } = pkg;

// ใช้ environment variables
const connectionString = process.env.DATABASE_URL;

// รองรับ Vercel (require SSL = true)
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

// คำสั่ง query หลัก
export const query = (text, params) => {
  return pool.query(text, params);
};

export default {
  query,
};
