import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

const LOCAL_DB_URL = "postgresql://postgres:123456789@localhost:5432/ubqtdatabase";

export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL ?? LOCAL_DB_URL,
    }
});