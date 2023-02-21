/* ADD Temp data column for this */

ALTER TABLE analyzed_audit
RENAME COLUMN created_by TO created_by_old;


ALTER TABLE analyzed_audit
RENAME COLUMN modified_by TO modified_by_old;


/* ADD Correct Column */
ALTER TABLE analyzed_audit
ADD COLUMN created_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
ADD COLUMN modified_by UUID REFERENCES public.user_account (id) MATCH SIMPLE;



UPDATE analyzed_audit
SET
    created_by = '00000001-0001-0001-0001-000000000001'; -- We know it is only MINT, which is the user account

/*remove the old columns */
ALTER TABLE analyzed_audit
DROP COLUMN created_by_old,
DROP COLUMN modified_by_old;

/*add constraints */
ALTER TABLE analyzed_audit
ALTER COLUMN created_by SET NOT NULL;
