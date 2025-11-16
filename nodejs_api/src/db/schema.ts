
import { pgTable, integer, varchar} from "drizzle-orm/pg-core";

export const users = pgTable("Users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({length: 255}).notNull(),
    email: varchar({length: 255}).notNull(),
    user: varchar({length: 255}).notNull(),
    password: varchar({length: 255}).notNull(),
});


