CREATE TYPE YES_NO_OTHER_TYPE AS ENUM (
  'YES',
  'NO',
  'OTHER'
);

-- Add quality_performance_impacts_payment_other to table
ALTER TABLE plan_ops_eval_and_learning
  ADD COLUMN quality_performance_impacts_payment_other zero_string;

-- Alter the quality_performance_impacts_payment column to use new YES_NO_OTHER_TYPE enum instead of BOOL
ALTER TABLE plan_ops_eval_and_learning
  ALTER COLUMN quality_performance_impacts_payment TYPE YES_NO_OTHER_TYPE USING (
        CASE quality_performance_impacts_payment
        WHEN TRUE  THEN 'YES'::YES_NO_OTHER_TYPE
        WHEN FALSE THEN 'NO'::YES_NO_OTHER_TYPE
        END
    );
