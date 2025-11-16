import { compare, genSalt, hash } from "bcryptjs";
import { db } from "./server";
import { count, eq } from "drizzle-orm";
import { users } from "./db/schema";
import { User } from "./user";

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

    static async verifyHashPassword(pwd: string, hpwd: string): Promise<boolean> {
        return await compare(pwd, hpwd);
    }

    static async getCurrentPwd(userId: number): Promise<string> {
        const result = await db.select({password: users.password}).from(users).where(eq(users.id, userId)).limit(1);
        return result[0]?.password ?? "";
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
}

export default Utils;