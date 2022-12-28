ALTER TABLE analyzed_audit
ADD CONSTRAINT unique_model_plan_and_date UNIQUE (model_plan_id, date);
