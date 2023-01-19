/* ADD Temp data column for this */

ALTER TABLE plan_favorite
RENAME COLUMN user_id TO user_id_old;

ALTER TABLE plan_favorite
RENAME COLUMN created_by TO created_by_old;


ALTER TABLE plan_favorite
RENAME COLUMN modified_by TO modified_by_old;

/* ADD Correct Column */
ALTER TABLE plan_favorite
ADD COLUMN user_id UUID REFERENCES public.user_account (id) MATCH SIMPLE,
ADD COLUMN created_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
ADD COLUMN modified_by UUID REFERENCES public.user_account (id) MATCH SIMPLE;

/* Add Any accounts that are missing with placeholder data */

WITH
UnMatched AS (
    SELECT
        plan_favorite.id AS favoriteID,
        plan_favorite.model_plan_id,
        plan_favorite.user_id_old,
        plan_favorite.created_by_old,
        plan_favorite.modified_by_old,
        user_account.id AS user_id,
        user_account_created.id AS created_by,
        user_account_modified.id AS modified_by
    FROM plan_favorite
    LEFT JOIN user_account ON plan_favorite.user_id_old = user_account.username
    LEFT JOIN user_account AS user_account_created ON plan_favorite.created_by_old = user_account_created.username
    LEFT JOIN user_account AS user_account_modified ON plan_favorite.modified_by_old = user_account_modified.username
    WHERE user_account.id IS NULL OR user_account_created.id IS NULL OR user_account_modified.id IS NULL
),

UnMatched_UserNames AS (
    SELECT user_id_old AS USER_NAME FROM Unmatched
    WHERE user_id IS NULL AND user_id_old IS NOT NULL

    UNION
    SELECT created_by_old AS USER_NAME FROM Unmatched
    WHERE created_by IS NULL AND created_by_old IS NOT NULL

    UNION
    SELECT modified_by_old AS USER_NAME FROM Unmatched
    WHERE modified_by IS NULL AND modified_by_old IS NOT NULL

)

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
        plan_favorite.id AS favoriteID,
        plan_favorite.model_plan_id,
        plan_favorite.user_id_old,
        user_account.id AS user_id,
        user_account_created.id AS created_by,
        user_account_modified.id AS modified_by
    FROM plan_favorite
    LEFT JOIN user_account ON plan_favorite.user_id_old = user_account.username
    LEFT JOIN user_account AS user_account_created ON plan_favorite.created_by_old = user_account_created.username
    LEFT JOIN user_account AS user_account_modified ON plan_favorite.modified_by_old = user_account_modified.username
)

UPDATE plan_favorite
SET
    created_by = userAccount.created_by,
    modified_by = userAccount.modified_by,
    user_id = userAccount.user_id
FROM userAccount
WHERE userAccount.favoriteID = plan_favorite.id;


/*remove the old columns */
ALTER TABLE plan_favorite
DROP COLUMN user_id_old,
DROP COLUMN created_by_old,
DROP COLUMN modified_by_old;

/*add constraints */
ALTER TABLE plan_favorite
ALTER COLUMN user_id SET NOT NULL,
ALTER COLUMN created_by SET NOT NULL;


/*reintroduce unique index */

CREATE UNIQUE INDEX idx_plan_favorite_user
ON plan_favorite(model_plan_id, user_id);
