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
WITH
UnMatched AS (
    SELECT
        audit.change.user_id_old,
        audit.change.created_by_old,
        audit.change.modified_by_old,
        user_account_created.id AS created_by,
        user_account_modified.id AS modified_by
    FROM audit.change
    LEFT JOIN user_account AS user_account_created ON audit.change.created_by_old = user_account_created.username
    LEFT JOIN user_account AS user_account_modified ON audit.change.modified_by_old = user_account_modified.username
    WHERE user_account.id IS NULL OR user_account_created.id IS NULL OR user_account_modified.id IS NULL
),

UnMatched_UserNames AS (
    SELECT created_by_old AS USER_NAME FROM Unmatched
    WHERE created_by IS NULL AND created_by_old IS NOT NULL

    UNION
    SELECT modified_by_old AS USER_NAME FROM Unmatched
    WHERE modified_by IS NULL AND modified_by_old IS NOT NULL

)

-- Insert any missing user_accounts
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
FROM UnMatched_UserNames;


/* Perform the data migration */
WITH userAccount AS (  --noqa
    SELECT
        audit.change.id AS changeID,
        user_account.id AS user_id,
        user_account_created.id AS created_by,
        user_account_modified.id AS modified_by
    FROM audit.change
    LEFT JOIN user_account AS user_account_created ON audit.change.created_by_old = user_account_created.username
    LEFT JOIN user_account AS user_account_modified ON audit.change.modified_by_old = user_account_modified.username
)

UPDATE audit.change
SET
    created_by = userAccount.created_by,
    modified_by = userAccount.modified_by,
FROM userAccount
WHERE userAccount.changeID = audit.change.id;


/*remove the old columns */
ALTER TABLE audit.change
DROP COLUMN created_by_old,
DROP COLUMN modified_by_old;

/*add constraints */
ALTER TABLE audit.change
ALTER COLUMN created_by SET NOT NULL;
