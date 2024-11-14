ALTER TABLE model_plan
ADD COLUMN mto_ready_for_review_by UUID REFERENCES user(id),
ADD COLUMN mto_ready_for_review_dts TIME WITH TIMEZONE;
