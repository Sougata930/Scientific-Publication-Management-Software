import { timestamps } from "./helper.js";
import { pgTable, integer,text } from "drizzle-orm/pg-core";

export const researchers = pgTable("researchers",{
    id : integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name : text("name").notNull,
    Phone_extension : text("Phone_extension").notNull()
    .references(()=> Office.id{
        onDelete:'cascade'


    })
})

export const Office = pgTable("Office",{
    id : integer("id").primaryKey().notNull,
    address : text("address").notNull,
})

