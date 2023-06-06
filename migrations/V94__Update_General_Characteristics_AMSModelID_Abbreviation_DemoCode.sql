ALTER TABLE plan_general_characteristics
  ADD COLUMN demo_code zero_string,
  ADD COLUMN ams_model_id uuid,
  ADD COLUMN model_abbreviation zero_string;
