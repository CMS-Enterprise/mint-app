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


WITH
UnMatched AS (
    SELECT
        audit.table_config.created_by_old,
        user_account_created.id AS created_by,
        audit.table_config.modified_by_old,
        user_account_modified.id AS modified_by
    FROM audit.table_config
    LEFT JOIN user_account AS user_account_created ON (audit.table_config.created_by_old = user_account_created.username AND audit.table_config.created_by_old NOT IN ('MINT', 'UNKN'))
    LEFT JOIN user_account AS user_account_modified ON (audit.table_config.modified_by_old = user_account_modified.username AND audit.table_config.modified_by_old NOT IN ('MINT', 'UNKN'))
    WHERE user_account_modified.id IS NULL
),


UnMatched_UserNames AS (
    SELECT created_by_old AS USER_NAME FROM Unmatched
    WHERE created_by IS NULL AND created_by_old IS NOT NULL

    UNION
    SELECT modified_by_old AS USER_NAME FROM Unmatched
    WHERE modified_by IS NULL AND modified_by_old IS NOT NULL

)

-- Insert any missing user_accounts besides MINT or UNKN
INSERT INTO user_account
(
    id,
    username,
    is_euaid,
    common_name,
    locale,
    email,
    given_name,
    family_name,
    zone_info,
    has_logged_in
)
SELECT
    gen_random_uuid() AS id,
    UnMatched_UserNames.user_name AS username,
    TRUE AS is_euaid,
    UnMatched_UserNames.user_name AS common_name,
    'UNKNOWN' AS "locale",
    'UNKNOWN@UNKOWN.UNKNOWN' AS email,
    UnMatched_UserNames.user_name AS given_name,
    UnMatched_UserNames.user_name AS family_name,
    'UNKNOWN' AS zone_info,
    FALSE AS has_logged_in
FROM UnMatched_UserNames
WHERE UnMatched_UserNames.user_name NOT IN ('MINT', 'UNKN'); --Don't create for these


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
