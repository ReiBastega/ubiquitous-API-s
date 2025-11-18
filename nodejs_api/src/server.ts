import app from "./app";
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
dotenv.config({quiet: true});


/*

With a container:
    DATABASE_URL=postgresql://postgres:123456789@db:5432/ubqtdatabase

Without a container:
    DATABASE_URL=postgresql://postgres:123456789@localhost:5432/ubqtdatabase

*/


const LOCAL_DB_URL = "postgresql://postgres:123456789@localhost:5432/ubqtdatabase";

const PORT = Number(process.env.PORT ?? 3000);

export const db = drizzle(process.env.DATABASE_URL ?? LOCAL_DB_URL);

app.listen(PORT, (error) => {
    console.log(`Server running on port ${PORT}`);
    if(error) console.log(error);
});