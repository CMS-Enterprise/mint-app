/* ADD Temp data column for this */

ALTER TABLE model_plan
RENAME COLUMN created_by TO created_by_old;


ALTER TABLE model_plan
RENAME COLUMN modified_by TO modified_by_old;


/* ADD Correct Column */
ALTER TABLE model_plan
ADD COLUMN created_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
ADD COLUMN modified_by UUID REFERENCES public.user_account (id) MATCH SIMPLE;

ALTER TABLE model_plan
DISABLE TRIGGER audit_trigger;

/* Perform the data migration */
WITH userAccount AS (
    SELECT
        model_plan.id AS primaryID,
        user_account_created.id AS created_by,
        user_account_modified.id AS modified_by
    FROM model_plan
    LEFT JOIN user_account AS user_account_created ON model_plan.created_by_old = user_account_created.username
    LEFT JOIN user_account AS user_account_modified ON model_plan.modified_by_old = user_account_modified.username
)
--

UPDATE model_plan
SET
    created_by = userAccount.created_by,
    modified_by = userAccount.modified_by

FROM userAccount
WHERE userAccount.primaryID
      = model_plan.id;


/*remove the old columns */
ALTER TABLE model_plan
DROP COLUMN created_by_old,
DROP COLUMN modified_by_old;

/*add constraints */
ALTER TABLE model_plan
ALTER COLUMN created_by SET NOT NULL;


/* update audit config */
UPDATE audit.table_config
SET uses_user_id = TRUE,
    modified_by = '00000001-0001-0001-0001-000000000001', --System Account
    modified_dts = current_timestamp
WHERE name = 'model_plan';

/* turn on audit trigger */

ALTER TABLE model_plan
ENABLE TRIGGER audit_trigger;
