-- -- https://jiraent.cms.gov/browse/EASI-3495

-- ALTER TABLE plan_cr_tdl ADD COLUMN date_implemented TIMESTAMP;

-- ALTER TABLE plan_cr_tdl RENAME TO plan_cr;

-- /* Update audit table to rename cr_tdl to plan_cr */
-- UPDATE "audit"."table_config" SET "name"='plan_cr' WHERE "name"='plan_cr_tdl' 
