/* ADD Temp data column for this */

ALTER TABLE plan_collaborator
RENAME COLUMN eua_user_id TO user_id_old;

ALTER TABLE plan_collaborator
RENAME COLUMN created_by TO created_by_old;


ALTER TABLE plan_collaborator
RENAME COLUMN modified_by TO modified_by_old;

/* ADD Correct Column */
ALTER TABLE plan_collaborator
ADD COLUMN user_id UUID REFERENCES public.user_account (id) MATCH SIMPLE,
ADD COLUMN created_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
ADD COLUMN modified_by UUID REFERENCES public.user_account (id) MATCH SIMPLE;

ALTER TABLE plan_collaborator
DISABLE TRIGGER audit_trigger;

/* Perform the data migration */
WITH userAccount AS (
    SELECT
        plan_collaborator.id AS collabID,
        plan_collaborator.model_plan_id,
        plan_collaborator.user_id_old,
        user_account.id AS user_id,
        user_account_created.id AS created_by,
        user_account_modified.id AS modified_by
    FROM plan_collaborator
    LEFT JOIN user_account ON plan_collaborator.user_id_old = user_account.username
    LEFT JOIN user_account AS user_account_created ON plan_collaborator.created_by_old = user_account_created.username
    LEFT JOIN user_account AS user_account_modified ON plan_collaborator.modified_by_old = user_account_modified.username
)
--

UPDATE plan_collaborator
SET
    created_by = userAccount.created_by,
    modified_by = userAccount.modified_by,
    user_id = userAccount.user_id
FROM userAccount
WHERE userAccount.collabID = plan_collaborator.id;


/*remove the old columns */
ALTER TABLE plan_collaborator
DROP COLUMN user_id_old,
DROP COLUMN created_by_old,
DROP COLUMN modified_by_old,
DROP COLUMN email,
DROP COLUMN full_name;

/*add constraints */
ALTER TABLE plan_collaborator
ALTER COLUMN user_id SET NOT NULL,
ALTER COLUMN created_by SET NOT NULL;


/*reintroduce unique index */


ALTER TABLE plan_collaborator
ADD CONSTRAINT unique_collaborator_per_plan UNIQUE (model_plan_id, user_id);

/* update audit config */
UPDATE audit.table_config
SET uses_user_id = TRUE,
    insert_fields = '{user_id, team_role}',
    modified_by = '00000001-0001-0001-0001-000000000001', --System Account
    modified_dts = current_timestamp
WHERE name = 'plan_collaborator';

/* turn on audit trigger */

ALTER TABLE plan_collaborator
ENABLE TRIGGER audit_trigger;
