/* ADD Temp data column for this */

ALTER TABLE plan_document_solution_link
RENAME COLUMN created_by TO created_by_old;


ALTER TABLE plan_document_solution_link
RENAME COLUMN modified_by TO modified_by_old;


/* ADD Correct Column */
ALTER TABLE plan_document_solution_link
ADD COLUMN created_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
ADD COLUMN modified_by UUID REFERENCES public.user_account (id) MATCH SIMPLE;

ALTER TABLE plan_document_solution_link
DISABLE TRIGGER audit_trigger;

/* Perform the data migration */
WITH userAccount AS (
    SELECT
        plan_document_solution_link.id AS primaryID,
        user_account_created.id AS created_by,
        user_account_modified.id AS modified_by
    FROM plan_document_solution_link
    LEFT JOIN user_account AS user_account_created ON plan_document_solution_link.created_by_old = user_account_created.username
    LEFT JOIN user_account AS user_account_modified ON plan_document_solution_link.modified_by_old = user_account_modified.username
)
--

UPDATE plan_document_solution_link
SET
    created_by = userAccount.created_by,
    modified_by = userAccount.modified_by

FROM userAccount
WHERE userAccount.primaryID
      = plan_document_solution_link.id;


/*remove the old columns */
ALTER TABLE plan_document_solution_link
DROP COLUMN created_by_old,
DROP COLUMN modified_by_old;

/*add constraints */
ALTER TABLE plan_document_solution_link
ALTER COLUMN created_by SET NOT NULL;


/* update audit config */
UPDATE audit.table_config
SET uses_user_id = TRUE,
    modified_by = '00000001-0001-0001-0001-000000000001', --System Account
    modified_dts = current_timestamp
WHERE name = 'plan_document_solution_link';

/* turn on audit trigger */

ALTER TABLE plan_document_solution_link
ENABLE TRIGGER audit_trigger;
