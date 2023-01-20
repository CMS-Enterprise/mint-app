/* Update AUDIT TABLE */
ALTER TABLE audit.change
RENAME COLUMN modified_by TO modified_by_old;

/* Update AUDIT TABLE */
ALTER TABLE audit.change
RENAME COLUMN created_by TO created_by_old;

ALTER TABLE audit.change
ADD COLUMN modified_by UUID REFERENCES public.user_account (id) MATCH SIMPLE;

ALTER TABLE audit.table_config
ADD COLUMN uses_user_id BOOLEAN NOT NULL DEFAULT FALSE;
COMMENT ON COLUMN audit.table_config.uses_user_id IS
'Uses_user_id is meant to facilitate the migration of all tables to use the user table. It will serve as a record for the audit trigger to distinguish when the table has been migrated.
Once all tables have been migrate, this column should be removed as it is no longer needed.';
/***
* UPDATE THE TABLEs existing data to point to EUAID



* Update the function to insert USER
*
*/
