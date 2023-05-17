/* ADD Temp data column for this */

ALTER TABLE discussion_reply
RENAME COLUMN created_by TO created_by_old;


ALTER TABLE discussion_reply
RENAME COLUMN modified_by TO modified_by_old;


/* ADD Correct Column */
ALTER TABLE discussion_reply
ADD COLUMN created_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
ADD COLUMN modified_by UUID REFERENCES public.user_account (id) MATCH SIMPLE;

ALTER TABLE discussion_reply
DISABLE TRIGGER audit_trigger;

/* Perform the data migration */
WITH userAccount AS (
    SELECT
        discussion_reply.id AS primaryID,
        user_account_created.id AS created_by,
        user_account_modified.id AS modified_by
    FROM discussion_reply
    LEFT JOIN user_account AS user_account_created ON discussion_reply.created_by_old = user_account_created.username
    LEFT JOIN user_account AS user_account_modified ON discussion_reply.modified_by_old = user_account_modified.username
)
--

UPDATE discussion_reply
SET
    created_by = userAccount.created_by,
    modified_by = userAccount.modified_by

FROM userAccount
WHERE userAccount.primaryID
      = discussion_reply.id;


/*remove the old columns */
ALTER TABLE discussion_reply
DROP COLUMN created_by_old,
DROP COLUMN modified_by_old;

/*add constraints */
ALTER TABLE discussion_reply
ALTER COLUMN created_by SET NOT NULL;


/* update audit config */
UPDATE audit.table_config
SET uses_user_id = TRUE,
    modified_by = '00000001-0001-0001-0001-000000000001', --System Account
    modified_dts = current_timestamp
WHERE name = 'discussion_reply';

/* turn on audit trigger */

ALTER TABLE discussion_reply
ENABLE TRIGGER audit_trigger;
