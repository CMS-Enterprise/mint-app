/*
Update plan_task user reference columns from EUA_ID domain to UUID user_account IDs.
*/

ALTER TABLE plan_task
ALTER COLUMN created_by TYPE UUID USING created_by::UUID,
ALTER COLUMN modified_by TYPE UUID USING modified_by::UUID,
ALTER COLUMN completed_by TYPE UUID USING completed_by::UUID;

ALTER TABLE plan_task
ALTER COLUMN created_by SET NOT NULL,
ADD CONSTRAINT plan_task_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.user_account (id) MATCH SIMPLE,
ADD CONSTRAINT plan_task_modified_by_fkey FOREIGN KEY (modified_by) REFERENCES public.user_account (id) MATCH SIMPLE,
ADD CONSTRAINT plan_task_completed_by_fkey FOREIGN KEY (completed_by) REFERENCES public.user_account (id) MATCH SIMPLE;
