ALTER TABLE plan_document
ADD COLUMN plan_task_id UUID REFERENCES public.plan_task(id);
