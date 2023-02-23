/* ADD Temp data column for this */

ALTER TABLE possible_need_solution_link
RENAME COLUMN created_by TO created_by_old;


ALTER TABLE possible_need_solution_link
RENAME COLUMN modified_by TO modified_by_old;


/* ADD Correct Column */
ALTER TABLE possible_need_solution_link
ADD COLUMN created_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
ADD COLUMN modified_by UUID REFERENCES public.user_account (id) MATCH SIMPLE;


/* Perform the data migration */

UPDATE possible_need_solution_link
SET
    created_by = '00000001-0001-0001-0001-000000000001'; -- We know it is only MINT, which is the user account

/*remove the old columns */
ALTER TABLE possible_need_solution_link
DROP COLUMN created_by_old,
DROP COLUMN modified_by_old;

/*add constraints */
ALTER TABLE possible_need_solution_link
ALTER COLUMN created_by SET NOT NULL;
