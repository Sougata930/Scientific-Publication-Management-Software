import { timestamps } from "./helper.js";
import {
  pgTable,
  integer,
  text,
  primaryKey,
  boolean,
  date,
} from "drizzle-orm/pg-core";

//Office Table
export const office = pgTable("office", {
  id: text("id").primaryKey(),
  address: text("address").notNull(),
  ...timestamps,
});
// Lab_Equipments Table
export const lab_equipments = pgTable("lab_Equipment", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  Primary_Callibration_Standard: text(
    "Primary_Callibration_Standard",
  ).notNull(),
  ...timestamps,
});

// Researchers Table
export const researchers = pgTable("researchers", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  is_Approved: boolean("is_Approved").notNull(),
  name: text("name").notNull(),
  phone_extension: text("phone_extension").references(() => office.id, {
    onDelete: "set null",
  }),
  ...timestamps,
});
// Skilled Table
export const skilled = pgTable(
  "skilled",
  {
    emp_id: integer("emp_id")
      .notNull()
      .references(() => researchers.id, { onDelete: "cascade" }),
    item_no: integer("item_no")
      .notNull()
      .references(() => lab_equipments.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [
    primaryKey({ name: "skill_id", columns: [table.emp_id, table.item_no] }),
  ],
);
// Journal_Issue Table
export const journal_issue = pgTable("journal_Issue", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  publication_date: date("publication_date").notNull(),
  title: text("title").notNull(),
  format: text("format").notNull(),
  emp_id: integer("emp_id").references(() => researchers.id, {
    onDelete: "set null",
  }),
  ...timestamps,
});
// Research_Paper Table
export const research_paper = pgTable("research_paper", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  title: text("title").notNull(),
  volume_identifier: integer("volume_identifier").references(
    () => journal_issue.id,
    { onDelete: "set null" },
  ),
  ...timestamps,
});
// Authors Table
export const authors = pgTable(
  "authors",
  {
    emp_id: integer("emp_id")
      .notNull()
      .references(() => researchers.id, { onDelete: "cascade" }),
    paper_id: integer("paper_id")
      .notNull()
      .references(() => research_paper.id, { onDelete: "cascade" }),
    is_lead_author: boolean("is_lead_author").notNull(),
    ...timestamps,
  },
  (table) => [
    primaryKey({ name: "author_id", columns: [table.emp_id, table.paper_id] }),
  ],
);
