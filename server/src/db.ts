import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

export async function testDatabaseConnection() {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('Database connected:', result.rows[0]);
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}