import { defineConfig } from 'drizzle-kit';
import Utils from './src/utils';

export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: Utils.getDbUrl(),
    }
});