ALTER TABLE model_plan
ADD COLUMN experiment_column int DEFUALT 10;

ALTER TABLE model_plan_history
ADD COLUMN experiment_column int;