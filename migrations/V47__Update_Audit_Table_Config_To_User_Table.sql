/* Update AUDIT TABLE */

ALTER TABLE audit.table_config
ADD COLUMN uses_user_id BOOLEAN NOT NULL DEFAULT FALSE;
COMMENT ON COLUMN audit.table_config.uses_user_id IS
'Uses_user_id is meant to facilitate the migration of all tables to use the user table. It will serve as a record for the audit trigger to distinguish when the table has been migrated.
Once all tables have been migrate, this column should be removed as it is no longer needed.';

ALTER TABLE audit.table_config
RENAME COLUMN created_by TO created_by_old;


ALTER TABLE audit.table_config
RENAME COLUMN modified_by TO modified_by_old;

ALTER TABLE audit.table_config
ADD COLUMN created_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
ADD COLUMN modified_by UUID REFERENCES public.user_account (id) MATCH SIMPLE;



/* Perform the data migration */
WITH userAccount AS (
    SELECT
        audit.table_config.id AS configID,
        audit.table_config.created_by_old,
        user_account_created.id AS created_by_user_id,
        audit.table_config.modified_by_old,
        user_account_modified.id AS modified_by_user_id
    FROM audit.table_config
    LEFT JOIN user_account AS user_account_created ON audit.table_config.created_by_old = user_account_created.username
    LEFT JOIN user_account AS user_account_modified ON audit.table_config.modified_by_old = user_account_modified.username
)

UPDATE audit.table_config
SET created_by
    = CASE WHEN userAccount.created_by_old = 'MINT' THEN '00000001-0001-0001-0001-000000000001' --SYSTEM
    WHEN userAccount.created_by_old = 'UNKN' THEN '00000000-0000-0000-0000-000000000000' --UNKNOWN
    ELSE
        userAccount.created_by_user_id
    END,
    modified_by
    = CASE WHEN userAccount.modified_by_old = 'MINT' THEN '00000001-0001-0001-0001-000000000001' --SYSTEM
        WHEN userAccount.modified_by_old = 'UNKN' THEN '00000000-0000-0000-0000-000000000000' --UNKNOWN
        ELSE
            userAccount.modified_by_user_id
    END
FROM userAccount
WHERE userAccount.configID = audit.table_config.id;


/*remove the old columns */
ALTER TABLE audit.table_config
DROP COLUMN created_by_old,
DROP COLUMN modified_by_old;

/*add constraints */
ALTER TABLE audit.table_config
ALTER COLUMN created_by SET NOT NULL;
