-- /*  Change data type from EUAID to TEXT */

-- ALTER TABLE plan_favorite
-- ALTER COLUMN user_id TYPE TEXT;


/* ADD Temp data column for this */

ALTER TABLE plan_favorite
RENAME COLUMN user_id TO user_id_old;

ALTER TABLE plan_favorite
RENAME COLUMN created_by TO created_by_old;


ALTER TABLE plan_favorite
RENAME COLUMN modified_by TO modified_by_old;

/* ADD Correct Column */
ALTER TABLE plan_favorite
ADD COLUMN user_id UUID,
ADD COLUMN created_by UUID,
ADD COLUMN modified_by UUID;

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
    INNER JOIN user_account ON plan_favorite.user_id_old = user_account.username
    INNER JOIN user_account AS user_account_created ON plan_favorite.created_by_old = user_account_created.username
    INNER JOIN user_account AS user_account_modified ON plan_favorite.modified_by_old = user_account_modified.username
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

/*TODO
SET FOREIGN KEY RELATIONSHIPS TO THE USER TABLE FOR THOSE FIELDS!!! MAYBE DO IT EARLIER WHEN WE ADD THE TABLE!!

*/
