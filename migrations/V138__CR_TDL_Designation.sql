-- https://jiraent.cms.gov/browse/EASI-3495
CREATE TYPE CR_TDL_TYPE AS ENUM ('CR', 'TDL');

ALTER TABLE plan_cr_tdl ADD COLUMN type CR_TDL_TYPE;
ALTER TABLE plan_cr_tdl ADD COLUMN date_implemented TIMESTAMP;

-- Initial constraint ensures that date_implemented isn't set on TDLs
-- NOTE: This doesn't specifically require that date_implemented is set on CRs
-- because all existing cr_tdl entries will not have them set.
--
-- They're required in the API, but not in the DB, at this time.
ALTER TABLE plan_cr_tdl ADD CONSTRAINT date_implemented_not_set_on_tdl CHECK (type = 'CR' OR (type = 'TDL' AND date_implemented IS NULL));

-- Set all existing entries to CRs by default
UPDATE plan_cr_tdl SET
	type = 'CR',
	modified_by = '00000001-0001-0001-0001-000000000001',
	modified_dts = now();

-- Set NOT NULL constraint on type, now that it's been set across the board
ALTER TABLE plan_cr_tdl ALTER COLUMN type SET NOT NULL; 
