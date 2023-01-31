/* Update AUDIT TABLE */
ALTER TABLE audit.change
RENAME COLUMN modified_by TO modified_by_old;

ALTER TABLE audit.change
ADD COLUMN modified_by UUID REFERENCES public.user_account (id) MATCH SIMPLE;


/* Perform the data migration */

WITH AccountJoins AS (
    SELECT
        audit.change.id AS changeID,
        audit.change.modified_by_old,
        user_account_modified.id AS modified_by_user_id
    FROM audit.change
    LEFT JOIN user_account AS user_account_modified ON audit.change.modified_by_old = user_account_modified.username
),


userAccount AS ( /*  MINT AND UNK should point to the system user account, or the UNKNOWN ACCOUNT */
    SELECT
        changeID,
        CASE WHEN modified_by_old = 'MINT' THEN '00000001-0001-0001-0001-000000000001' --SYSTEM
            WHEN modified_by_old = 'UNKN' THEN '00000000-0000-0000-0000-000000000000' --UNKNOWN
            ELSE
                modified_by_user_id
        END
        AS modified_by
    FROM AccountJoins
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
