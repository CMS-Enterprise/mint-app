ALTER TABLE plan_task RENAME COLUMN status TO state;
ALTER TYPE PLAN_TASK_STATUS RENAME TO PLAN_TASK_STATE;

UPDATE audit.table_config
SET insert_fields = '{state}'::TEXT[]
WHERE schema = 'public' AND name = 'plan_task';
