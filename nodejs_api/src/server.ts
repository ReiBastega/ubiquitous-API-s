import app from "./app";
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
dotenv.config({quiet: true});

export const db = drizzle(process.env.DATABASE_URL!);

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, (error) => {
    console.log(`Server running on port ${PORT}`);
    if(error) console.log(error);
});