import { genSalt, hash } from "bcryptjs";
import { db } from "./server";
import { users } from "./db/schema";
import { User } from "./user";
import 'dotenv/config';

class Utils {
    static verifyEmail(email: string): boolean {
        return /^[a-zA-Z0-9._%+-]+@gmail\.com(\.br)?$/.test(email);
    }

    static verifyPassword(password?: string | undefined): boolean {
        return (
            password !== null &&
            password !== undefined &&
            /[0-9]/.test(password) &&
            /[a-zA-Z]/.test(password) &&
            password.length >= 6
        );
    }

    static async hashPassword(password: string): Promise<string> {
        const saltNumber = 10;
        const salt = await genSalt(saltNumber);
        const hashPwd = await hash(password, salt);
        return hashPwd;
    }

    static getUserQuery(){
      return db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            user: users.user,
        }).from(users);
    }

    static userDto({
        id,
        name,
        email,
        user
    } : {
        id: number,
        name: string,
        email: string,
        user: string
    }): User {
        return new User({
            id: id,
            name: name,
            email: email,
            user: user,
        });
    }   

    static getDbUrl(): string {
        const PORT = process.env.DB_PORT ?? "3000";
        const HOST = process.env.DB_HOST ?? "localhost";
        const USER = process.env.DB_USER ?? "postgres";
        const PASSWORD = process.env.DB_PASSWORD ?? "123456789";
        const DB = process.env.DB_NAME ?? "ubqtdatabase";
        return `postgresql://${USER}:${PASSWORD}@${HOST}:${PORT}/${DB}`;
    }
}

export default Utils;