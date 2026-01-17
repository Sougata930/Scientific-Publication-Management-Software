CREATE TABLE "Researcher"(
    "Emp_id" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "Phone_extension" BIGINT NOT NULL
);
ALTER TABLE
    "Researcher" ADD PRIMARY KEY("Emp_id");
CREATE TABLE "Office"(
    "Phone_extension" VARCHAR(255) NOT NULL,
    "Address" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "Office" ADD PRIMARY KEY("Phone_extension");
CREATE TABLE "Lab_Equipments"(
    "Item_no" BIGINT NOT NULL,
    "Name" VARCHAR(255) NOT NULL,
    "Primary_Callibration_Standard" BIGINT NOT NULL
);
ALTER TABLE
    "Lab_Equipments" ADD PRIMARY KEY("Item_no");
CREATE TABLE "SKilled"(
    "Emp_id" BIGINT NOT NULL,
    "Item_no" BIGINT NOT NULL
);
ALTER TABLE
    "SKilled" ADD PRIMARY KEY("Emp_id");
ALTER TABLE
    "SKilled" ADD PRIMARY KEY("Item_no");
CREATE TABLE "Research_Paper"(
    "Paper_id" BIGINT NOT NULL,
    "Title" VARCHAR(255) NOT NULL,
    "Lead_author" VARCHAR(255) NOT NULL,
    "Volume_Identifier" BIGINT NOT NULL
);
ALTER TABLE
    "Research_Paper" ADD PRIMARY KEY("Paper_id");
CREATE TABLE "Authors"(
    "Emp_id" BIGINT NOT NULL,
    "Paper_id" BIGINT NOT NULL
);
ALTER TABLE
    "Authors" ADD PRIMARY KEY("Emp_id");
ALTER TABLE
    "Authors" ADD PRIMARY KEY("Paper_id");
CREATE TABLE "Journal_Issue"(
    "Volume_identifier" BIGINT NOT NULL,
    "Publication_date" DATE NOT NULL,
    "Title" VARCHAR(255) NOT NULL,
    "Format" VARCHAR(255) NOT NULL,
    "Emp_id" BIGINT NOT NULL
);
ALTER TABLE
    "Journal_Issue" ADD PRIMARY KEY("Volume_identifier");
ALTER TABLE
    "Researcher" ADD CONSTRAINT "researcher_phone_extension_foreign" FOREIGN KEY("Phone_extension") REFERENCES "Office"("Phone_extension");
ALTER TABLE
    "Authors" ADD CONSTRAINT "authors_emp_id_foreign" FOREIGN KEY("Emp_id") REFERENCES "Researcher"("Emp_id");
ALTER TABLE
    "Journal_Issue" ADD CONSTRAINT "journal_issue_emp_id_foreign" FOREIGN KEY("Emp_id") REFERENCES "Researcher"("Emp_id");
ALTER TABLE
    "Research_Paper" ADD CONSTRAINT "research_paper_lead_author_foreign" FOREIGN KEY("Lead_author") REFERENCES "Researcher"("Emp_id");
ALTER TABLE
    "Research_Paper" ADD CONSTRAINT "research_paper_paper_id_foreign" FOREIGN KEY("Paper_id") REFERENCES "Authors"("Paper_id");
ALTER TABLE
    "Lab_Equipments" ADD CONSTRAINT "lab_equipments_item_no_foreign" FOREIGN KEY("Item_no") REFERENCES "SKilled"("Item_no");
ALTER TABLE
    "Research_Paper" ADD CONSTRAINT "research_paper_volume_identifier_foreign" FOREIGN KEY("Volume_Identifier") REFERENCES "Journal_Issue"("Volume_identifier");
ALTER TABLE
    "SKilled" ADD CONSTRAINT "skilled_emp_id_foreign" FOREIGN KEY("Emp_id") REFERENCES "Researcher"("Emp_id");