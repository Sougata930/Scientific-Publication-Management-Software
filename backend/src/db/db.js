import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schemas/researchers.js";
import "dotenv/config";
import { DB_NAME } from "../constants.js";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
// Test the DB connection .
const connectDb = async () => {
  try {
    const client = await pool.connect();
    console.log(`Database ${DB_NAME} Connected Successfully !`);
    client.release();
  } catch (error) {
    console.error("Database Connection Failed !", error);
    process.exit(1);
  }
};

export const db = drizzle(pool, { schema });
export { connectDb };
