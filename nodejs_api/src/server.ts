import app from "./app";
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import Utils from "./utils";
dotenv.config({quiet: true});

/*

With a container:
    DATABASE_URL=postgresql://postgres:123456789@db:5432/ubqtdatabase

Without a container:
    DATABASE_URL=postgresql://postgres:123456789@localhost:5432/ubqtdatabase

*/



const PORT = Number(process.env.PORT ?? 3000);

export const db = drizzle(Utils.getDbUrl());

app.listen(PORT, (error) => {
    console.log(`Server running on port ${PORT}`);
    if(error) console.log(error);
});