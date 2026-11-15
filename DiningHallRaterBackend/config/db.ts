import {Pool} from 'pg';
import dotenv from 'dotenv';

// Loads .env variables in process.env
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

pool.on("connect", () => {
    console.log("Connected to the database");
})

pool.on("error", (err) => {
    console.error("Database error", err);
})

export default pool;