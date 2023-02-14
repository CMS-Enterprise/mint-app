/* ADD Temp data column for this */

ALTER TABLE plan_general_characteristics
RENAME COLUMN ready_for_clearance_by TO ready_for_clearance_by_old;

ALTER TABLE plan_general_characteristics
RENAME COLUMN ready_for_review_by TO ready_for_review_by_old;

ALTER TABLE plan_general_characteristics
RENAME COLUMN created_by TO created_by_old;


ALTER TABLE plan_general_characteristics
RENAME COLUMN modified_by TO modified_by_old;


/* ADD Correct Column */
ALTER TABLE plan_general_characteristics
ADD COLUMN ready_for_clearance_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
ADD COLUMN ready_for_review_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
ADD COLUMN created_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
ADD COLUMN modified_by UUID REFERENCES public.user_account (id) MATCH SIMPLE;

ALTER TABLE plan_general_characteristics
DISABLE TRIGGER audit_trigger;

/* Perform the data migration */
WITH userAccount AS (
    SELECT
        plan_general_characteristics.id AS primaryID,
        user_account_ready_for_clearance.id AS ready_for_clearance_by,
        user_account_ready_for_review.id AS ready_for_review_by,
        user_account_created.id AS created_by,
        user_account_modified.id AS modified_by
    FROM plan_general_characteristics
    LEFT JOIN user_account AS user_account_ready_for_clearance ON plan_general_characteristics.ready_for_clearance_by_old = user_account_ready_for_clearance.username
    LEFT JOIN user_account AS user_account_ready_for_review ON plan_general_characteristics.ready_for_review_by_old = user_account_ready_for_review.username
    LEFT JOIN user_account AS user_account_created ON plan_general_characteristics.created_by_old = user_account_created.username
    LEFT JOIN user_account AS user_account_modified ON plan_general_characteristics.modified_by_old = user_account_modified.username
)
--

UPDATE plan_general_characteristics
SET
    created_by = userAccount.created_by,
    modified_by = userAccount.modified_by,
    ready_for_clearance_by = userAccount.ready_for_clearance_by,
    ready_for_review_by = userAccount.ready_for_review_by
FROM userAccount
WHERE userAccount.primaryID = plan_general_characteristics.id;


/*remove the old columns */
ALTER TABLE plan_general_characteristics
DROP COLUMN ready_for_clearance_by_old,
DROP COLUMN ready_for_review_by_old,
DROP COLUMN created_by_old,
DROP COLUMN modified_by_old;

/*add constraints */
ALTER TABLE plan_general_characteristics
ALTER COLUMN created_by SET NOT NULL;


/* update audit config */
UPDATE audit.table_config
SET uses_user_id = TRUE,
    modified_by = '00000001-0001-0001-0001-000000000001', --System Account
    modified_dts = current_timestamp
WHERE name = 'plan_general_characteristics';

/* turn on audit trigger */

ALTER TABLE plan_general_characteristics
ENABLE TRIGGER audit_trigger;
