ALTER TABLE model_plan
ADD COLUMN mto_ready_for_review_by UUID REFERENCES user_account(id),
ADD COLUMN mto_ready_for_review_dts TIMESTAMP WITH TIME ZONE;
