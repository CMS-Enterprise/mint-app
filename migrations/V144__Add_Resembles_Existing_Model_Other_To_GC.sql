

-- Alter the plan_general_characteristics column to use new YES_NO_OTHER_TYPE enum instead of BOOL
ALTER TABLE plan_general_characteristics
  ALTER COLUMN resembles_existing_model TYPE YES_NO_OTHER_TYPE USING (
        CASE quality_performance_impacts_payment
        WHEN TRUE  THEN 'YES'::YES_NO_OTHER_TYPE
        WHEN FALSE THEN 'NO'::YES_NO_OTHER_TYPE
        END
    );

ALTER TABLE plan_general_characteristics
  ADD COLUMN resembles_existing_model_other_specify ZERO_STRING,
  ADD COLUMN resembles_existing_model_other_selected BOOLEAN,
  ADD COLUMN resembles_existing_model_other_option ZERO_STRING;
