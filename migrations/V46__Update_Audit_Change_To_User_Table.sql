/* Update AUDIT TABLE */
ALTER TABLE audit.change
RENAME COLUMN modified_by TO modified_by_old;

ALTER TABLE audit.change
ADD COLUMN modified_by UUID REFERENCES public.user_account (id) MATCH SIMPLE;

/***
* UPDATE THE TABLEs existing data to point to EUAID



* Update the function to insert USER
*
*/
WITH
UnMatched_UserNames AS (
    SELECT
        audit.change.modified_by_old AS USER_NAME,
        user_account_modified.id AS modified_by
    FROM audit.change
    LEFT JOIN user_account AS user_account_modified ON audit.change.modified_by_old = user_account_modified.username
    WHERE user_account_modified.id IS NULL AND audit.change.modified_by_old IS NOT NULL
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
WITH userAccount AS (
    SELECT
        audit.change.id AS changeID,
        user_account_modified.id AS modified_by
    FROM audit.change
    LEFT JOIN user_account AS user_account_modified ON audit.change.modified_by_old = user_account_modified.username
)

UPDATE audit.change
SET
    modified_by = userAccount.modified_by
FROM userAccount
WHERE userAccount.changeID = audit.change.id;


/*remove the old columns */
ALTER TABLE audit.change
DROP COLUMN modified_by_old;

/*add constraints */
ALTER TABLE audit.change
ALTER COLUMN modified_by SET NOT NULL;
