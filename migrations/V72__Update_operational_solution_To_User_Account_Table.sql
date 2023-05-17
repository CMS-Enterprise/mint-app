/* ADD Temp data column for this */

ALTER TABLE operational_solution
RENAME COLUMN created_by TO created_by_old;


ALTER TABLE operational_solution
RENAME COLUMN modified_by TO modified_by_old;


/* ADD Correct Column */
ALTER TABLE operational_solution
ADD COLUMN created_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
ADD COLUMN modified_by UUID REFERENCES public.user_account (id) MATCH SIMPLE;

ALTER TABLE operational_solution
DISABLE TRIGGER audit_trigger;

/* Perform the data migration */
WITH userAccount AS (
    SELECT
        operational_solution.id AS primaryID,
        user_account_created.id AS created_by,
        user_account_modified.id AS modified_by
    FROM operational_solution
    LEFT JOIN user_account AS user_account_created ON operational_solution.created_by_old = user_account_created.username
    LEFT JOIN user_account AS user_account_modified ON operational_solution.modified_by_old = user_account_modified.username
)
--

UPDATE operational_solution
SET
    created_by = userAccount.created_by,
    modified_by = userAccount.modified_by

FROM userAccount
WHERE userAccount.primaryID
      = operational_solution.id;


/*remove the old columns */
ALTER TABLE operational_solution
DROP COLUMN created_by_old,
DROP COLUMN modified_by_old;

/*add constraints */
ALTER TABLE operational_solution
ALTER COLUMN created_by SET NOT NULL;


/* update audit config */
UPDATE audit.table_config
SET uses_user_id = TRUE,
    modified_by = '00000001-0001-0001-0001-000000000001', --System Account
    modified_dts = current_timestamp
WHERE name = 'operational_solution';

/* turn on audit trigger */

ALTER TABLE operational_solution
ENABLE TRIGGER audit_trigger;
